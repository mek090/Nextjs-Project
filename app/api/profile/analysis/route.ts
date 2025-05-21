import { NextResponse } from "next/server";
import { analyzeUserProfile } from "@/actions/actions";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const analysis = await analyzeUserProfile(userId);
        return NextResponse.json(analysis);
    } catch (error) {
        console.error('Error in profile analysis API:', error);
        return NextResponse.json(
            { error: 'Failed to analyze profile' },
            { status: 500 }
        );
    }
} 