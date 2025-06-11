import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CookiesProviderClient } from "@/components/providers/CookiesProvider";
import { ChatServiceProvider } from "@/components/ChatServiceProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { BillingProvider } from "@/contexts/BillingContext";
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
          id="clarity"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "rrmm4aa077");
            `,
          }}
        />
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
                {children}
              </ChatServiceProvider>
            </BillingProvider>
          </AuthProvider>
          <Toaster />
        </CookiesProviderClient>
      </body>
    </html>
  );
}
