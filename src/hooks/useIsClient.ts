'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to detect if the component is running on the client side.
 * This helps prevent hydration mismatches between server and client rendering.
 * 
 * @returns boolean - true if running on client, false if on server
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
