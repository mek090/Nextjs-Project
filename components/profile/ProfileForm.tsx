"use client";

import { useState } from 'react';
import Image from 'next/image';
import { updateProfileAction } from '@/actions/actions';
import { Camera, User, AtSign, Save, Loader2 } from "lucide-react";
import { toast } from 'sonner';

interface ProfileFormProps {
  profile: {
    firstname: string;
    lastname: string;
    username: string;
    profileImage: string | null;
  };
  userId: string;
}

export default function ProfileForm({ profile, userId }: ProfileFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ตรวจสอบขนาดไฟล์
      const maxSize = 10 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error(`ขนาดไฟล์ต้องไม่เกิน ${maxSize}MB`);
        e.target.value = '';
        return;
      }

      // ตรวจสอบประเภทไฟล์
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp','image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('รองรับเฉพาะไฟล์ภาพประเภท JPEG, PNG และ WebP');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateProfileAction(formData);
      
      if (result.success) {
        toast.success('อัพเดทโปรไฟล์สำเร็จ');
      } else {
        toast.error(result.error || 'เกิดข้อผิดพลาดในการอัพเดทโปรไฟล์');
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการอัพเดทโปรไฟล์');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
    >
      <input type="hidden" name="userId" value={userId} />
      
      {/* Profile Image Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-36 h-36 mb-4 group">
          <Image
            src={previewImage || profile.profileImage || '/default-avatar.png'}
            alt="Profile"
            fill
            className="rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />
          <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-md transition-transform duration-200 hover:scale-110">
            <Camera size={20} />
            <input
              type="file"
              name="profileImage"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          รองรับไฟล์ JPG, PNG, WEBP ขนาดไม่เกิน 2MB
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">ชื่อ</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-500 dark:text-gray-400">
              <User size={18} />
            </span>
            <input
              type="text"
              name="firstname"
              defaultValue={profile.firstname}
              className="flex-1 appearance-none border border-gray-300 dark:border-gray-600 rounded-r-md w-full py-2 px-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">นามสกุล</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-500 dark:text-gray-400">
              <User size={18} />
            </span>
            <input
              type="text"
              name="lastname"
              defaultValue={profile.lastname}
              className="flex-1 appearance-none border border-gray-300 dark:border-gray-600 rounded-r-md w-full py-2 px-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Username</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-500 dark:text-gray-400">
              <AtSign size={18} />
            </span>
            <input
              type="text"
              name="username"
              defaultValue={profile.username}
              className="flex-1 appearance-none border border-gray-300 dark:border-gray-600 rounded-r-md w-full py-2 px-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>กำลังอัพเดท...</span>
          </>
        ) : (
          <>
            <Save size={18} />
            <span>อัพเดตโปรไฟล์</span>
          </>
        )}
      </button>
    </form>
  );
}