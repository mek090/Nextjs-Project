"use client";

import { Heart, RotateCw } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { toggleFavoriteAction, checkFavoriteStatus } from "@/actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FavoriteToggleButton = ({
    locationId,
    initialIsFavorite
}: {
    locationId: string,
    initialIsFavorite: boolean
}) => {
    const { userId } = useAuth();
    const router = useRouter();
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
    }, [userId, locationId, initialIsFavorite]);

    // อัพเดทสถานะเมื่อ initialIsFavorite เปลี่ยน
    useEffect(() => {
        setIsFavorite(initialIsFavorite);
    }, [initialIsFavorite]);

    const handleToggleFavorite = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            // ใช้สถานะปัจจุบันจาก state แทนการเช็คจาก database อีกครั้ง
            const newStatus = !isFavorite;
            await toggleFavoriteAction(locationId, userId, newStatus);
            setIsFavorite(newStatus);

            // แสดง toast notification
            if (newStatus) {
                toast.success("เพิ่มในรายการโปรดแล้ว", {
                    description: "สถานที่นี้ถูกเพิ่มในรายการโปรดของคุณ"
                });
            } else {
                toast.info("ลบออกจากรายการโปรดแล้ว", {
                    description: "สถานที่นี้ถูกลบออกจากรายการโปรดของคุณ"
                });
            }

            // Revalidate หน้าเพื่ออัพเดทสถานะ
            router.refresh();
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            toast.error("เกิดข้อผิดพลาด", {
                description: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง"
            });
            // ถ้าเกิด error ให้กลับไปสถานะเดิม
            setIsFavorite(!isFavorite);
        } finally {
            setLoading(false);
        }
    };

    if (!userId) {
        return (
            <SignInButton mode="modal">
                <Button size='lg'
                    className="flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 hover:bg-gray-50 text-gray-700 py-1.5 px-1.5 sm:px-2 rounded-lg transition-colors duration-200 text-xs sm:text-sm">
                    <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                </Button>
            </SignInButton>
        );
    }

    return (
        <Button size='lg'
            onClick={handleToggleFavorite}
            disabled={loading}
            className="flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-200 hover:bg-gray-50 text-gray-700 py-1.5 px-1.5 sm:px-2 rounded-lg transition-all duration-200 text-xs sm:text-sm"
        >
            {loading ? (
                <RotateCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 animate-spin" />
            ) : (
                <Heart
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 dark:text-white transition-transform duration-200 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : "scale-100"}`}
                />
            )}
        </Button>
    );
};

export default FavoriteToggleButton;