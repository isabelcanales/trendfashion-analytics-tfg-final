"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={5} refetchOnWindowFocus={true}>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        expand={true}
        closeButton
      />
    </SessionProvider>
  );
}
