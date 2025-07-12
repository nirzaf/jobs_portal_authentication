import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

interface HydrationSafeClerkProviderProps {
  children: ReactNode;
}

/**
 * A wrapper around ClerkProvider that provides consistent SSR/client rendering
 */
export default function HydrationSafeClerkProvider({ children }: HydrationSafeClerkProviderProps) {
  // Always provide ClerkProvider for both SSR and client
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
