# 🚀 Jobs Portal Setup Instructions

## 📋 **Prerequisites**

- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Git installed
- Code editor (VS Code recommended)

## 🔧 **Initial Setup**

### 1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd jobs_portal_authentication
npm install
```

### 2. **Environment Configuration**

⚠️ **IMPORTANT**: Never commit real credentials to Git!

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your actual credentials
# DO NOT edit .env.example with real credentials
```

### 3. **MongoDB Atlas Setup**

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Sign up for free account
   - Create a new project

2. **Create Database Cluster**:
   - Click "Build a Database"
   - Choose "FREE" shared cluster
   - Select your preferred region
   - Create cluster (takes 1-3 minutes)

3. **Create Database User**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and strong password
   - Grant "Read and write to any database" role

4. **Configure Network Access**:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - For development: Add "0.0.0.0/0" (allows all IPs)
   - For production: Add specific IP addresses

5. **Get Connection String**:
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add `/auth` at the end for database name

### 4. **Update Environment Variables**

Edit `.env.local` with your actual values:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-very-long-random-string-here

# MongoDB Configuration
MONGODB_URI=mongodb+srv://[YOUR_USERNAME]:[YOUR_PASSWORD]@[YOUR_CLUSTER].mongodb.net/auth

# Email Configuration (optional for now)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=noreply@example.com
```

**Generate NEXTAUTH_SECRET**:
```bash
# Option 1: Use OpenSSL
openssl rand -base64 32

# Option 2: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator (use for development only)
# Visit: https://generate-secret.vercel.app/32
```

### 5. **Start Development Server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## ✅ **Verify Setup**

### Test Registration:
1. Go to `http://localhost:3000/auth/signup`
2. Create a test account (Job Seeker)
3. Check if user is created in MongoDB Atlas
4. Try logging in with the created account

### Test Authentication:
1. Sign in with test account
2. Verify redirect to appropriate dashboard
3. Test sign out functionality
4. Try accessing protected routes without authentication

## 🔍 **Troubleshooting**

### **MongoDB Connection Issues**
```
Error: MongoServerSelectionError
```
**Solutions**:
- Check MONGODB_URI in .env.local
- Verify database user credentials
- Check network access settings in Atlas
- Ensure database name is included in URI

### **NextAuth Issues**
```
Error: [next-auth][error][SIGNIN_EMAIL_ERROR]
```
**Solutions**:
- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### **Environment Variables Not Loading**
```
Error: Invalid/Missing environment variable
```
**Solutions**:
- Restart development server after changing .env.local
- Check file is named exactly `.env.local`
- Verify no syntax errors in environment file

## 📁 **Project Structure**

```
jobs_portal_authentication/
├── .env.example              # Template for environment variables
├── .env.local               # Your actual credentials (not in Git)
├── .gitignore               # Prevents committing sensitive files
├── SECURITY_NOTICE.md       # Security guidelines
├── SETUP_INSTRUCTIONS.md    # This file
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript definitions
└── package.json             # Dependencies and scripts
```

## 🛡️ **Security Checklist**

- [ ] Real credentials only in .env.local
- [ ] .env.local not committed to Git
- [ ] Strong passwords for all services
- [ ] 2FA enabled on MongoDB Atlas
- [ ] Network access properly configured
- [ ] NEXTAUTH_SECRET is long and random

## 📚 **Next Steps**

1. **Read Documentation**:
   - `STEP_BY_STEP_IMPLEMENTATION_GUIDE.md` - Detailed implementation guide
   - `QUICK_REFERENCE.md` - Quick lookup reference
   - `AUTHENTICATION_GUIDE.md` - Technical overview

2. **Explore Features**:
   - User registration and login
   - Role-based dashboards
   - Protected routes
   - Session management

3. **Development**:
   - Follow the implementation guide
   - Test all authentication flows
   - Understand security practices

## 🆘 **Need Help?**

- Check the troubleshooting section above
- Review the detailed implementation guide
- Verify all environment variables are correct
- Ensure MongoDB Atlas is properly configured

---

**Remember**: Keep your credentials secure and never commit them to version control! 🔒
