'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || status === 'loading') return; // Still loading or not on client

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
  }, [mounted, session, status, router, requiredRole, redirectTo]);

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    console.log('No session');
    //redirect to login page
    router.push('/auth/signin');
    return null; // Will redirect
  }

  if (requiredRole && session.user.role !== requiredRole) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
