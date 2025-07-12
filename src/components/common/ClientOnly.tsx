'use client';

import { ReactNode } from 'react';
import { useIsClient } from '@/hooks/useIsClient';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
  suppressHydrationWarning?: boolean;
}

/**
 * ClientOnly component prevents hydration mismatches by only rendering
 * children on the client side after hydration is complete.
 *
 * @param children - The content to render only on the client
 * @param fallback - Optional fallback content to show during server rendering
 * @param suppressHydrationWarning - Whether to suppress hydration warnings
 */
export default function ClientOnly({
  children,
  fallback = null,
  suppressHydrationWarning = false
}: ClientOnlyProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return <div suppressHydrationWarning={suppressHydrationWarning}>{fallback}</div>;
  }

  return <div suppressHydrationWarning={suppressHydrationWarning}>{children}</div>;
}
