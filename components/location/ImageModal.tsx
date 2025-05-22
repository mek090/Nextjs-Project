'use client';

import { X } from 'lucide-react';
import Image from 'next/image';

interface ImageModalProps {
    image: string;
    onClose: () => void;
    alt: string;
}

export default function ImageModal({ image, onClose, alt }: ImageModalProps) {
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative max-w-4xl w-full h-[80vh]">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                    <X size={32} />
                </button>
                <div className="relative w-full h-full">
                    <Image
                        src={image}
                        alt={alt}
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
        </div>
    );
} 