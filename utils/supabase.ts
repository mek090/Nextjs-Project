// import { createClient } from '@supabase/supabase-js'

// const bucket = 'location-bucket'
// const url = process.env.SUPABASE_URL as string
// const key = process.env.SUPABASE_KEY as string

// // Create Supabase client
// const supabase = createClient(url, key)

// // Upload file using standard upload
// export async function uploadFile(image: File) {

//     const timeStamp = Date.now()
//     const newName = `Mekkkkkkk-${timeStamp}-${image.name}`

//     const { data, error } = await supabase.storage
//         .from(bucket)
//         .upload(newName, image)

//     if (!data) throw new Error('Image upload failed!!')

//     // const { data } = supabase.storage.from('bucket').getPublicUrl('filePath.jpg')
//     // console.log(data.publicUrl)
//     return supabase.storage
//     .from(bucket)
//     .getPublicUrl(newName).data.publicUrl
// }


import { createClient } from '@supabase/supabase-js'

const bucket = 'location-bucket'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!url || !key) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with realtime enabled
export const supabase = createClient(url, key, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Upload file with improved error handling
export async function uploadFile(image: File): Promise<string> {
    try {
        // 1. ตรวจสอบว่ามีไฟล์จริงหรือไม่
        if (!image) {
            throw new Error('ไม่มีไฟล์ที่ต้องการอัพโหลด');
        }

        // 2. ตรวจสอบประเภทไฟล์
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/html'];
        if (!allowedTypes.includes(image.type)) {
            throw new Error('รองรับเฉพาะไฟล์ภาพประเภท JPEG, PNG, GIF และ WebP');
        }

        // 3. ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (image.size > maxSize) {
            throw new Error(`ขนาดไฟล์ต้องไม่เกิน ${maxSize / (1024 * 1024)}MB`);
        }

        // 4. สร้างชื่อไฟล์ที่ไม่ซ้ำ
        const timeStamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExt = image.name.split('.').pop();
        const newName = `upload-${timeStamp}-${randomString}.${fileExt}`;

        // 5. อัพโหลดไฟล์
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(newName, image, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw new Error(`อัพโหลดไฟล์ไม่สำเร็จ: ${error.message}`);
        }

        // 6. สร้าง URL สาธารณะ
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        console.log('ไฟล์ถูกอัพโหลดเรียบร้อยที่:', publicUrl);
        return publicUrl;

    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัพโหลด:', error);
        throw error; // ส่งต่อ error ให้ caller จัดการ
    }
}