"use client";

import { Heart, RotateCw } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { toggleFavoriteAction, checkFavoriteStatus } from "@/actions/actions";
import { toast } from "sonner";

const FavoriteToggleButton = ({
    locationId,
    initialIsFavorite
}: {
    locationId: string,
    initialIsFavorite: boolean
}) => {
    const { userId } = useAuth();
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [loading, setLoading] = useState(false);

    // เช็คสถานะ Favorite เมื่อโหลดหน้า
    useEffect(() => {
        const checkStatus = async () => {
            if (!userId) return;
            try {
                const status = await checkFavoriteStatus(userId, locationId);
                setIsFavorite(status);
            } catch (error) {
                console.error("Failed to check favorite status:", error);
            }
        };
        checkStatus();
    }, [userId, locationId]);

    const handleToggleFavorite = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            // เช็คสถานะปัจจุบันก่อนทำการ toggle
            const currentStatus = await checkFavoriteStatus(userId, locationId);
            if (currentStatus !== isFavorite) {
                setIsFavorite(currentStatus);
            }
            await toggleFavoriteAction(locationId, userId, !currentStatus);
            setIsFavorite(!currentStatus);

            // แสดง toast notification
            if (!currentStatus) {
                toast.success("เพิ่มในรายการโปรดแล้ว", {
                    description: "สถานที่นี้ถูกเพิ่มในรายการโปรดของคุณ"
                });
            } else {
                toast.info("ลบออกจากรายการโปรดแล้ว", {
                    description: "สถานที่นี้ถูกลบออกจากรายการโปรดของคุณ"
                });
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            toast.error("เกิดข้อผิดพลาด", {
                description: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง"
            });
        } finally {
            setLoading(false);
        }
    };

    if (!userId) {
        return (
            <SignInButton mode="modal">
                <Button size='lg'
                    className="flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 hover:bg-gray-50 text-gray-700 py-1.5 px-2 rounded-lg transition-colors duration-200 text-sm">
                    <Heart className="w-4 h-4" />
                </Button>
            </SignInButton>
        );
    }

    return (
        <Button size='lg'
            onClick={handleToggleFavorite}
            disabled={loading}
            className="flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-200 hover:bg-gray-50 text-gray-700 py-1.5 px-2 rounded-lg transition-all duration-200 text-sm"
        >
            {loading ? (
                <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
                <Heart
                    className={`w-4 h-4  dark:text-white transition-transform duration-200 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "scale-100"}`}
                />
            )}
        </Button>
    );
};

export default FavoriteToggleButton;