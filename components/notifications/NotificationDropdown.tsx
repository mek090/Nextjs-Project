"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { supabase } from "@/utils/supabase";

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  review?: {
    id: string;
    location: {
      id: string;
      name: string;
    };
  };
  reply?: {
    id: string;
    profile: {
      firstname: string;
      lastname: string;
    };
  };
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      console.log('Fetched notifications data:', data);

      if (!data || !data.notifications) {
        // console.error("Invalid notifications data:", data);
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      setNotifications(data.notifications);
      const unread = data.notifications.filter((n: Notification) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.review?.location) {
      router.push(`/locations/${notification.review.location.id}`);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchNotifications();

    try {
      // Subscribe to realtime changes
      const channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'Notification',
            filter: `recipientId=eq.${user.id}`
          },
          (payload) => {
            console.log('New notification received:', payload);
            fetchNotifications(); // Fetch updated notifications
          }
        )
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error setting up Supabase realtime:', error);
      // Fallback to polling if realtime fails
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
    }
  }, [user]);

  if (!notifications.length === null) {
    return (
      <button>
        {!notifications.length ? (
          <Skeleton className="w-10 h-10" />
        ) : (
          <BellRing className="h-5 w-5" />
        )}
      </button>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <BellRing className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            ไม่มีการแจ้งเตือน
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`p-4 cursor-pointer ${!notification.isRead ? "bg-gray-200" : ""}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 