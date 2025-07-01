import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CookiesProviderClient } from "@/components/providers/CookiesProvider";
import { ChatServiceProvider } from "@/components/ChatServiceProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { BillingProvider } from "@/contexts/BillingContext";
import { RootLayoutClient } from "@/components/root-layout-client";
import Script from "next/script";

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
      <head>
        <Script
          id="chat-service-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                console.log('Inicializando ChatService via script...');
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <CookiesProviderClient>
          <AuthProvider>
            <BillingProvider>
              <ChatServiceProvider>
                <RootLayoutClient>
                  {children}
                </RootLayoutClient>
              </ChatServiceProvider>
            </BillingProvider>
          </AuthProvider>
          <Toaster />
        </CookiesProviderClient>
      </body>
    </html>
  );
}
