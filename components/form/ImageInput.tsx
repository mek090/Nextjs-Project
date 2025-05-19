'use client'

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useState } from "react"

const ImageInput = () => {
    const name = 'image'
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const maxSize = 2 * 1024 * 1024 // 2MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
            
            if (file.size > maxSize) {
                setError(`ขนาดไฟล์ต้องไม่เกิน ${maxSize / (1024 * 1024)}MB`)
                e.target.value = '' // รีเซ็ต input
            } else if (!allowedTypes.includes(file.type)) {
                setError(`รองรับเฉพาะไฟล์ประเภท: ${allowedTypes.join(', ')}`)
                e.target.value = '' // รีเซ็ต input
            } else {
                setError(null)
            }
        }
    }

    return (
        <div>
            <Label className="capitalize">
                {name}
            </Label>
            <Input
                id={name}
                name={name}
                type="file"
                required
                accept="image/*"
                className="mt-1 mb-2"
                onChange={handleFileChange}
            />
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
                รองรับไฟล์ JPG, PNG, WEBP ขนาดไม่เกิน 2MB
            </p>
        </div>
    )
}

export default ImageInput