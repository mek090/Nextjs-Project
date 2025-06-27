import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // ดึงข้อมูลจาก table prompts ด้วย query ตรง
    const prompts = await prisma.$queryRaw`SELECT * FROM "prompts"`;
    return NextResponse.json(prompts);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 