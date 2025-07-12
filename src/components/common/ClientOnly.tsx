'use client';

import { ReactNode, useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly component prevents hydration mismatches by only rendering
 * children on the client side after hydration is complete.
 * 
 * @param children - The content to render only on the client
 * @param fallback - Optional fallback content to show during server rendering
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
