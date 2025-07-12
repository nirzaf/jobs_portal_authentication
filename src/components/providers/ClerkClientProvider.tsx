'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';
import { useIsClient } from '@/hooks/useIsClient';

interface ClerkClientProviderProps {
  children: ReactNode;
}

/**
 * Client-side only Clerk provider to prevent hydration mismatches
 */
export default function ClerkClientProvider({ children }: ClerkClientProviderProps) {
  const isClient = useIsClient();

  if (!isClient) {
    // Return children without Clerk provider during SSR
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#2563eb',
        },
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-sm normal-case',
          card: 'shadow-lg',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
