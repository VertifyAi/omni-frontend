"use client";

import { fetchApi } from "@/lib/fetchApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setMixpanelTrack } from "@/lib/mixpanelClient";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  loading: boolean;
}

export default function WhatsAppOnboarding() {
  const router = useRouter();
  const [accessToken, setCode] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "code",
      title: "Configurando integração",
      description: "Salvando credenciais de acesso do WhatsApp Business",
      completed: false,
      loading: false,
    },
  ]);

  const updateStep = (stepId: string, updates: Partial<OnboardingStep>) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, ...updates } : step))
    );
  };

  useEffect(() => {
    const performOnboarding = async () => {
      try {
        setError(null);

        const params = new URLSearchParams(window.location.search.slice(1));
        const code = params.get("code");

        setCode(code);

        const vertifyToken = localStorage.getItem("vertify_token");
        localStorage.removeItem("vertify_token");

        if (!code) {
          throw new Error("Parâmetros de integração incompletos");
        }

        updateStep("code", { loading: true });

        await fetchApi("/api/integrations/whatsapp", {
          method: "POST",
          body: JSON.stringify({
            code,
          }),
          headers: {
            Authorization: `Bearer ${vertifyToken}`,
            "Content-Type": "application/json",
          },
        });

        updateStep("code", { loading: false, completed: true });

        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsComplete(true);
      } catch (error) {
        console.error("Erro no onboarding:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");

        setMixpanelTrack("whatsapp_onboarding_error", {
          event_id: "whatsapp_onboarding_error",
          properties: {
            error: error instanceof Error ? error.message : "Erro desconhecido",
          },
        });
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
