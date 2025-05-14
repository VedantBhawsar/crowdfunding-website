import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import { CustomWalletProvider } from '@/context/CustomWalletContext';
import { headers } from 'next/headers';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import WalletProvider from '@/context/walletContext';

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Crowdfunding website',
  description: 'This is a crowdfunding website',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <NextTopLoader color="#145f63" showSpinner={false} />
        <WalletProvider cookies={cookies}>
          <CustomWalletProvider>
            <Providers>{children}</Providers>
          </CustomWalletProvider>
        </WalletProvider>
        <Toaster />
      </body>
    </html>
  );
}
