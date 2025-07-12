'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { useIsClient } from '@/hooks/useIsClient';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'job_seeker' | 'employer';
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/auth/signin'
}: ProtectedRouteProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient || !isLoaded) return; // Still loading or not on client

    if (!user) {
      router.push(redirectTo);
      return;
    }

    const userRole = user.publicMetadata?.role as string || 'job_seeker';

    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      const dashboardUrl = userRole === 'employer'
        ? '/dashboard/employer'
        : '/dashboard/job-seeker';
      router.push(dashboardUrl);
      return;
    }
  }, [isClient, user, isLoaded, router, requiredRole, redirectTo]);

  if (!isClient || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const userRole = user.publicMetadata?.role as string || 'job_seeker';

  if (requiredRole && userRole !== requiredRole) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
