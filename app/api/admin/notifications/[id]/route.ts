import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { withAuth } from "@/lib/middleware/auth";
import { UserRole } from "@prisma/client";

async function updateNotificationHandler(request: NextRequest & { user: any }) {
  try {
    const id = request.nextUrl.pathname.split('/').pop() || '';
    const { read } = await request.json();

    const notification = await prisma.notification.update({
      where: { id },
      data: { read: read ?? true },
    });

    return NextResponse.json(notification);
  } catch (error: any) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

async function deleteNotificationHandler(request: NextRequest & { user: any }) {
  try {
    const id = request.nextUrl.pathname.split('/').pop() || '';

    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error: any) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(updateNotificationHandler, [UserRole.ADMIN]);
export const DELETE = withAuth(deleteNotificationHandler, [UserRole.ADMIN]);