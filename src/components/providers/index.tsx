'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from '../theme-provider';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Ensure we only mount the providers on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shift
    return (
      <ThemeProvider attribute="class" defaultTheme="system">
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    );
  }

  // Note: We don't need to create a query client here as it's already created in WalletProvider
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
