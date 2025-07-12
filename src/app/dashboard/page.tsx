'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    // Redirect to role-specific dashboard
    const userRole = user.publicMetadata?.role as string || 'job_seeker';
    if (userRole === 'employer') {
      router.push('/dashboard/employer');
    } else {
      router.push('/dashboard/job-seeker');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null;
}
