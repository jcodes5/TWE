import { NextRequest } from "next/server";

// This is a placeholder route for WebSocket connections
// The actual WebSocket server is initialized in the server setup
export async function GET(request: NextRequest) {
  return new Response("WebSocket endpoint", { status: 200 });
}