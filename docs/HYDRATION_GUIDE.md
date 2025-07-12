# Hydration Error Prevention Guide

## What are Hydration Errors?

Hydration errors occur when the HTML rendered on the server doesn't match what React renders on the client during the initial render. This commonly happens with:

- Authentication state (session data)
- Dynamic content that depends on browser APIs
- Date/time formatting
- Random values
- Browser-specific features

## Solutions Implemented

### 1. useIsClient Hook

We've created a custom hook that detects when the component is running on the client:

```typescript
// src/hooks/useIsClient.ts
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}
```

### 2. ClientOnly Component

A wrapper component that only renders children on the client:

```typescript
// src/components/common/ClientOnly.tsx
export default function ClientOnly({ children, fallback = null }) {
  const isClient = useIsClient();
  
  if (!isClient) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
```

### 3. Navigation Component Fix

The Navigation component now properly handles session state:

```typescript
// Before (causes hydration error)
{status === 'loading' ? (
  <LoadingSpinner />
) : session ? (
  <UserMenu />
) : (
  <LoginButtons />
)}

// After (prevents hydration error)
{!isClient || status === 'loading' ? (
  <LoadingSpinner />
) : session ? (
  <UserMenu />
) : (
  <LoginButtons />
)}
```

## Best Practices

1. **Always use `useIsClient` for session-dependent rendering**
2. **Wrap dynamic content in `ClientOnly` when needed**
3. **Show loading states during hydration**
4. **Avoid using browser APIs during SSR**
5. **Use consistent date formatting between server and client**

## Common Patterns

### Session-dependent Content
```typescript
const isClient = useIsClient();
const { data: session, status } = useSession();

if (!isClient || status === 'loading') {
  return <LoadingSpinner />;
}

return session ? <AuthenticatedContent /> : <PublicContent />;
```

### Browser API Usage
```typescript
<ClientOnly fallback={<div>Loading...</div>}>
  <ComponentThatUsesBrowserAPI />
</ClientOnly>
```

### Dynamic Timestamps
```typescript
<ClientOnly fallback="Loading time...">
  <span>{new Date().toLocaleString()}</span>
</ClientOnly>
```
