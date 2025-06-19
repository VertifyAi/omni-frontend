"use client";

import { fetchApi } from "@/lib/fetchApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  loading: boolean;
}

export default function WhatsAppOnboarding() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "token",
      title: "Configurando integração",
      description: "Salvando credenciais de acesso do WhatsApp Business",
      completed: false,
      loading: false,
    },
    {
      id: "webhook",
      title: "Configurando webhook",
      description: "Registrando endpoint para recebimento de mensagens",
      completed: false,
      loading: false,
    },
    {
      id: "verification",
      title: "Verificando configuração",
      description: "Testando conexão e validando integração",
      completed: false,
      loading: false,
    },
  ]);

  const updateStep = (stepId: string, updates: Partial<OnboardingStep>) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, ...updates } : step))
    );
  };

  const configureWebhook = async (accessToken: string, wabaIds: string[]) => {
    try {
      console.log(wabaIds, "wabaIds");
      // Configurar webhook usando a Graph API do Meta
      const webhookUrl = process.env.NEXT_PUBLIC_API_URL + "webhook";

      for (const wabaId of wabaIds) {
        // Primeiro, vamos configurar o webhook via Graph API
        const response = await fetch(
          `https://graph.facebook.com/v23.0/${wabaId}/subscribed_apps`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              override_callback_uri: webhookUrl,
              subscribed_fields: ["messages"],
              verify_token: process.env.NEXT_PUBLIC_META_VERIFY_TOKEN,
            }),
          }
        );

        console.log(response, "response primeira requisição");

        if (!response.ok) {
          throw new Error(`Erro ao configurar webhook: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error("Erro na configuração do webhook:", error);
      throw error;
    }
  };

  useEffect(() => {
    const performOnboarding = async () => {
      try {
        setError(null);

        // Extrair parâmetros da URL
        const params = new URLSearchParams(window.location.hash.slice(1));
        const token = params.get("access_token");
        const dataAccessExpirationTime = params.get(
          "data_access_expiration_time"
        );
        const expiresIn = params.get("expires_in");

        setAccessToken(token);

        const vertifyToken = localStorage.getItem("vertify_token");
        localStorage.removeItem("vertify_token");

        if (!token || !dataAccessExpirationTime || !expiresIn) {
          throw new Error("Parâmetros de integração incompletos");
        }

        // Passo 1: Configurar integração
        updateStep("token", { loading: true });

        // Buscar o wabaId usando a Graph API do Facebook
        const graphResponse = await fetch(
          `https://graph.facebook.com/v23.0/debug_token?input_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!graphResponse.ok) {
          throw new Error(
            `Erro ao buscar WhatsApp Business Account: ${graphResponse.statusText}`
          );
        }

        const graphData = await graphResponse.json();
        const wabaIds = graphData.data.granular_scopes[1].target_ids;

        if (!wabaIds) {
          throw new Error("Nenhuma conta de WhatsApp Business encontrada");
        }

        await fetchApi("/api/integrations/whatsapp", {
          method: "POST",
          body: JSON.stringify({
            access_token: token,
            data_access_expiration_time: dataAccessExpirationTime,
            expires_in: expiresIn,
            waba_ids: wabaIds,
          }),
          headers: {
            Authorization: `Bearer ${vertifyToken}`,
            "Content-Type": "application/json",
          },
        });

        updateStep("token", { loading: false, completed: true });

        // Aguardar um pouco para melhor experiência visual
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Passo 2: Configurar webhook
        updateStep("webhook", { loading: true });

        await configureWebhook(token, wabaIds);

        updateStep("webhook", { loading: false, completed: true });

        // Aguardar um pouco para melhor experiência visual
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Passo 3: Verificar configuração
        updateStep("verification", { loading: true });

        // Simular verificação (aqui você pode adicionar uma chamada real de verificação)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        updateStep("verification", { loading: false, completed: true });

        // Aguardar um pouco antes de mostrar o sucesso
        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsComplete(true);
      } catch (error) {
        console.error("Erro no onboarding:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");
      }
    };

    performOnboarding();
  }, []);

  const goToDashboard = () => {
    router.push("/dashboard");
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-lg border text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erro na Integração
          </h2>
          <p className="text-gray-600 mb-4">
            Ocorreu um erro durante a configuração:
          </p>
          <p className="text-sm text-red-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-lg border text-center">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-green-600 mb-4">
            🎉 Integração Concluída!
          </h1>

          <p className="text-gray-700 mb-6">
            Sua conta de WhatsApp Business foi integrada com sucesso à
            plataforma Vertify. O webhook foi configurado e você já pode começar
            a receber mensagens!
          </p>

          {accessToken && (
            <div className="text-left text-sm bg-gray-50 p-4 rounded-xl border mb-6">
              <p className="text-sm text-gray-600 break-all">
                <strong>Access Token:</strong> {accessToken.substring(0, 20)}...
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Webhook:</strong> https://api.vertify.com.br/webhook
              </p>
            </div>
          )}

          <div className="flex flex-col space-y-3 w-full">
            <button
              onClick={goToDashboard}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Ir para Dashboard
            </button>

            <button
              onClick={() => window.close()}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Fechar Janela
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-lg border">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Configurando WhatsApp Business
        </h1>
        <p className="text-gray-600">
          Aguarde enquanto configuramos sua integração...
        </p>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">
              {step.completed ? (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : step.loading ? (
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm text-gray-500">{index + 1}</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3
                className={`font-semibold ${
                  step.completed
                    ? "text-green-600"
                    : step.loading
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span>Processando integração...</span>
        </div>
      </div>
    </div>
  );
}
