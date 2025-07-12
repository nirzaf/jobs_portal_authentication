import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
])

// Define auth routes (sign-in, sign-up pages)
const isAuthRoute = createRouteMatcher([
  '/auth(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  const { pathname } = req.nextUrl

  // Get user role from public metadata
  const userRole = (sessionClaims?.publicMetadata as { role?: string })?.role

  // If user is signed in but doesn't have a role, redirect to setup
  if (userId && !userRole && pathname !== '/setup') {
    return NextResponse.redirect(new URL('/setup', req.url))
  }

  // If user is on an auth route and already signed in, redirect appropriately
  if (isAuthRoute(req) && userId) {
    if (!userRole) {
      return NextResponse.redirect(new URL('/setup', req.url))
    }
    const dashboardUrl = userRole === 'employer'
      ? '/dashboard/employer'
      : '/dashboard/job-seeker'
    return NextResponse.redirect(new URL(dashboardUrl, req.url))
  }

  // Protect dashboard routes
  if (isProtectedRoute(req)) {
    if (!userId) {
      // Redirect to sign-in if not authenticated
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    if (!userRole) {
      return NextResponse.redirect(new URL('/setup', req.url))
    }

    // Role-based access control
    if (pathname.startsWith('/dashboard/employer') && userRole !== 'employer') {
      return NextResponse.redirect(new URL('/dashboard/job-seeker', req.url))
    }

    if (pathname.startsWith('/dashboard/job-seeker') && userRole !== 'job_seeker') {
      return NextResponse.redirect(new URL('/dashboard/employer', req.url))
    }

    // Redirect /dashboard to role-specific dashboard
    if (pathname === '/dashboard') {
      const dashboardUrl = userRole === 'employer'
        ? '/dashboard/employer'
        : '/dashboard/job-seeker'
      return NextResponse.redirect(new URL(dashboardUrl, req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
