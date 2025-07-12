import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    // Verify the user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { role } = await req.json();

    // Validate role
    if (!role || !['job_seeker', 'employer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be either job_seeker or employer' },
        { status: 400 }
      );
    }

    // Update user metadata
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    });

    return NextResponse.json(
      { message: 'Role updated successfully', role },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
