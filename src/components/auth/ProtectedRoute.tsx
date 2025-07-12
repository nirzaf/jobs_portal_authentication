'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

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
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push(redirectTo);
      return;
    }

    if (requiredRole && session.user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      const dashboardUrl = session.user.role === 'employer' 
        ? '/dashboard/employer' 
        : '/dashboard/job-seeker';
      router.push(dashboardUrl);
      return;
    }
  }, [session, status, router, requiredRole, redirectTo]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  if (requiredRole && session.user.role !== requiredRole) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
