import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { prisma } from "./database";

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

class NotificationWebSocketServer {
  private wss: WebSocketServer | null = null;
  private clients: Set<ExtendedWebSocket> = new Set();

  initialize(server: any) {
    this.wss = new WebSocketServer({ server, path: "/api/ws/notifications" });

    this.wss.on("connection", (ws: ExtendedWebSocket, request: IncomingMessage) => {
      ws.isAlive = true;
      this.clients.add(ws);

      // Handle ping/pong for connection health
      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(ws, message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      });

      ws.on("close", () => {
        this.clients.delete(ws);
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(ws);
      });
    });

    // Ping clients every 30 seconds to keep connections alive
    setInterval(() => {
      this.clients.forEach((ws) => {
        if (!ws.isAlive) {
          ws.terminate();
          this.clients.delete(ws);
          return;
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 60000);
  }

  private handleMessage(ws: ExtendedWebSocket, message: any) {
    switch (message.type) {
      case "auth":
        ws.userId = message.userId;
        break;
      case "ping":
        ws.send(JSON.stringify({ type: "pong" }));
        break;
    }
  }

  broadcastNotification(notification: any) {
    if (!this.wss) return;

    const message = JSON.stringify({
      type: "notification",
      data: notification,
    });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  broadcastGalleryUpdate(update: any) {
    if (!this.wss) return;

    const message = JSON.stringify({
      type: "gallery_update",
      data: update,
    });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  sendToUser(userId: string, notification: any) {
    if (!this.wss) return;

    const message = JSON.stringify({
      type: "notification",
      data: notification,
    });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.userId === userId) {
        client.send(message);
      }
    });
  }

  getConnectedClientsCount(): number {
    return this.clients.size;
  }
}

export const notificationWebSocket = new NotificationWebSocketServer();

// Helper function to create and broadcast notifications
export async function createAndBroadcastNotification(
  title: string,
  description: string,
  type: "INFO" | "WARNING" | "SUCCESS" = "INFO"
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title,
        description,
        type,
      },
    });

    notificationWebSocket.broadcastNotification(notification);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}