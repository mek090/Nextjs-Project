"use client"

import { Search } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"





const EmptyList = ({
    heading = 'ไม่พบสถานที่ที่คุณค้นหา',
    messafe = 'ลองค้นหาด้วยคำค้นหาอื่น หรือเลือกหมวดหมู่อื่นเพื่อค้นหาสถานที่ที่คุณสนใจ',
    btnText = 'กลับไปหน้าหลัก',
}: {
    heading?: string,
    messafe?: string,
    btnText?: string
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">

            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {heading}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                {messafe}
            </p>
            <Button className="mt-9 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" asChild>
                <Link href="/">
                    {btnText}
                </Link>
            </Button>
        </div>
    )
}

export default EmptyList 