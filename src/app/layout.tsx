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
  description: "This is a crowdfunding website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Navbar */}
          <Navbar />

          {/* Content Area */}
          <div
            className="flex-1 flex flex-col justify-center items-center mx-auto max-w-7xl w-full px-4 pt-16"
            style={{
              paddingBottom: "20px", // Space for footer
              boxSizing: "border-box",
            }}
          >
            {children}
          </div>

          {/* Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
