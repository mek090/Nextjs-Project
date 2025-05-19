import { NextResponse } from "next/server";
import { getAuthUser } from "@/actions/actions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getAuthUser();
    console.log('Fetching notifications for user:', user.id);

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: {
        review: {
          include: {
            location: true
          }
        },
        reply: {
          include: {
            profile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found notifications:', notifications.length);
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthUser();
    const { notificationId } = await req.json();

    await prisma.notification.update({
      where: {
        id: notificationId,
        recipientId: user.id
      },
      data: {
        isRead: true
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
} 