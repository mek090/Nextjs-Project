import { z, ZodSchema } from 'zod';

const validateImage = () => {
  const maxFileSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  return z.instanceof(File, { message: "ต้องอัพโหลดไฟล์ภาพ" })
    .refine(file => file.size <= maxFileSize, {
      message: `ขนาดไฟล์ต้องไม่เกิน ${maxFileSize / (1024 * 1024)}MB`
    })
    .refine(file => allowedTypes.includes(file.type), {
      message: `รองรับเฉพาะไฟล์ประเภท: ${allowedTypes.join(', ')}`
    });
}

export const imageSchema = z.object({
  image: validateImage()
});


export const locationSchema = z.object({
  name: z.string().min(2, 'ชื่อสถานที่ต้องมีอย่างน้อย 2 ตัวอักษร'),
  description: z.string().min(10, 'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร'),
  category: z.string().min(1, 'กรุณาเลือกหมวดหมู่'),
  districts: z.string().min(1, 'กรุณาเลือกตำบล/แขวง'),
  price: z.string().min(1, 'กรุณาระบุราคา'),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});





export const profileSchema = z.object({
  firstname: z.string().min(2, { message: "ชื่อต้องมากกว่า 2 อักขระ  " }),
  lastname: z.string().min(2, { message: "นามสกุลต้องมากกว่า 2 อักขระ  " }),
  username: z.string().min(2, { message: "ชื่อผู้ใช้ต้องมากกว่า 2 อักขระ  " }),
  profileImage: z.string().optional(),
})


export const validateWithZod = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const formattedErrors = result.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));
    
    console.error('Validation errors:', formattedErrors);
    throw new Error(
      formattedErrors.map(e => `${e.path}: ${e.message}`).join('\n')
    );
  }
  return result.data;
}