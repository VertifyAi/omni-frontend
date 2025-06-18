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
import { useState, useEffect } from "react";
import { useFacebookSDK } from "@/hooks/useFacebookSDK";
import { fetchApi } from "@/lib/fetchApi";
import { toast } from "sonner";

interface Integration {
  id: string;
  type: string;
  active: boolean;
  // outros campos que a API pode retornar
}

const socialNetworks = [
  {
    name: "WhatsApp",
    type: "WHATSAPP",
    description: "Gerencie todas as conversas do WhatsApp em um só lugar.",
    icon: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+27.svg",
    connected: false,
  },
  {
    name: "Facebook",
    type: "FACEBOOK",
    description: "Conecte sua página do Facebook para gerenciar mensagens.",
    icon: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+20.svg",
    connected: false,
    soon: true,
  },
  {
    name: "Instagram",
    type: "INSTAGRAM",
    description: "Integre sua conta do Instagram para responder DMs.",
    icon: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+21.svg",
    connected: false,
    soon: true,
  },
  {
    name: "Telegram",
    type: "TELEGRAM",
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
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  
  const { isReady, login } = useFacebookSDK(
    process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string
  );

  const fetchIntegrations = async () => {
    try {
      setIsLoading(true);
      const response = await fetchApi('/api/integrations', {
        method: 'GET',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao buscar integrações');
      }

      const data = await response.json();
      setIntegrations(data);
    } catch (error) {
      console.error('Erro ao buscar integrações:', error);
      toast.error('Erro ao carregar integrações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async (type: string) => {
    try {
      setIsDeactivating(true);
      const response = await fetchApi(`/${type}/desactivate`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao desativar integração');
      }
      
      toast.success('Integração desativada com sucesso!');
      // Recarregar integrações
      await fetchIntegrations();
    } catch (error) {
      console.error('Erro ao desativar integração:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao desativar integração');
    } finally {
      setIsDeactivating(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const isIntegrationActive = (type: string) => {
    return integrations.some(integration => integration.type === type && integration.active);
  };

  const handleConnect = (networkName: string) => {
    if (networkName === "WhatsApp") {
      setShowWhatsAppTutorial(true);
    }
  };

  const handleWhatsAppConnect = async () => {
    if (!isReady) {
      return;
    }

    try {
      setIsConnecting(true);
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];
      localStorage.setItem("vertify_token", authToken as string);

      await login();
      
      // Após conectar, recarregar integrações
      await fetchIntegrations();
      setShowWhatsAppTutorial(false);
    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast.error('Erro ao conectar integração');
    } finally {
      setIsConnecting(false);
    }
  };

  if (showWhatsAppTutorial) {
    const whatsappActive = isIntegrationActive("WHATSAPP");
    
    return (
      <div className="container p-8">
        <WhatsAppTutorial
          onBack={() => setShowWhatsAppTutorial(false)}
          onConnect={handleWhatsAppConnect}
          onDeactivate={whatsappActive ? () => handleDeactivate("WHATSAPP") : undefined}
          isConnecting={isConnecting}
          isDeactivating={isDeactivating}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Integrações</h1>
          <p className="text-muted-foreground mt-2">
            Conecte suas redes sociais para gerenciar todas as conversas em um só lugar.
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando integrações...</p>
          </div>
        </div>
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
        {socialNetworks.map((network, index) => {
          const isActive = isIntegrationActive(network.type);
          
          return (
            <Card key={network.name} className="relative overflow-hidden">
              {isActive && (
                <div className="absolute top-5 right-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-green-600 font-medium">Ativo</span>
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
                  <CardTitle className="flex items-center gap-2">
                    {network.name}
                  </CardTitle>
                  <CardDescription className="mt-1.5 text-sm h-12">
                    {network.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant={isActive ? "outline" : "default"}
                  className={`w-full ${network.soon ? "cursor-not-allowed" : ""}`}
                  onClick={() => handleConnect(network.name)}
                  disabled={network.soon || isDeactivating}
                >
                  {network.soon
                    ? "Em breve"
                    : isActive
                    ? "Gerenciar"
                    : "Conectar"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
