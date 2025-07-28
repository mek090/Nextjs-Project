import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { uploadFile, supabase } from "@/utils/supabase";

// Function to download image from URL and convert to File
async function downloadImageAsFile(imageUrl: string, filename: string): Promise<File> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });
    return file;
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

// Function to upload multiple images to Supabase
async function uploadImagesToSupabase(imageUrls: string[]): Promise<string[]> {
  const uploadedUrls: string[] = [];
  
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const imageUrl = imageUrls[i];
      const filename = `google-place-${Date.now()}-${i}.jpg`;
      
      // Download image from Google Places API
      const imageFile = await downloadImageAsFile(imageUrl, filename);
      
      // Upload to Supabase bucket
      const uploadedUrl = await uploadFile(imageFile);
      uploadedUrls.push(uploadedUrl);
      
      console.log(`Successfully uploaded image ${i + 1}/${imageUrls.length}`);
    } catch (error) {
      console.error(`Error uploading image ${i + 1}:`, error);
      // Continue with other images even if one fails
    }
  }
  
  return uploadedUrls;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      category,
      districts,
      lat,
      lng,
      price,
      image, // This will be array of Google Places image URLs
      rating,
      openTime,
      closeTime,
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (!districts) {
      return NextResponse.json(
        { error: "Districts is required" },
        { status: 400 }
      );
    }

    // Upload images to Supabase bucket if provided
    let uploadedImageUrls: string[] = [];
    if (image && Array.isArray(image) && image.length > 0) {
      try {
        console.log('Starting image upload to Supabase...');
        uploadedImageUrls = await uploadImagesToSupabase(image);
        console.log(`Successfully uploaded ${uploadedImageUrls.length} images to Supabase`);
      } catch (error) {
        console.error('Error uploading images to Supabase:', error);
        // Continue without images if upload fails
        uploadedImageUrls = [];
      }
    }

    // Create new location with uploaded image URLs
    const location = await prisma.location.create({
      data: {
        name,
        description,
        category,
        districts,
        lat: lat || 0,
        lng: lng || 0,
        price: price || '0',
        image: uploadedImageUrls, // Use uploaded Supabase URLs
        // rating: rating || 0,
        openTime: openTime || null,
        closeTime: closeTime || null,
        profileId: userId,
        googlePlaceId: body.googlePlaceId || null, // Optional field for Google Place ID
      },
    });

    return NextResponse.json({
      ...location,
      message: `Successfully saved location with ${uploadedImageUrls.length} images`
    });
  } catch (error) {
    console.error("Error saving place:", error);
    return NextResponse.json(
      { error: "Error saving place", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 