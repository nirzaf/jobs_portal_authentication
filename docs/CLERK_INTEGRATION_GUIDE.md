# Clerk Authentication Integration Guide

## Overview

This application has been successfully migrated from NextAuth.js to Clerk for authentication. Clerk provides a more robust, feature-rich authentication solution with built-in UI components and better user management.

## Key Features Implemented

### 1. **Clerk Authentication Setup**
- ✅ ClerkProvider wrapping the entire application
- ✅ clerkMiddleware() for route protection
- ✅ Built-in SignIn and SignUp components
- ✅ User role management with public metadata
- ✅ Role-based dashboard routing

### 2. **User Role System**
- ✅ Job Seeker role
- ✅ Employer role
- ✅ Role selection during onboarding
- ✅ Role-based access control
- ✅ Automatic dashboard redirection

### 3. **Protected Routes**
- ✅ Dashboard routes require authentication
- ✅ Role-based access control
- ✅ Automatic redirects for unauthorized access
- ✅ Setup flow for new users

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Optional: Webhook secret for user role assignment
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## File Structure

```
src/
├── app/
│   ├── api/webhooks/clerk/route.ts    # Webhook for user creation
│   ├── auth/
│   │   ├── signin/page.tsx            # Clerk SignIn component
│   │   └── signup/page.tsx            # Clerk SignUp component
│   ├── setup/page.tsx                 # Role selection page
│   └── layout.tsx                     # ClerkProvider wrapper
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx         # Route protection with Clerk
│   │   └── RoleSelector.tsx           # Role selection component
│   └── layout/
│       └── Navigation.tsx             # Updated with Clerk components
└── middleware.ts                      # clerkMiddleware configuration
```

## User Flow

1. **New User Registration**:
   - User visits `/auth/signup`
   - Clerk handles registration
   - User redirected to `/setup` for role selection
   - Role saved to user's public metadata
   - User redirected to appropriate dashboard

2. **Existing User Login**:
   - User visits `/auth/signin`
   - Clerk handles authentication
   - Middleware checks user role
   - User redirected to role-specific dashboard

3. **Role-Based Access**:
   - Job Seekers → `/dashboard/job-seeker`
   - Employers → `/dashboard/employer`
   - Automatic role-based redirects

## Key Components

### ClerkProvider (app/layout.tsx)
```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Middleware (middleware.ts)
```tsx
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  
  // Role-based routing logic
  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
})
```

### Navigation with Clerk
```tsx
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function Navigation() {
  const { user, isLoaded } = useUser();
  
  return (
    <nav>
      {user ? (
        <UserButton />
      ) : (
        <>
          <SignInButton />
          <SignUpButton />
        </>
      )}
    </nav>
  );
}
```

## Migration Benefits

### From NextAuth.js to Clerk:
1. **Better UI/UX**: Pre-built, customizable auth components
2. **User Management**: Built-in user dashboard and management
3. **Security**: Enterprise-grade security features
4. **Scalability**: Handles user management at scale
5. **Features**: Built-in 2FA, social logins, user profiles
6. **Developer Experience**: Simpler setup and maintenance

## Next Steps

1. **Configure Clerk Dashboard**:
   - Set up your Clerk application
   - Configure allowed domains
   - Set up webhooks (optional)

2. **Customize Appearance**:
   - Modify Clerk component themes
   - Add custom CSS for branding

3. **Add Social Logins**:
   - Enable Google, GitHub, etc. in Clerk dashboard
   - No code changes required

4. **Set Up Webhooks** (Optional):
   - Configure webhook endpoint in Clerk dashboard
   - Point to `/api/webhooks/clerk`
   - Add webhook secret to environment variables

## Testing

1. Visit `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Complete registration and role selection
4. Verify dashboard access based on role
5. Test sign out and sign in functionality
