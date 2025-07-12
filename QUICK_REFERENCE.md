# Jobs Portal Authentication - Quick Reference

## 🚀 **Quick Start Commands**

```bash
# 1. Install dependencies
npm install next-auth @auth/mongodb-adapter mongodb bcryptjs @types/bcryptjs

# 2. Set up environment variables (⚠️ NEVER commit real credentials!)
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and NextAuth secret

# 3. Start development server
npm run dev
```

⚠️ **Security Note**: See `SECURITY_NOTICE.md` for important credential handling guidelines.

## 📁 **File Structure Overview**

```
src/
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts     # NextAuth API routes
│   │   └── register/route.ts          # User registration
│   ├── auth/
│   │   ├── signin/page.tsx           # Sign-in page
│   │   └── signup/page.tsx           # Sign-up page
│   ├── dashboard/
│   │   ├── employer/page.tsx         # Employer dashboard
│   │   └── job-seeker/page.tsx       # Job seeker dashboard
│   └── layout.tsx                    # Root layout
├── components/
│   ├── auth/ProtectedRoute.tsx       # Route protection
│   ├── layout/Navigation.tsx         # Navigation bar
│   └── providers/SessionProvider.tsx # Session provider
├── lib/
│   ├── auth.ts                       # NextAuth config
│   ├── mongodb.ts                    # Database connection
│   └── userService.ts                # User operations
├── types/
│   ├── next-auth.d.ts               # NextAuth types
│   └── user.ts                      # User interfaces
└── middleware.ts                     # Route protection
```

## 🔧 **Key Configuration Files**

### **Environment Variables (.env.local)**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
MONGODB_URI=mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/auth
```

### **NextAuth Configuration (src/lib/auth.ts)**
```typescript
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: 'auth' }),
  providers: [CredentialsProvider({ /* config */ })],
  session: { strategy: 'jwt' },
  callbacks: { jwt: /* role handling */, session: /* user data */ },
  pages: { signIn: '/auth/signin', signUp: '/auth/signup' },
};
```

### **Middleware (src/middleware.ts)**
```typescript
export default withAuth(
  function middleware(req) {
    // Role-based redirects and protection logic
  },
  { callbacks: { authorized: ({ token, req }) => /* auth logic */ } }
);
```

## 🎯 **Core Components Purpose**

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **UserService** | Database operations | User CRUD, password hashing, validation |
| **NextAuth Config** | Authentication setup | Providers, callbacks, session management |
| **Middleware** | Route protection | Role-based access, redirects |
| **ProtectedRoute** | Component protection | Client-side route guarding |
| **Navigation** | Auth-aware UI | Login/logout, role display |
| **SessionProvider** | Context provider | Makes session available globally |

## 🔐 **Authentication Flow**

1. **Registration**: User submits form → API validates → Password hashed → Stored in MongoDB
2. **Login**: Credentials submitted → NextAuth validates → JWT token created → Session established
3. **Authorization**: Middleware checks token → Role verified → Route access granted/denied
4. **Session**: JWT token contains user data → Available via useSession hook

## 🛡️ **Security Features**

- **Password Hashing**: bcrypt with salt rounds of 12
- **JWT Tokens**: Signed tokens with user role
- **Route Protection**: Middleware + component guards
- **Input Validation**: Client and server-side
- **CSRF Protection**: Built into NextAuth.js
- **Environment Variables**: Secure configuration

## 📊 **Database Schema**

### **Users Collection (MongoDB)**
```typescript
interface User {
  _id?: string;
  name?: string;
  email: string;           // Unique identifier
  password?: string;       // Hashed with bcrypt
  role: 'job_seeker' | 'employer';  // User type
  createdAt?: Date;
  updatedAt?: Date;
}
```

## 🎨 **UI Components**

### **Key Pages**
- **Home (/)**: Landing page with role-based signup
- **Sign Up (/auth/signup)**: Registration with role selection
- **Sign In (/auth/signin)**: Login form
- **Employer Dashboard**: Job management interface
- **Job Seeker Dashboard**: Application tracking

### **Navigation States**
- **Unauthenticated**: Sign In, Sign Up buttons
- **Authenticated**: Welcome message, role badge, Sign Out
- **Loading**: Skeleton placeholders

## 🧪 **Testing Checklist**

### **Registration**
- [ ] Valid job seeker registration
- [ ] Valid employer registration  
- [ ] Duplicate email prevention
- [ ] Invalid role rejection
- [ ] Password validation

### **Authentication**
- [ ] Valid login works
- [ ] Invalid credentials rejected
- [ ] Session persistence
- [ ] Sign out functionality

### **Authorization**
- [ ] Protected routes require auth
- [ ] Role-based dashboard access
- [ ] Middleware redirects work
- [ ] Component protection active

## 🚨 **Common Issues & Solutions**

### **MongoDB Connection**
```
Error: connect ECONNREFUSED
Solution: Check MONGODB_URI in .env.local
```

### **NextAuth Session**
```
Error: Session not available
Solution: Wrap app in SessionProvider
```

### **Route Protection**
```
Error: Unauthorized access
Solution: Check middleware matcher config
```

### **TypeScript Errors**
```
Error: Property 'role' does not exist
Solution: Check next-auth.d.ts type extensions
```

## 📈 **Performance Tips**

- Use MongoDB connection pooling
- Implement proper loading states
- Optimize images and assets
- Add database indexes for queries
- Cache static content

## 🔄 **Development Workflow**

1. **Start Development**: `npm run dev`
2. **Test Registration**: Create test accounts
3. **Verify Authentication**: Test login/logout
4. **Check Authorization**: Test role-based access
5. **Debug Issues**: Check browser console + server logs

## 📚 **Quick Links**

- [NextAuth.js Docs](https://next-auth.js.org/)
- [MongoDB Atlas](https://cloud.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js App Router](https://nextjs.org/docs/app)

## 🎓 **Learning Outcomes**

After completing this implementation, students will understand:
- Modern authentication patterns
- Role-based access control
- Database integration
- Security best practices
- Next.js full-stack development
- TypeScript in React applications

---

**💡 This quick reference complements the detailed step-by-step guide and provides instant access to key information during development and training sessions.**
