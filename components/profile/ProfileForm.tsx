"use client";

import { useState } from 'react';
import Image from 'next/image';
import { updateProfileAction } from '@/actions/actions';

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      action={updateProfileAction}
      className="space-y-4"
    >
      <input type="hidden" name="userId" value={userId} />
      
      {/* Profile Image Section */}
      <div className="mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={previewImage || profile.profileImage || '/default-avatar.png'}
            alt="Profile"
            fill
            className="rounded-full object-cover"
          />
        </div>
        {/* <div className="text-center">
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
            อัพโหลดรูปโปรไฟล์
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <p className="text-sm text-gray-500 mt-2">
            รองรับไฟล์ JPG, PNG, WEBP ขนาดไม่เกิน 2MB
          </p>
        </div> */}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">ชื่อ</label>
        <input
          type="text"
          name="firstname"
          defaultValue={profile.firstname}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">นามสกุล</label>
        <input
          type="text"
          name="lastname"
          defaultValue={profile.lastname}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Username</label>
        <input
          type="text"
          name="username"
          defaultValue={profile.username}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        อัพเดตโปรไฟล์
      </button>
    </form>
  );
} 