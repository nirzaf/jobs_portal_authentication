'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RoleSelector from '@/components/auth/RoleSelector';

export default function SetupPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    // If user already has a role, redirect to dashboard
    if (user.publicMetadata?.role) {
      const userRole = user.publicMetadata.role as string;
      const dashboardUrl = userRole === 'employer' 
        ? '/dashboard/employer' 
        : '/dashboard/job-seeker';
      router.push(dashboardUrl);
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return <RoleSelector />;
}
