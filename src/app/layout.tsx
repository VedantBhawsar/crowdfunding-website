import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Providers from '@/components/providers';
import WalletProvider from '@/context/walletContext';
import { headers } from 'next/headers';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';

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
          <Providers>{children}</Providers>
        </WalletProvider>
        <Toaster />
      </body>
    </html>
  );
}
