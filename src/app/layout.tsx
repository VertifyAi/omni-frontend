import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CookiesProviderClient } from "@/components/providers/CookiesProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Omni - Suporte Inteligente",
  description: "Sistema de suporte inteligente para sua empresa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <CookiesProviderClient>
          {children}
          <Toaster />
        </CookiesProviderClient>
      </body>
    </html>
  );
}
