# Jobs Portal Authentication - Step-by-Step Implementation Guide

## 📚 **Training Notes & Implementation Reference**

This comprehensive guide provides step-by-step instructions for implementing a complete authentication system using Next.js, NextAuth.js, and MongoDB Atlas. Perfect for trainers and students learning modern web development.

---

## 🎯 **Project Overview**

### **Purpose**
Build a secure, role-based authentication system for a job portal that supports two user types:
- **Job Seekers**: Users looking for employment opportunities
- **Employers**: Companies posting job openings

### **Learning Objectives**
By the end of this implementation, students will understand:
- Modern authentication patterns in web applications
- Role-based access control (RBAC)
- Database integration with MongoDB Atlas
- Session management with JWT tokens
- Protected routes and middleware
- Form validation and error handling
- TypeScript integration in Next.js

---

## 🛠️ **Technology Stack & Purpose**

### **Core Technologies**

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **Next.js 15** | React Framework | Full-stack capabilities, API routes, SSR/SSG, built-in optimization |
| **NextAuth.js** | Authentication Library | Industry-standard auth solution, multiple providers, session management |
| **MongoDB Atlas** | Cloud Database | Scalable NoSQL database, easy setup, global distribution |
| **TypeScript** | Type Safety | Catch errors at compile time, better developer experience |
| **Tailwind CSS** | Styling Framework | Utility-first CSS, responsive design, consistent styling |
| **bcryptjs** | Password Hashing | Secure password storage, salt-based hashing |

### **Supporting Libraries**

| Library | Purpose | Alternative Options |
|---------|---------|-------------------|
| `@auth/mongodb-adapter` | NextAuth-MongoDB integration | Prisma Adapter, Supabase Adapter |
| `mongodb` | MongoDB driver | Mongoose (ODM alternative) |
| `@types/*` | TypeScript definitions | N/A (required for TS) |

---

## 📋 **Prerequisites**

### **Required Knowledge**
- Basic React.js concepts (components, hooks, state)
- JavaScript ES6+ features (async/await, destructuring, modules)
- Basic understanding of HTTP requests and APIs
- HTML/CSS fundamentals

### **Development Environment**
- Node.js 18+ installed
- Code editor (VS Code recommended)
- Git for version control
- MongoDB Atlas account (free tier available)

---

## 🚀 **Step-by-Step Implementation**

### **Phase 1: Project Setup & Dependencies**

#### **Step 1.1: Initialize Next.js Project**
```bash
# Create new Next.js project with TypeScript and Tailwind
npx create-next-app@latest jobs_portal_authentication --typescript --tailwind --eslint --app --src-dir

# Navigate to project directory
cd jobs_portal_authentication
```

**🎓 Teaching Point**: Explain each flag:
- `--typescript`: Enables TypeScript for type safety
- `--tailwind`: Includes Tailwind CSS for styling
- `--eslint`: Adds code linting for quality
- `--app`: Uses new App Router (Next.js 13+)
- `--src-dir`: Organizes code in src/ directory

#### **Step 1.2: Install Authentication Dependencies**
```bash
# Install NextAuth.js and MongoDB dependencies
npm install next-auth @auth/mongodb-adapter mongodb bcryptjs

# Install TypeScript types
npm install --save-dev @types/bcryptjs
```

**🎓 Teaching Point**: Explain each dependency:
- `next-auth`: Main authentication library
- `@auth/mongodb-adapter`: Connects NextAuth to MongoDB
- `mongodb`: Official MongoDB driver
- `bcryptjs`: Password hashing library
- `@types/bcryptjs`: TypeScript definitions

### **Phase 2: Environment Configuration**

#### **Step 2.1: Create Environment Variables**

⚠️ **SECURITY WARNING**: Never commit real credentials to Git! See `SECURITY_NOTICE.md` for details.

Copy the example file and add your real credentials:
```bash
cp .env.example .env.local
# Edit .env.local with your actual MongoDB URI and secrets
```

Example `.env.local` structure:
```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-very-long-random-secret-key-change-in-production

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth
```

**🎓 Teaching Point**:
- Environment variables keep sensitive data secure
- `.env.local` is automatically ignored by Git
- `NEXTAUTH_SECRET` should be 32+ characters in production
- MongoDB URI format: `mongodb+srv://user:pass@cluster/database`
- **NEVER commit real credentials to version control**

#### **Step 2.2: MongoDB Atlas Setup**
1. Create MongoDB Atlas account
2. Create new cluster (free tier)
3. Create database user with password
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string and update `.env.local`

**🎓 Teaching Point**: 
- Cloud databases eliminate local setup complexity
- Atlas provides automatic backups and scaling
- Security: Use strong passwords and IP whitelisting

### **Phase 3: Database Layer Implementation**

#### **Step 3.1: MongoDB Connection Setup**
Create `src/lib/mongodb.ts`:
```typescript
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development, use global variable to preserve connection across HMR
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production, create new client for each connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

**🎓 Teaching Point**:
- Connection pooling prevents multiple connections in development
- Global variable preserves connection during Hot Module Replacement
- Production uses fresh connections for better performance
- Error handling for missing environment variables

#### **Step 3.2: User Type Definitions**
Create `src/types/user.ts`:
```typescript
export interface User {
  _id?: string;
  id?: string;
  name?: string;
  email: string;
  password?: string;
  role: 'job_seeker' | 'employer';
  emailVerified?: Date | null;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  role: 'job_seeker' | 'employer';
}

export interface UserLogin {
  email: string;
  password: string;
}
```

**🎓 Teaching Point**:
- TypeScript interfaces define data structure
- Optional properties use `?` operator
- Union types (`'job_seeker' | 'employer'`) restrict values
- Separation of concerns: different interfaces for different operations

#### **Step 3.3: User Service Layer**
Create `src/lib/userService.ts`:
```typescript
import bcrypt from 'bcryptjs';
import clientPromise from './mongodb';
import { User, UserRegistration } from '@/types/user';
import { ObjectId } from 'mongodb';

export class UserService {
  private static async getCollection() {
    const client = await clientPromise;
    const db = client.db('auth');
    return db.collection<User>('users');
  }

  static async createUser(userData: UserRegistration): Promise<User> {
    const collection = await this.getCollection();
    
    // Check for existing user
    const existingUser = await collection.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password with salt rounds of 12
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const newUser: Omit<User, '_id'> = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newUser);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return {
      ...userWithoutPassword,
      _id: result.insertedId.toString(),
    };
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email });
    
    if (user) {
      return {
        ...user,
        _id: user._id?.toString(),
      };
    }
    
    return null;
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
```

**🎓 Teaching Point**:
- Service layer pattern separates business logic from routes
- Static methods create utility class without instantiation
- Password hashing with salt prevents rainbow table attacks
- Never return passwords in API responses
- Error handling for duplicate users

### **Phase 4: NextAuth.js Configuration**

#### **Step 4.1: NextAuth Type Extensions**
Create `src/types/next-auth.d.ts`:
```typescript
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: 'job_seeker' | 'employer';
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role: 'job_seeker' | 'employer';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'job_seeker' | 'employer';
  }
}
```

**🎓 Teaching Point**:
- Module declaration extends existing types
- Adds custom fields (role) to NextAuth interfaces
- TypeScript ensures type safety across the application
- JWT interface defines token structure

#### **Step 4.2: NextAuth Configuration**
Create `src/lib/auth.ts`:
```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongodb';
import { UserService } from './userService';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: 'auth',
  }),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const user = await UserService.findUserByEmail(credentials.email);

          if (!user || !user.password) {
            throw new Error('Invalid email or password');
          }

          const isValidPassword = await UserService.verifyPassword(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error('Invalid email or password');
          }

          // Return user without password
          const { password, ...userWithoutPassword } = user;
          return {
            id: user._id || user.id || '',
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'job_seeker' | 'employer';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

**🎓 Teaching Point**:
- NextAuthOptions configures authentication behavior
- Credentials provider handles email/password login
- JWT strategy stores session data in tokens (stateless)
- Callbacks customize token and session data
- Custom pages override default NextAuth UI
- MongoDB adapter handles session storage

### **Phase 5: API Routes Implementation**

#### **Step 5.1: NextAuth API Route**
Create `src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

**🎓 Teaching Point**:
- Dynamic route `[...nextauth]` catches all auth-related requests
- Exports handler for both GET and POST methods
- NextAuth automatically handles signin, signout, session endpoints
- Configuration imported from centralized auth file

#### **Step 5.2: User Registration API**
Create `src/app/api/auth/register/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import { UserRegistration } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body: UserRegistration = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.password || !body.role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['job_seeker', 'employer'].includes(body.role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be either job_seeker or employer' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Create user
    const user = await UserService.createUser(body);

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.message === 'User already exists with this email') {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**🎓 Teaching Point**:
- API route handles POST requests for user registration
- Input validation prevents invalid data
- Proper HTTP status codes for different scenarios
- Error handling with specific error messages
- Security: Never expose internal error details to client

### **Phase 6: Frontend Components**

#### **Step 6.1: Session Provider Setup**
Create `src/components/providers/SessionProvider.tsx`:
```typescript
'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider>
      {children}
    </NextAuthSessionProvider>
  );
}
```

**🎓 Teaching Point**:
- 'use client' directive for client-side components
- Wrapper component for NextAuth session provider
- Makes session available throughout component tree
- TypeScript interface for component props

#### **Step 6.2: Navigation Component**
Create `src/components/layout/Navigation.tsx`:
```typescript
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">Jobs Portal</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Browse Jobs
            </Link>

            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome, {session.user.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {session.user.role === 'job_seeker' ? 'Job Seeker' : 'Employer'}
                  </span>
                </div>
                <button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**🎓 Teaching Point**:
- useSession hook provides authentication state
- Conditional rendering based on authentication status
- Role-based UI elements (showing user role)
- Responsive design with Tailwind classes
- Loading states for better UX

#### **Step 6.3: Authentication Pages**

**Sign Up Page** - Create `src/app/auth/signup/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'job_seeker' as 'job_seeker' | 'employer',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/auth/signin?message=Registration successful. Please sign in.');
      } else {
        setError(data.error || 'An error occurred during registration');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Form fields implementation */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name" name="name" type="text" required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your full name"
                value={formData.name} onChange={handleChange}
              />
            </div>
            {/* Additional form fields... */}
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit" disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

**🎓 Teaching Point**:
- Controlled components with useState for form data
- Client-side validation before API call
- Loading states and error handling
- Form submission with fetch API
- Redirect after successful registration
- Accessible form design with proper labels

### **Phase 7: Route Protection & Middleware**

#### **Step 7.1: Middleware Implementation**
Create `src/middleware.ts`:
```typescript
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
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
```

**🎓 Teaching Point**:
- Middleware runs before page rendering
- withAuth wrapper provides authentication context
- Role-based redirects prevent unauthorized access
- Matcher config specifies which routes to protect
- NextResponse.redirect for server-side redirects

#### **Step 7.2: Protected Route Component**
Create `src/components/auth/ProtectedRoute.tsx`:
```typescript
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
```

**🎓 Teaching Point**:
- Client-side route protection as backup to middleware
- useEffect for side effects (redirects)
- Loading states during session check
- Flexible component with optional role requirements
- Graceful handling of unauthorized access

### **Phase 8: Dashboard Implementation**

#### **Step 8.1: Role-Specific Dashboards**
Create `src/app/dashboard/employer/page.tsx`:
```typescript
'use client';

import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function EmployerDashboard() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute requiredRole="employer">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Welcome to your Employer Dashboard
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Hello, {session?.user.name}! Manage your job postings and find the best candidates.
                </p>

                {/* Dashboard content with cards for different features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {/* Job Postings Card */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Active Job Postings</dt>
                            <dd className="text-lg font-medium text-gray-900">0</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <button className="font-medium text-blue-600 hover:text-blue-500">
                          Post a new job
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Additional cards... */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
```

**🎓 Teaching Point**:
- Role-specific dashboard content
- ProtectedRoute wrapper ensures proper access
- Card-based layout for dashboard features
- Placeholder content for future features
- Responsive grid layout with Tailwind

### **Phase 9: Application Layout & Integration**

#### **Step 9.1: Root Layout Update**
Update `src/app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import Navigation from "@/components/layout/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jobs Portal - Find Your Dream Job",
  description: "Connect job seekers with employers. Find your next opportunity or hire the best talent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <Navigation />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

**🎓 Teaching Point**:
- Root layout wraps entire application
- SessionProvider makes authentication available globally
- Navigation component appears on all pages
- Font variables for consistent typography
- SEO-friendly metadata

---

## 🧪 **Testing & Validation**

### **Phase 10: Testing the Authentication System**

#### **Step 10.1: Manual Testing Checklist**

**Registration Testing:**
- [ ] Job seeker can register with valid data
- [ ] Employer can register with valid data
- [ ] Duplicate email registration is prevented
- [ ] Invalid role registration is rejected
- [ ] Password validation works (minimum 6 characters)
- [ ] Email format validation works

**Authentication Testing:**
- [ ] Registered users can sign in
- [ ] Invalid credentials are rejected
- [ ] Session persists across page refreshes
- [ ] Sign out functionality works

**Authorization Testing:**
- [ ] Unauthenticated users redirected to sign-in
- [ ] Job seekers cannot access employer dashboard
- [ ] Employers cannot access job seeker dashboard
- [ ] Authenticated users redirected from auth pages

#### **Step 10.2: Automated Testing Script**
Create a simple test script for API validation:
```javascript
// test-auth.js
const testRegistration = async (email, role) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Test ${role}`,
        email: email,
        password: 'password123',
        role: role
      }),
    });

    const data = await response.json();
    console.log(`${role} Registration:`, response.status, data);
    return response.status === 201;
  } catch (error) {
    console.error(`${role} Registration Error:`, error);
    return false;
  }
};

const runTests = async () => {
  console.log('🧪 Starting Authentication Tests...\n');

  // Test valid registrations
  await testRegistration('jobseeker@test.com', 'job_seeker');
  await testRegistration('employer@test.com', 'employer');

  // Test duplicate registration (should fail)
  await testRegistration('jobseeker@test.com', 'job_seeker');

  // Test invalid role (should fail)
  await testRegistration('invalid@test.com', 'invalid_role');

  console.log('\n✅ Tests Completed!');
};

runTests();
```

**🎓 Teaching Point**:
- Automated testing validates API functionality
- Test both success and failure scenarios
- Console logging helps debug issues
- Systematic testing approach

---

## 📚 **Key Learning Concepts**

### **Authentication Patterns**
1. **Stateless Authentication**: JWT tokens store user data
2. **Role-Based Access Control (RBAC)**: Different permissions per role
3. **Session Management**: NextAuth.js handles session lifecycle
4. **Password Security**: Hashing with salt prevents attacks

### **Next.js Concepts**
1. **App Router**: New routing system with layouts and pages
2. **API Routes**: Server-side endpoints in the same project
3. **Middleware**: Request interception for authentication
4. **Client vs Server Components**: 'use client' directive

### **Database Patterns**
1. **Service Layer**: Separates business logic from routes
2. **Data Validation**: Both client and server-side validation
3. **Error Handling**: Graceful error responses
4. **Connection Management**: Efficient database connections

### **Security Best Practices**
1. **Environment Variables**: Secure configuration management
2. **Input Validation**: Prevent malicious data
3. **Password Hashing**: Never store plain text passwords
4. **HTTPS in Production**: Encrypt data in transit

---

## 🚀 **Deployment Considerations**

### **Environment Setup**
```env
# Production Environment Variables
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=very-long-random-production-secret
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/auth
```

### **Security Checklist**
- [ ] Strong NEXTAUTH_SECRET (32+ characters)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Error messages don't expose sensitive data

### **Performance Optimization**
- [ ] Database indexes on frequently queried fields
- [ ] Connection pooling configured
- [ ] Image optimization enabled
- [ ] Static assets cached

---

## 🎯 **Next Steps & Extensions**

### **Immediate Enhancements**
1. **Email Verification**: Verify email addresses during registration
2. **Password Reset**: Allow users to reset forgotten passwords
3. **Profile Management**: Let users update their information
4. **Social Login**: Add Google/GitHub authentication

### **Advanced Features**
1. **Two-Factor Authentication**: Enhanced security
2. **Rate Limiting**: Prevent brute force attacks
3. **Audit Logging**: Track user actions
4. **Admin Dashboard**: Manage users and system

### **Sprint 2 Preparation**
- Job posting CRUD operations
- File upload for company logos
- Rich text editor for job descriptions
- Application management system

---

## 📖 **Additional Resources**

### **Documentation**
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### **Best Practices**
- [OWASP Authentication Guidelines](https://owasp.org/www-project-authentication-cheat-sheet/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [TypeScript Best Practices](https://typescript-eslint.io/docs/)

### **Troubleshooting**
- Check browser console for client-side errors
- Review server logs for API issues
- Verify environment variables are loaded
- Test database connectivity separately
- Use NextAuth.js debug mode for auth issues

---

## 🏆 **Assessment Criteria**

### **Technical Implementation (40%)**
- [ ] Proper NextAuth.js configuration
- [ ] Secure password handling
- [ ] Database integration working
- [ ] API routes implemented correctly

### **Security & Validation (30%)**
- [ ] Input validation on client and server
- [ ] Route protection implemented
- [ ] Role-based access control working
- [ ] Error handling without data exposure

### **Code Quality (20%)**
- [ ] TypeScript types properly defined
- [ ] Components well-structured
- [ ] Consistent coding style
- [ ] Proper separation of concerns

### **User Experience (10%)**
- [ ] Intuitive navigation
- [ ] Clear error messages
- [ ] Loading states implemented
- [ ] Responsive design

---

**🎓 This guide provides a complete foundation for understanding modern web authentication. Students should be able to explain each component's purpose and implement similar systems independently.**
