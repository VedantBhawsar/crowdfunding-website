"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "../theme-provider";
import { SessionProvider } from "next-auth/react";
import { useTheme } from "next-themes";

export default function Providers({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
        <SessionProvider>
          {children}
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
