// import { NextResponse } from 'next/server'
// import { currentUser } from '@clerk/nextjs/server'
// import { db } from '@/utils/db'
// import { profileSchema, validateWithZod } from '@/utils/schemas'

// export async function GET() {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const profile = await db.profile.findUnique({
//       where: { clerkId: user.id },
//       include: {
//         locations: true,
//         favorites: {
//           include: {
//             location: true
//           }
//         }
//       }
//     })

//     if (!profile) {
//       return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
//     }

//     return NextResponse.json({ profile })
//   } catch (error) {
//     console.error('Error fetching profile:', error)
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const formData = await request.formData()
//     const rawData = Object.fromEntries(formData)
//     const validateField = validateWithZod(profileSchema, rawData)

//     const profile = await db.profile.update({
//       where: { clerkId: user.id },
//       data: validateField
//     })

//     return NextResponse.json({ 
//       message: 'Profile updated successfully',
//       profile 
//     })
//   } catch (error) {
//     console.error('Error updating profile:', error)
//     return NextResponse.json({ 
//       error: error instanceof Error ? error.message : 'Internal server error' 
//     }, { status: 500 })
//   }
// } 