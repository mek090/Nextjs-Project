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
  name: z.string()
    .min(2, { message: "ชื่อต้องมากกว่า 2 อักขระ" })
    .max(30, { message: "ชื่อต้องน้อยกว่า 30 อักขระ" })
    .trim(),
  category: z.string().min(1, { message: "ต้องเลือกประเภท" }),
  description: z.string()
    .min(2, { message: "รายละเอียดต้องมากกว่า 2 อักขระ" })
    .max(500, { message: "รายละเอียดต้องน้อยกว่า 500 อักขระ" })
    .trim(),
  price: z.coerce.number({
    required_error: "ต้องกรอกราคา",
    invalid_type_error: "ต้องกรอกเป็นตัวเลข"
  }).int().min(0, { message: 'ราคาต้องมากกว่า 0' }),
  districts: z.string().min(1, { message: "ต้องเลือกเขต/อำเภอ" }),
  lat: z.coerce.number({
    required_error: "ต้องระบุละติจูด",
    invalid_type_error: "ต้องกรอกเป็นตัวเลข"
  }),
  lng: z.coerce.number({
    required_error: "ต้องระบุลองจิจูด",
    invalid_type_error: "ต้องกรอกเป็นตัวเลข"
  }),
  openTime: z.string().optional(), // ทำให้เป็น optional
  closeTime: z.string().optional() // ทำให้เป็น optional
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