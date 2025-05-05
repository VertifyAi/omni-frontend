"use client";

import { fetchApi } from "@/lib/fetchApi";
import { useEffect, useState } from "react";

export default function WhatsAppOnboarding() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const updateIntegration = async () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = params.get("access_token");
      setAccessToken(accessToken);
      const vertifyToken = localStorage.getItem("vertify_token");
      localStorage.removeItem("vertify_token");
      const dataAccessExpirationTime = params.get(
        "data_access_expiration_time"
      );
      const expiresIn = params.get("expires_in");

      if (accessToken && dataAccessExpirationTime && expiresIn) {
        await fetchApi("/api/integrations/whatsapp", {
          method: "POST",
          body: JSON.stringify({
            config: {
              access_token: accessToken,
              data_access_expiration_time: dataAccessExpirationTime,
              expires_in: expiresIn,
            },
          }),
          headers: {
            Authorization: `Bearer ${vertifyToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    };

    updateIntegration();
  }, []);

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
        <p>
          <strong>Access Token:</strong> {accessToken || "Carregando..."}
        </p>
      </div>
    </div>
  );
}
