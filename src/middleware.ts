import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Allow access to auth pages for unauthenticated users
    if (pathname.startsWith('/auth/') && !token) {
      return NextResponse.next();
    }

    // Redirect authenticated users away from auth pages
    if (pathname.startsWith('/auth/') && token) {
      const dashboardUrl = token.role === 'employer' 
        ? '/dashboard/employer' 
        : '/dashboard/job-seeker';
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }

    // Protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }

      // Role-based access control
      if (pathname.startsWith('/dashboard/employer') && token.role !== 'employer') {
        return NextResponse.redirect(new URL('/dashboard/job-seeker', req.url));
      }

      if (pathname.startsWith('/dashboard/job-seeker') && token.role !== 'job_seeker') {
        return NextResponse.redirect(new URL('/dashboard/employer', req.url));
      }

      // Redirect /dashboard to role-specific dashboard
      if (pathname === '/dashboard') {
        const dashboardUrl = token.role === 'employer' 
          ? '/dashboard/employer' 
          : '/dashboard/job-seeker';
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public routes
        if (pathname === '/' || pathname.startsWith('/jobs') || pathname.startsWith('/api/auth')) {
          return true;
        }

        // Allow access to auth pages
        if (pathname.startsWith('/auth/')) {
          return true;
        }

        // Require authentication for dashboard routes
        if (pathname.startsWith('/dashboard')) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};
