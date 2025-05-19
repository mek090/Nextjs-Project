'use server'

import { imageSchema, locationSchema, profileSchema, validateWithZod } from "@/utils/schemas"
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z, ZodSchema } from "zod";
import { uploadFile } from "@/utils/supabase";
import { auth } from "@clerk/nextjs/server";
import path from "path";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";

export const getAuthUser = async () => {
    const user = await currentUser()
    if (!user) {
        throw new Error('You must be signed in.')
    }
    if (!user.privateMetadata.hasProfile) redirect('/profile/create')
    return user
}

const renderError = (error: unknown): { message: string } => {
    return {
        message: error instanceof Error ? error.message : 'An error server'
    }
};





export const createProfileAction = async (prevState: any, formData: FormData) => {
    try {
        const user = await currentUser()
        if (!user) throw new Error('Plaease sign in first.')

        const rawData = Object.fromEntries(formData)
        const validateField = validateWithZod(profileSchema, rawData);
        // console.log('validated ', validateField)

        await prisma.profile.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                profileImage: user.imageUrl ?? '',
                ...validateField
            }
        })

        const client = await clerkClient()
        await client.users.updateUserMetadata(user.id, {
            privateMetadata: {
                hasProfile: true
            }
        })

        // return {
        //     message: 'Create Profile success!!'
        // }
    } catch (error) {
        return renderError(error)
    }
    redirect('/')
}


export const createLocationAction = async (
    prevState: any,
    formData: FormData
) => {
    try {
        const user = await getAuthUser();
        const rawData = Object.fromEntries(formData);

        // ตั้งค่า default ถ้าไม่มีค่า
        if (!rawData.openTime) rawData.openTime = '';
        if (!rawData.closeTime) rawData.closeTime = '';

        // ตรวจสอบไฟล์รูปภาพ
        const imageFile = formData.get('image') as File;
        if (!imageFile) {
            return {
                success: false,
                message: 'กรุณาอัพโหลดรูปภาพ'
            };
        }

        try {
            const validateFile = validateWithZod(imageSchema, { image: imageFile });
            const validateField = validateWithZod(locationSchema, rawData);

            const fullPath = await uploadFile(validateFile.image);

            await prisma.location.create({
                data: {
                    ...validateField,
                    image: fullPath,
                    profileId: user.id
                }
            });

            return {
                success: true,
                message: 'สร้างสถานที่สำเร็จ!',
                shouldRedirect: true
            };
        } catch (validationError) {
            console.error('Validation error:', validationError);
            return {
                success: false,
                message: validationError instanceof Error ? validationError.message : 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล'
            };
        }
    } catch (error) {
        console.error('Error in createLocationAction:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างสถานที่'
        };
    }
};




export const fetchLocation = async (params?: { search?: string, category?: string }) => {
    const search = params?.search || '';
    const category = params?.category || '';

    const locations = await prisma.location.findMany({
        where: {
            AND: [
                category ? { category } : {},
                {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                        { districts: { contains: search, mode: 'insensitive' } }
                    ]
                }
            ]
        },
        select: {
            id: true,
            name: true,
            image: true,
            description: true,
            districts: true,
            price: true,
            lat: true,
            lng: true,
            rating: true,
            openTime: true,
            closeTime: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return locations;
};





export const fetchFavoriteId = async ({ locationId }: { locationId: string }) => {
    const user = await getAuthUser()
    const favorite = await prisma.favorite.findFirst({
        where: {
            locationId: locationId,
            profileId: user.id
        },
        select: {
            id: true
        }
    })
    return favorite?.id || null
}

export const toggleFavoriteAction = async (locationId: string, userId: string, isFavorite: boolean) => {
    try {
        // เช็คสถานะปัจจุบันก่อน
        const existingFavorite = await prisma.favorite.findFirst({
            where: {
                profileId: userId,
                locationId: locationId,
            }
        });

        if (isFavorite && !existingFavorite) {
            // Add favorite only if it doesn't exist
            await prisma.favorite.create({
                data: {
                    profileId: userId,
                    locationId: locationId,
                }
            });
        } else if (!isFavorite && existingFavorite) {
            // Remove favorite only if it exists
            await prisma.favorite.delete({
                where: {
                    id: existingFavorite.id
                }
            });
        }
        return { success: true };
    } catch (error) {
        console.error("Error toggling favorite:", error);
        throw new Error("Failed to toggle favorite");
    }
}

export const checkFavoriteStatus = async (userId: string, locationId: string) => {
    try {
        const favorite = await prisma.favorite.findFirst({
            where: {
                profileId: userId,
                locationId: locationId,
            }
        });
        return favorite !== null;
    } catch (error) {
        console.error("Error checking favorite status:", error);
        throw new Error("Failed to check favorite status");
    }
}


export const fetchFavorite = async () => {
    const user = await getAuthUser()
    const favorites = await prisma.favorite.findMany({
        where: {
            profileId: user.id
        },
        select: {
            location: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    description: true,
                    price: true,
                    districts: true,
                    lat: true,
                    lng: true,
                    category: true,
                    rating: true,
                    openTime: true,
                    closeTime: true
                }
            }
        }
    })
    return favorites.map((favorite) => favorite.location)
}

export const fetchLocationDetail = async ({ id }: { id: string }) => {
    try {
        console.log('Fetching location detail for ID:', id);
        const user = await currentUser();
        console.log('Current user:', user?.id);

        const location = await prisma.location.findFirst({
            where: {
                id,
            },
            include: {
                profile: true,
                favorites: {
                    where: {
                        profileId: user?.id || '',
                    },
                },
            },
        });

        console.log('Found location:', location);

        if (!location) {
            console.log('Location not found');
            return null;
        }

        return {
            ...location,
            isFavorite: location.favorites.length > 0
        };
    } catch (error) {
        console.error('Error fetching location detail:', error);
        throw error;
    }
};

// export const fineprofile = async ({ id }: { id: string }) => {
//     try {
//         console.log('Fetching location detail for ID:', id);
//     const profile = await currentUser();
//         console.log('Current user:', user?.id);

//     const user = await prisma.profile.findFirst({
//         where: {
//             id,
//         },

//         });

//         console.log('Found profile:', profile);



//     } catch (error) {
//         console.error('Error fetching location detail:', error);
//         throw error;
//     }
// };

export async function updateProfileAction(formData: FormData) {
    try {
        const userId = formData.get("userId") as string
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const firstname = formData.get("firstname") as string
        const lastname = formData.get("lastname") as string
        const username = formData.get("username") as string
        const profileImage = formData.get("profileImage") as File

        if (!firstname || !lastname || !username) {
            throw new Error("กรุณากรอกข้อมูลให้ครบ")
        }

        // Handle profile image upload to Supabase
        let profileImageUrl = undefined
        if (profileImage && profileImage.size > 0) {
            try {
                profileImageUrl = await uploadFile(profileImage)
            } catch (error) {
                console.error("Error uploading profile image:", error)
                throw new Error("เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ")
            }
        }

        const profile = await prisma.profile.update({
            where: { clerkId: userId },
            data: {
                firstname,
                lastname,
                username,
                ...(profileImageUrl && { profileImage: profileImageUrl })
            },
        })

        revalidatePath('/profile')
        return { success: true, profile }
    } catch (error) {
        console.error("Error updating profile:", error)
        return { success: false, error: "เกิดข้อผิดพลาดในการอัพเดทโปรไฟล์" }
    }
}

export const createReviewAction = async (locationId: string, rating: number, content: string) => {
    try {
        console.log('Creating review:', { locationId, rating, content });
        const user = await currentUser();
        if (!user) throw new Error('Please sign in.');

        const review = await prisma.review.create({
            data: {
                content,
                rating,
                profile: {
                    connect: {
                        clerkId: user.id,
                    },
                },
                location: {
                    connect: {
                        id: locationId,
                    },
                },
            },
            include: {
                profile: {
                    select: {
                        firstname: true,
                        lastname: true,
                        username: true,
                    },
                },
            },
        });
        console.log('Created review:', review);

        // Update location rating
        const location = await prisma.location.findUnique({
            where: { id: locationId },
            include: {
                reviews: true,
            },
        });

        if (location) {
            const avgRating = location.reviews.reduce((acc, review) => acc + review.rating, 0) / location.reviews.length;
            console.log('Updating location rating:', avgRating);
            await prisma.location.update({
                where: { id: locationId },
                data: { rating: avgRating },
            });
        }

        return review;
    } catch (error) {
        console.error('Error creating review:', error);
        throw error;
    }
};

export const fetchLocationReviews = async (locationId: string) => {
    try {
        const reviews = await prisma.review.findMany({
            where: {
                locationId: locationId
            },
            include: {
                profile: {
                    select: {
                        firstname: true,
                        lastname: true,
                        username: true,
                        profileImage: true,
                    },
                },
                replies: {
                    include: {
                        profile: {
                            select: {
                                firstname: true,
                                lastname: true,
                                username: true,
                                profileImage: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return reviews;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};


// ... existing code ...

export const fetchTopLocations = async () => {
    const locations = await prisma.location.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            description: true,
            districts: true,
            price: true,
            lat: true,
            lng: true,
            rating: true,
            openTime: true,
            closeTime: true,
            _count: {
                select: {
                    reviews: true
                }
            }
        },
        orderBy: [
            {
                rating: 'desc'
            },
            {
                reviews: {
                    _count: 'desc'
                }
            }
        ],
        take: 4
    });

    return locations;
};


export async function findRoleprofile({ id }: { id: string }) {
    try {
        const profile = await prisma.profile.findUnique({
            where: { clerkId: id }
        });
        console.log('Found profile:', profile);
        return profile;
    } catch (err) {
        console.error("Server action error:", err);
        throw err;
    }
}





export async function getDashboardStats() {
    const [
        totalUsers,
        activePlaces,
        totalFavorites,
        totalActivities,
        recentActivities
    ] = await Promise.all([
        prisma.profile.count(),
        prisma.location.count(),
        prisma.favorite.count(),
        prisma.review.count(),
        prisma.review.findMany({
            take: 3,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                profile: true,
                location: true
            }
        })
    ])

    return {
        totalUsers,
        activePlaces,
        totalFavorites,
        totalActivities,
        recentActivities
    }
}

//ดึงข้อมูลผู้ใช้
export async function getAllusers() {
    try {
        const users = await prisma.profile.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return { users }
    } catch (error) {
        return { error: 'Failed to fetch users' }
    }
}


//update user
export async function updateUser(formData: FormData) {
    try {
        const user = await currentUser()
        if (!user) throw new Error('Unauthorized')

        const data = {
            id: formData.get('id') as string,
            firstname: formData.get('firstname') as string,
            lastname: formData.get('lastname') as string,
            username: formData.get('username') as string,
            role: formData.get('role') as string,
        }

        const updatedUser = await prisma.profile.update({
            where: { id: data.id },
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                username: data.username,
                role: data.role,
            }
        })

        revalidatePath('/dashboard/manageuser')
        return { success: true, user: updatedUser }
    } catch (error) {
        return { error: 'Failed to update user' }
    }
}


// ลบผู้ใช้
export async function deleteUser(id: string) {
    try {
        const user = await currentUser()
        if (!user) throw new Error('Unauthorized')

        await prisma.profile.delete({
            where: { id }
        })

        revalidatePath('/dashboard/manageuser')
        return { success: true }
    } catch (error) {
        return { error: 'Failed to delete user' }
    }
}





export async function getNotifications() {
    const [
        totalUsers,
        activePlaces,
        totalFavorites,
        totalActivities,
        recentActivities
    ] = await Promise.all([
        prisma.profile.count(),
        prisma.location.count(),
        prisma.favorite.count(),
        prisma.review.count(),
        prisma.review.findMany({
            take: 3,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                profile: true,
                location: true
            }
        })
    ])

    return {
        totalUsers,
        activePlaces,
        totalFavorites,
        totalActivities,
        recentActivities
    }
}

export const createReplyAction = async (reviewId: string, content: string) => {
  try {
    const user = await getAuthUser();
    console.log('Creating reply for user:', user.id);
    
    // ดึงข้อมูล review เพื่อหาเจ้าของรีวิว
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        profile: true
      }
    });

    if (!review) {
      throw new Error("Review not found");
    }

    console.log('Review owner:', review.profileId);
    console.log('Current user:', user.id);

    // สร้าง reply
    const reply = await prisma.reply.create({
      data: {
        contain: content,
        profile: {
          connect: {
            clerkId: user.id
          }
        },
        review: {
          connect: {
            id: reviewId
          }
        }
      },
      include: {
        profile: {
          select: {
            firstname: true,
            lastname: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    console.log('Reply created:', reply);

    // สร้าง notification ถ้าไม่ใช่การ reply ของตัวเอง
    if (review.profileId !== user.id) {
      console.log('Creating notification for review owner');
      const notification = await prisma.notification.create({
        data: {
          type: "REPLY",
          message: `${reply.profile.firstname} ${reply.profile.lastname} ตอบกลับรีวิวของคุณ`,
          recipient: {
            connect: {
              clerkId: review.profileId
            }
          },
          review: {
            connect: {
              id: reviewId
            }
          },
          reply: {
            connect: {
              id: reply.id
            }
          }
        }
      });
      console.log('Notification created:', notification);
    } else {
      console.log('Skipping notification - self reply');
    }

    revalidatePath(`/locations/${reviewId}`);
    return reply;
  } catch (error) {
    console.error("Error creating reply:", error);
    throw error;
  }
};