"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { WhatsAppTutorial } from "@/components/WhatsAppTutorial";
import { useState } from "react";
import { useFacebookSDK } from "@/hooks/useFacebookSDK";


const socialNetworks = [
  {
    name: "WhatsApp",
    description: "Gerencie todas as conversas do WhatsApp em um só lugar.",
    icon: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+27.svg",
    connected: false,
  },
  {
    name: "Facebook",
    description: "Conecte sua página do Facebook para gerenciar mensagens.",
    icon: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+20.svg",
    connected: false,
    soon: true,
  },
  {
    name: "Instagram",
    description: "Integre sua conta do Instagram para responder DMs.",
    icon: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+21.svg",
    connected: false,
    soon: true,
  },
  {
    name: "Telegram",
    description: "Integre seus canais e grupos do Telegram.",
    icon: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+16.svg",
    connected: false,
    soon: true,
  },
  // {
  //   name: "TikTok",
  //   description: "Responda mensagens diretas do TikTok.",
  //   icon: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+19.svg",
  //   connected: false,
  // },
];

export default function IntegrationsPage() {
  const [showWhatsAppTutorial, setShowWhatsAppTutorial] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const { isReady, login } = useFacebookSDK(
    process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string
  );
  console.log('code', code);

  const handleConnect = (networkName: string) => {
    if (networkName === "WhatsApp") {
      setShowWhatsAppTutorial(true);
    }
  };

  const handleWhatsAppConnect = () => {
    if (!isReady) {
      return;
    }
  
    login((response) => {
      if (response.authResponse) {
        setCode(response.authResponse.accessToken);
        console.log("Access token:", response.authResponse.accessToken);
        alert("Login bem-sucedido! Token recebido.");
      } else {
        alert("Erro no login do Facebook.");
      }
    });
  };

  if (showWhatsAppTutorial) {
    return (
      <div className="container p-8">
        <WhatsAppTutorial
          onBack={() => setShowWhatsAppTutorial(false)}
          onConnect={handleWhatsAppConnect}
          isConnecting={true}
        />
      </div>
    );
  }

  return (
    <div className="container p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Integrações</h1>
        <p className="text-muted-foreground mt-2">
          Conecte suas redes sociais para gerenciar todas as conversas em um só
          lugar.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {socialNetworks.map((network, index) => (
          <Card key={network.name} className="relative overflow-hidden">
            {network.connected && (
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-600">Conectado</span>
                </div>
              </div>
            )}
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="">
                <Avatar key={index} className="size-12 border">
                  <AvatarImage src={network.icon} alt={network.name} />
                </Avatar>
              </div>
              <div>
                <CardTitle>{network.name}</CardTitle>
                <CardDescription className="mt-1.5 text-sm h-12">
                  {network.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant={network.connected ? "outline" : "default"}
                className={`w-full ${network.soon ? "cursor-not-allowed" : ""}`}
                onClick={() => handleConnect(network.name)}
                disabled={network.soon}
              >
                {network.soon
                  ? "Em breve"
                  : network.connected
                  ? "Desconectar"
                  : "Conectar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
