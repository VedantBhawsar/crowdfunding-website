import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Poppins({
  weight: ["400"],
  preload: true,
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crowdfunding website",
  description: "This is crowdfunding website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="bg-gradient-to-br from-indigo-50 to-white">
            <Navbar />
            <div className="mx-auto max-w-7xl h-full ">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
