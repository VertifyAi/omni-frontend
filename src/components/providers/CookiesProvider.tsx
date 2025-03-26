"use client"

import { CookiesProvider } from "react-cookie";

export function CookiesProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      {children}
    </CookiesProvider>
  );
} 