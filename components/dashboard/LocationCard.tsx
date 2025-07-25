'use client'

import { Pencil, Trash2, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { deleteLocationAction } from '@/actions/actions';
import Image from "next/image"

interface Location {
  id: string
  name: string
  description: string
  image: string[]
  districts: string
  openTime?: string | null
  closeTime?: string | null
  locations?: string[]
}

interface LocationCardProps {
  location: Location
}

export default function LocationCard({ location }: LocationCardProps) {

  const [showModal, setShowmodal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('id', location.id);
    await deleteLocationAction(undefined, formData); // เรียก action ลบ
    setLoading(false);
    // อาจจะ refresh หรือ remove card จาก state
    window.location.reload(); // หรือใช้ router.refresh() ถ้าใช้ next/navigation
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white dark:bg-gray-800">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={location.image[0] || "/placeholder.jpg"} // fallback เผื่อรูปว่าง
          alt={location.name}
          fill
          sizes="100%" // หรือจะใช้ "400px" ก็ได้ถ้าอยาก fix
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority={false} // ถ้าอยาก preload ภาพหน้าแรกให้ใส่ true
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold line-clamp-1 text-gray-900 dark:text-gray-100">
          {location.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
          {location.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{location.districts}</span>
          </div>

          {location.openTime && location.closeTime && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{location.openTime} - {location.closeTime}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Link href={`/locations/edit/${location.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950"
            >
              <Pencil className="h-4 w-4 mr-1" />
              แก้ไข
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600 flex items-center gap-2">
                  <Trash2 className="h-6 w-6" />
                  ยืนยันการลบสถานที่
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">
                  คุณกำลังจะลบสถานที่ <span className="font-semibold">{location.name}</span>
                </p>
                <p className="text-red-600">
                  การกระทำนี้ไม่สามารถย้อนกลับได้ คุณแน่ใจหรือไม่ว่าต้องการลบสถานที่นี้?
                </p>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                    {loading ? "กำลังลบ..." : "ยืนยันการลบ"}
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">ยกเลิก</Button>
                  </DialogClose>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}