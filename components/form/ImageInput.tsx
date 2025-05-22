'use client'

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Image from "next/image"

const ImageInput = ({ defaultValue }: { defaultValue?: string | string[] }) => {
    const [previewImages, setPreviewImages] = useState<string[]>(
        typeof defaultValue === 'string' ? [defaultValue] : (defaultValue || [])
    )
    const [error, setError] = useState<string | null>(null)

    // ส่งค่า previewImages กลับไปยัง form
    useEffect(() => {
        const input = document.querySelector('input[name="image"]') as HTMLInputElement
        if (input) {
            input.value = JSON.stringify(previewImages)
        }
    }, [previewImages])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const maxSize = 2 * 1024 * 1024 // 2MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
            const newPreviews: string[] = []
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                if (file.size > maxSize) {
                    toast.error(`ขนาดไฟล์ต้องไม่เกิน ${maxSize / (1024 * 1024)}MB`)
                    e.target.value = '' // รีเซ็ต input
                    return
                } else if (!allowedTypes.includes(file.type)) {
                    toast.error(`รองรับเฉพาะไฟล์ประเภท: ${allowedTypes.join(', ')}`)
                    e.target.value = '' // รีเซ็ต input
                    return
                } else {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        newPreviews.push(reader.result as string)
                        if (newPreviews.length === files.length) {
                            setPreviewImages(prev => [...prev, ...newPreviews])
                        }
                    }
                    reader.readAsDataURL(file)
                }
            }
            setError(null)
        }
    }

    const removeImage = (index: number) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div>
            <Label className="capitalize">
                รูปภาพ
            </Label>
            <Input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                className="mt-1 mb-2"
                onChange={handleFileChange}
            />
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
                รองรับไฟล์ JPG, PNG, WEBP, GIF ขนาดไม่เกิน 2MB
            </p>

            {/* Preview Images */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {previewImages.map((preview, index) => (
                    <div key={index} className="relative group">
                        <div className="aspect-square relative">
                            <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImageInput