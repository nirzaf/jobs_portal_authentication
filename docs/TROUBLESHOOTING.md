# Troubleshooting Guide

## Common Issues and Solutions

### 1. Turbopack Build Errors

**Symptoms:**
- `ENOENT: no such file or directory` errors
- `Cannot find module '../chunks/ssr/[turbopack]_runtime.js'`
- Build manifest errors

**Solution:**
```bash
# Clean build cache
rm -rf .next
rm -rf node_modules/.cache

# Run without Turbopack
npm run dev
# or with Turbopack if needed
npm run dev:turbo
```

**Why this happens:**
- Turbopack is experimental and can have cache corruption issues
- Build artifacts can become inconsistent
- Module resolution can fail with corrupted cache

### 2. Hydration Errors

**Symptoms:**
- "Hydration failed because the server rendered HTML didn't match the client"
- Content flashing or jumping on page load

**Solution:**
- Use `useIsClient` hook for session-dependent content
- Wrap dynamic content in `ClientOnly` component
- Show loading states during hydration

### 3. MongoDB Connection Issues

**Symptoms:**
- `MongoParseError: Username contains unescaped characters`
- Connection timeout errors

**Solution:**
- Check `.env.local` has correct MongoDB URI
- Ensure credentials are properly URL-encoded
- Verify network connectivity to MongoDB Atlas

### 4. NextAuth Session Issues

**Symptoms:**
- Session not persisting
- Authentication redirects not working

**Solution:**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure MongoDB adapter is properly configured

### 5. TypeScript/ESLint Errors

**Symptoms:**
- Build failing with type errors
- Unused variable warnings

**Solution:**
- Use proper type assertions instead of `any`
- Add ESLint disable comments for intentionally unused variables
- Import types correctly for module augmentation

## Development Scripts

```bash
# Standard development (recommended)
npm run dev

# Development with Turbopack (experimental)
npm run dev:turbo

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Cache Cleaning Commands

```bash
# Clean Next.js cache
rm -rf .next

# Clean node modules cache
rm -rf node_modules/.cache

# Clean all caches and reinstall
rm -rf .next node_modules/.cache node_modules package-lock.json
npm install
```

## Environment Setup Checklist

- [ ] `.env.local` exists with all required variables
- [ ] MongoDB URI is correctly formatted
- [ ] NEXTAUTH_SECRET is set to a secure random string
- [ ] NEXTAUTH_URL matches your development/production URL
- [ ] Node.js version is compatible (18+)
- [ ] All dependencies are installed (`npm install`)

## Performance Tips

1. **Use standard Next.js dev mode** for stability
2. **Enable Turbopack only when needed** for faster builds
3. **Clean cache regularly** if experiencing build issues
4. **Monitor bundle sizes** in build output
5. **Use proper code splitting** with dynamic imports
