'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from '../theme-provider';
import { SessionProvider } from 'next-auth/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { WagmiConfig } from 'wagmi';
import { config } from '@/config/wagmi';

export default function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Ensure we only mount the WagmiConfig provider on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shift
    return (
      <ThemeProvider attribute="class" defaultTheme="light">
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    );
  }

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
        <SessionProvider>
          <WagmiConfig config={config}>
            {children}
          </WagmiConfig>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
