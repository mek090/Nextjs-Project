import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


// GET: ดึงข้อมูลผู้ใช้ทั้งหมด
export async function GET() {
    try {
        const users = await prisma.profile.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
}

// //POST
// export async function POST(request: Request) {
//     try {
//         const user = await currentUser()
//         if (!user) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//         }
//         const data = await request.json()
//         const newUser = await prisma.profile.create({
//             data: {
//                 ...data,
//                 clerkId: user.id,
//                 email: user.emailAddresses[0].emailAddress,
//                 profileImage: user.imageUrl ?? '',
//             }
//         })
//         return NextResponse.json(newUser)
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
//     }
// }


//PUT
export async function PUT(request: Request) {
    try {
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        const updateUser = await prisma.profile.update({
            where: { id: data.id },
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                username: data.username,
                role: data.role,
            }
        })
        return NextResponse.json(updateUser)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }
}

//DELETE
export async function DELETE(request: Request) {
    try {
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 })
        }

        await prisma.profile.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'User deleted successfully' })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }
}