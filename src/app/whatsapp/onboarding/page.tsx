"use client";

import { fetchApi } from "@/lib/fetchApi";
import { useEffect, useState } from "react";

export default function WhatsAppOnboarding() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateIntegration = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = params.get("access_token");
      setAccessToken(accessToken);
      const vertifyToken = localStorage.getItem("vertify_token");
      localStorage.removeItem("vertify_token");
      const dataAccessExpirationTime = params.get(
        "data_access_expiration_time"
      );
      const expiresIn = params.get("expires_in");

      try {
        if (accessToken && dataAccessExpirationTime && expiresIn) {
          await fetchApi("/api/integrations/whatsapp", {
            method: "POST",
            body: JSON.stringify({
              access_token: accessToken,
              data_access_expiration_time: dataAccessExpirationTime,
              expires_in: expiresIn,
            }),
            headers: {
              Authorization: `Bearer ${vertifyToken}`,
              "Content-Type": "application/json",
            },
          });
        }
      } catch (error) {
        console.error("Erro ao integrar o WhatsApp:", error);
      } finally {
        setIsLoading(false);
      }
    };

    updateIntegration();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-lg border text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Processando integração</h2>
          <p className="text-gray-500 mt-2">Aguarde enquanto finalizamos a integração do WhatsApp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-lg border text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        🎉 Integração concluída com sucesso!
      </h1>

      <p className="text-gray-700 mb-4">
        Sua conta de WhatsApp Business foi integrada com sucesso à plataforma
        Vertify.
      </p>

      <div className="text-left text-sm bg-gray-50 p-4 rounded-xl border mt-4">
        <p className="text-sm text-muted-foreground w-full overflow-hidden">
          <strong>Access Token:</strong> {accessToken || "Carregando..."}
        </p>
      </div>
    </div>
  );
}
