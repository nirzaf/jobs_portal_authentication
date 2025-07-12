# Migration Guide: NextAuth.js to Clerk

## Overview

This guide helps you migrate from the previous NextAuth.js implementation to the new Clerk authentication system.

## Why Migrate to Clerk?

### Advantages of Clerk over NextAuth.js:
1. **Pre-built UI Components**: No need to build custom auth forms
2. **User Management Dashboard**: Built-in admin interface
3. **Better Security**: Enterprise-grade security out of the box
4. **Easier Setup**: Less configuration required
5. **Rich Features**: 2FA, social logins, user profiles included
6. **Better Developer Experience**: Simpler API and better documentation

## Migration Steps

### Step 1: Install Clerk
```bash
npm install @clerk/nextjs@latest svix
```

### Step 2: Update Environment Variables
Replace NextAuth variables with Clerk variables in `.env.local`:

```env
# Remove these NextAuth variables:
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret

# Add these Clerk variables:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

### Step 3: Update app/layout.tsx
**Before (NextAuth):**
```tsx
import SessionProvider from "@/components/providers/SessionProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navigation />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

**After (Clerk):**
```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navigation />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

### Step 4: Update middleware.ts
**Before (NextAuth):**
```tsx
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Custom logic
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);
```

**After (Clerk):**
```tsx
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()
  
  if (isProtectedRoute(req) && !userId) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
})
```

### Step 5: Update Navigation Component
**Before (NextAuth):**
```tsx
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const { data: session } = useSession();
  
  return (
    <nav>
      {session ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <Link href="/auth/signin">Sign In</Link>
      )}
    </nav>
  );
}
```

**After (Clerk):**
```tsx
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

export default function Navigation() {
  const { user } = useUser();
  
  return (
    <nav>
      {user ? (
        <UserButton />
      ) : (
        <SignInButton />
      )}
    </nav>
  );
}
```

### Step 6: Update Auth Pages
**Before (NextAuth):** Custom forms with API calls
**After (Clerk):** Use built-in components

```tsx
// auth/signin/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return <SignIn redirectUrl="/dashboard" />;
}
```

### Step 7: Update Protected Routes
**Before (NextAuth):**
```tsx
import { useSession } from 'next-auth/react';

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Access Denied</div>;
  
  return <>{children}</>;
}
```

**After (Clerk):**
```tsx
import { useUser } from '@clerk/nextjs';

export default function ProtectedRoute({ children }) {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Access Denied</div>;
  
  return <>{children}</>;
}
```

### Step 8: Update Dashboard Components
**Before (NextAuth):**
```tsx
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();
  
  return <div>Welcome, {session?.user?.name}</div>;
}
```

**After (Clerk):**
```tsx
import { useUser } from '@clerk/nextjs';

export default function Dashboard() {
  const { user } = useUser();
  
  return <div>Welcome, {user?.firstName}</div>;
}
```

## Data Migration

### User Data
If you have existing users in MongoDB:
1. Export user data from MongoDB
2. Import users into Clerk via API or CSV
3. Map existing user roles to Clerk metadata

### Session Migration
- No session migration needed
- Users will need to sign in again with Clerk
- Consider sending migration notification emails

## Testing Migration

1. **Test Authentication Flow**:
   - Sign up new users
   - Sign in existing users
   - Test sign out functionality

2. **Test Protected Routes**:
   - Verify dashboard access
   - Test role-based routing
   - Check unauthorized access handling

3. **Test User Experience**:
   - Verify UI components work
   - Test responsive design
   - Check error handling

## Rollback Plan

If you need to rollback to NextAuth:
1. Keep NextAuth dependencies in package.json
2. Restore previous component versions from git
3. Switch environment variables back
4. Redeploy application

## Post-Migration Cleanup

After successful migration:
1. Remove NextAuth dependencies
2. Delete old auth API routes
3. Remove NextAuth environment variables
4. Update documentation
5. Clean up unused components

## Support

- **Clerk Documentation**: https://clerk.com/docs
- **Clerk Discord**: https://clerk.com/discord
- **Migration Issues**: Check the troubleshooting guide
