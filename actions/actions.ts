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
import { UserRole } from "@prisma/client";

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
        const imageFiles = formData.getAll('images') as File[];
        if (!imageFiles.length) {
            return {
                success: false,
                message: 'กรุณาอัพโหลดรูปภาพ'
            };
        }

        try {
            const validateFiles = validateWithZod(imageSchema, { images: imageFiles });
            const validateField = validateWithZod(locationSchema, rawData);

            // Upload all images
            const imageUrls = await Promise.all(
                validateFiles.images.map(image => uploadFile(image))
            );

            // Create location with all images
            await prisma.location.create({
                data: {
                    ...validateField,
                    image: imageUrls,
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
            category: true,
            districts: true,
            price: true,
            lat: true,
            lng: true,
            rating: true,
            openTime: true,
            closeTime: true,
            _count: {
                select: {
                    favorites: true,
                    reviews: true
                }
            }
        },
        orderBy: [
            {
                favorites: {
                    _count: 'desc'
                }
            },
            {
                rating: 'desc'
            }
        ]
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
                // ตรวจสอบขนาดไฟล์
                const maxSize = 2 * 1024 * 1024; // 2MB
                if (profileImage.size > maxSize) {
                    throw new Error(`ขนาดไฟล์ต้องไม่เกิน ${maxSize / (1024 * 1024)}MB`);
                }

                // ตรวจสอบประเภทไฟล์
                const allowedTypes = ['image/jpeg', 'image/png', 'image/webp','image/gif'];
                if (!allowedTypes.includes(profileImage.type)) {
                    throw new Error('รองรับเฉพาะไฟล์ภาพประเภท JPEG, PNG และ WebP');
                }

                // อัพโหลดไฟล์
                profileImageUrl = await uploadFile(profileImage)
            } catch (error) {
                console.error("Error uploading profile image:", error)
                throw new Error(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ")
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
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัพเดทโปรไฟล์" 
        }
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
                role: data.role as UserRole,
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

export const updateLocationAction = async (
    prevState: any,
    formData: FormData
) => {
    try {
        const user = await getAuthUser();
        const rawData = Object.fromEntries(formData);
        const locationId = rawData.id as string;

        // ตั้งค่า default ถ้าไม่มีค่า
        if (!rawData.openTime) rawData.openTime = '';
        if (!rawData.closeTime) rawData.closeTime = '';

        // ตรวจสอบไฟล์รูปภาพ
        const imageFiles = formData.getAll('images') as File[];
        let imageUrls = rawData.image ? JSON.parse(rawData.image as string) : [];

        if (imageFiles.length > 0) {
            try {
                const validateFiles = validateWithZod(imageSchema, { images: imageFiles });
                const newImageUrls = await Promise.all(
                    validateFiles.images.map(image => uploadFile(image))
                );
                imageUrls = [...imageUrls, ...newImageUrls];
            } catch (error) {
                return {
                    success: false,
                    message: 'รูปภาพไม่ถูกต้อง'
                };
            }
        }

        try {
            const validateField = validateWithZod(locationSchema, rawData);

            await prisma.location.update({
                where: {
                    id: locationId,
                    profileId: user.id
                },
                data: {
                    ...validateField,
                    image: imageUrls
                }
            });

            return {
                success: true,
                message: 'อัพเดทสถานที่สำเร็จ!',
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
        console.error('Error in updateLocationAction:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัพเดทสถานที่'
        };
    }
}

export const deleteLocationAction = async (
    prevState: any,
    formData: FormData
) => {
    try {
        const user = await getAuthUser();
        const locationId = formData.get('id') as string;

        await prisma.location.delete({
            where: {
                id: locationId,
                profileId: user.id
            }
        });

        return {
            success: true,
            message: 'ลบสถานที่สำเร็จ!',
            shouldRedirect: true
        };
    } catch (error) {
        console.error('Error in deleteLocationAction:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการลบสถานที่'
        };
    }
}

export const analyzeUserProfile = async (userId: string) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { clerkId: userId },
            include: {
                reviews: {
                    include: {
                        location: true
                    }
                },
                favorites: {
                    include: {
                        location: true
                    }
                }
            }
        });

        if (!profile) {
            throw new Error('Profile not found');
        }

        // วิเคราะห์ประเภทสถานที่ที่ผู้ใช้ชอบจาก favorites
        const favoriteCategories = profile.favorites.map(fav => fav.location.category);
        const categoryCount = favoriteCategories.reduce((acc, category) => {
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // หาประเภทสถานที่ที่ผู้ใช้ชอบที่สุด
        const favoriteCategory = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'ไม่พบข้อมูล';

        // คำนวณคะแนนเฉลี่ยที่ผู้ใช้ให้
        const averageRating = profile.reviews.reduce((acc, review) => acc + review.rating, 0) / 
            (profile.reviews.length || 1);

        // วิเคราะห์อำเภอที่ผู้ใช้ไปบ่อยที่สุดจาก favorites
        const districts = profile.favorites.map(fav => fav.location.districts);
        const districtCount = districts.reduce((acc, district) => {
            acc[district] = (acc[district] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const favoriteDistrict = Object.entries(districtCount)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'ไม่พบข้อมูล';

        // สรุปข้อมูลการวิเคราะห์
        const analysis = {
            totalReviews: profile.reviews.length,
            totalFavorites: profile.favorites.length,
            averageRating: averageRating.toFixed(1),
            favoriteCategory,
            favoriteDistrict,
            categoryBreakdown: categoryCount,
            districtBreakdown: districtCount,
            recentReviews: profile.reviews
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5),
            favoriteLocations: profile.favorites
                .map(fav => fav.location)
                .slice(0, 5)
        };

        return analysis;
    } catch (error) {
        console.error('Error analyzing user profile:', error);
        throw error;
    }
};




// dashboard
// export async function getEnhancedDashboardStats() {
//     const [
//         totalUsers,
//         activePlaces,
//         totalFavorites,
//         totalActivities,
//         recentActivities,
//         categoryStats,
//         districtStats,
//         userActivityStats,
//         popularLocations,
//         recentReviews,
//         userGrowthStats,
//         userActivities
//     ] = await Promise.all([
//         prisma.profile.count(),
//         prisma.location.count(),
//         prisma.favorite.count(),
//         prisma.review.count(),
//         prisma.review.findMany({
//             take: 5,
//             orderBy: { createdAt: 'desc' },
//             include: {
//                 profile: true,
//                 location: true
//             }
//         }),
//         prisma.location.groupBy({
//             by: ['category'],
//             _count: true,
//             orderBy: { _count: { category: 'desc' } }
//         }),
//         prisma.location.groupBy({
//             by: ['districts'],
//             _count: true,
//             orderBy: { _count: { districts: 'desc' } }
//         }),
//         prisma.review.groupBy({
//             by: ['profileId'],
//             _count: true,
//             orderBy: { _count: { profileId: 'desc' } },
//             take: 5
//         }),
//         prisma.location.findMany({
//             take: 5,
//             orderBy: { rating: 'desc' },
//             include: {
//                 _count: {
//                     select: {
//                         reviews: true,
//                         favorites: true
//                     }
//                 }
//             }
//         }),
//         prisma.review.findMany({
//             take: 5,
//             orderBy: { createdAt: 'desc' },
//             include: {
//                 profile: true,
//                 location: true
//             }
//         }),
//         prisma.profile.groupBy({
//             by: ['createdAt'],
//             _count: true,
//             orderBy: { createdAt: 'desc' },
//             take: 30
//         }),
//         prisma.profile.findMany({
//             take: 10,
//             select: {
//                 id: true,
//                 firstname: true,
//                 lastname: true,
//                 username: true,
//                 profileImage: true,
//                 reviews: {
//                     select: {
//                         id: true,
//                         createdAt: true
//                     }
//                 },
//                 favorites: {
//                     select: {
//                         id: true,
//                         createdAt: true
//                     }
//                 },
//                 locations: {
//                     select: {
//                         id: true
//                     }
//                 }
//             },
//             orderBy: {
//                 reviews: {
//                     _count: 'desc'
//                 }
//             }
//         })
//     ]);

//     // Transform user activities data
//     const transformedUserActivities = userActivities.map(user => ({
//         profile_id: user.id,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         username: user.username,
//         profileImage: user.profileImage,
//         review_count: user.reviews.length,
//         favorite_count: user.favorites.length,
//         location_views: user.locations.length,
//         last_review: user.reviews.length > 0 ? user.reviews[0].createdAt : null,
//         last_favorite: user.favorites.length > 0 ? user.favorites[0].createdAt : null
//     }));

//     return {
//         totalUsers,
//         activePlaces,
//         totalFavorites,
//         totalActivities,
//         recentActivities,
//         categoryStats,
//         districtStats,
//         userActivityStats,
//         popularLocations,
//         recentReviews,
//         userGrowthStats,
//         userActivities: transformedUserActivities
//     };
// }


// Enhanced dashboard stats with better error handling and caching
export async function getEnhancedDashboardStats() {
  try {
    const [
      totalUsers,
      activePlaces,
      totalFavorites,
      totalActivities,
      recentActivities,
      categoryStats,
      districtStats,
      userActivityStats,
      popularLocations,
      recentReviews,
      userGrowthStats,
      userActivities,
      newUsersThisWeek,
      topRatedLocations,
      mostFavoritedLocations,
      engagementStats
    ] = await Promise.all([
      prisma.profile.count(),
      prisma.location.count(),
      prisma.favorite.count(),
      prisma.review.count(),
      prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: true,
          location: true
        }
      }),
      prisma.location.groupBy({
        by: ['category'],
        _count: true,
        orderBy: { _count: { category: 'desc' } }
      }),
      prisma.location.groupBy({
        by: ['districts'],
        _count: true,
        orderBy: { _count: { districts: 'desc' } }
      }),
      prisma.review.groupBy({
        by: ['profileId'],
        _count: true,
        orderBy: { _count: { profileId: 'desc' } },
        take: 5
      }),
      prisma.location.findMany({
        take: 5,
        orderBy: { rating: 'desc' },
        include: {
          _count: {
            select: {
              reviews: true,
              favorites: true
            }
          }
        }
      }),
      prisma.review.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: true,
          location: true
        }
      }),
      prisma.profile.groupBy({
        by: ['createdAt'],
        _count: true,
        orderBy: { createdAt: 'desc' },
        take: 30
      }),
      prisma.profile.findMany({
        take: 10,
        select: {
          id: true,
          firstname: true,
          lastname: true,
          username: true,
          profileImage: true,
          reviews: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              location: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          },
          favorites: {
            select: {
              id: true,
              createdAt: true,
              location: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          },
          locations: {
            select: {
              id: true
            }
          }
        },
        orderBy: {
          reviews: {
            _count: 'desc'
          }
        }
      }),
      // New users this week
      prisma.profile.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      }),
      // Top rated locations
      prisma.location.findMany({
        take: 3,
        orderBy: { rating: 'desc' },
        where: {
          reviews: {
            some: {}
          }
        },
        select: {
          id: true,
          name: true,
          image: true,
          districts: true,
          rating: true,
          _count: {
            select: {
              reviews: true,
              favorites: true
            }
          }
        }
      }),
      // Most favorited locations
      prisma.location.findMany({
        take: 3,
        orderBy: {
          favorites: {
            _count: 'desc'
          }
        },
        select: {
          id: true,
          name: true,
          image: true,
          districts: true,
          rating: true,
          _count: {
            select: {
              reviews: true,
              favorites: true
            }
          }
        }
      }),
      // Engagement stats
      Promise.all([
        prisma.review.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 1))
            }
          }
        }),
        prisma.favorite.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 1))
            }
          }
        })
      ])
    ]);

    // Transform user activities data
    const transformedUserActivities = userActivities.map(user => ({
      profile_id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      profileImage: user.profileImage,
      review_count: user.reviews.length,
      favorite_count: user.favorites.length,
      location_views: user.locations.length,
      last_review: user.reviews[0] || null,
      last_favorite: user.favorites[0] || null
    }));

    // Calculate engagement stats
    const [dailyReviews, dailyFavorites] = engagementStats;
    const dailyActiveUsers = await prisma.profile.count({
      where: {
        OR: [
          {
            reviews: {
              some: {
                createdAt: {
                  gte: new Date(new Date().setDate(new Date().getDate() - 1))
                }
              }
            }
          },
          {
            favorites: {
              some: {
                createdAt: {
                  gte: new Date(new Date().setDate(new Date().getDate() - 1))
                }
              }
            }
          }
        ]
      }
    });

    return {
      totalUsers,
      activePlaces,
      totalFavorites,
      totalActivities,
      recentActivities,
      categoryStats,
      districtStats,
      userActivityStats,
      popularLocations,
      recentReviews,
      userGrowthStats,
      userActivities: transformedUserActivities,
      newUsersThisWeek,
      topRatedLocations,
      mostFavoritedLocations,
      engagementStats: {
        daily_active_users: dailyActiveUsers,
        daily_actions: dailyReviews + dailyFavorites
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}