"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "../theme-provider";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light">
      
          <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </>
  );
}
