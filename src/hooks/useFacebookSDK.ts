import { useEffect, useState } from "react";

interface FacebookSDK {
  init: (params: {
    appId: string;
    cookie?: boolean;
    xfbml?: boolean;
    version: string;
  }) => void;
  login: (
    callback: (response: {
      status: string;
      authResponse?: {
        accessToken: string;
        userID: string;
        expiresIn: number;
        signedRequest: string;
      };
    }) => void,
    options?: Record<string, unknown>
  ) => void;
}

declare global {
  interface Window {
    FB: FacebookSDK;
    fbAsyncInit: () => void;
  }
}

export const useFacebookSDK = (appId: string) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 🔒 Lê o auth_token do cookie
    const getAuthTokenFromCookie = () => {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="));
      return cookieValue ? cookieValue.split("=")[1] : null;
    };

    // 💾 Salva no localStorage (disponível para onboarding depois)
    const authToken = getAuthTokenFromCookie();
    if (authToken) {
      localStorage.setItem("vertify_token", authToken);
    }

    const scriptAlreadyAdded = document.getElementById("facebook-jssdk");
    if (scriptAlreadyAdded) return;

    // Cria o script
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/pt_BR/sdk.js";
    script.async = true;
    script.defer = true;

    // Espera init antes de marcar como pronto
    window.fbAsyncInit = () => {
      window.FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: "v22.0",
      });
      setIsReady(true);
    };

    document.body.appendChild(script);
  }, [appId]);

  // Wrapper para chamar login apenas quando estiver pronto
  const login = () => {
    // Não precisa ser async/await aqui
    if (!isReady || typeof window === "undefined" || !window.FB) {
      console.warn("Facebook SDK ainda não está pronto.");
      return;
    }

    // const permissions =
    //   "business_management,whatsapp_business_management,pages_manage_metadata,whatsapp_business_messaging";
    // Adicionei 'pages_manage_metadata' e 'whatsapp_business_messaging' que são comuns e importantes.

    window.FB.login(
      (response) => {
        console.log("Resposta do login do Facebook:", response);
        if (response.status === "connected") {
          //fsdfsdfds
        } else {
          // O usuário não autorizou o app ou fechou o pop-up.
          console.error("Login com Facebook falhou ou não foi autorizado.");
          alert(
            "A integração com o Facebook não foi concluída. Por favor, tente novamente."
          );
        }
      },
      {
        // scope: permissions,
        config_id: process.env.NEXT_PUBLIC_META_CONFIG_ID,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: 'whatsapp_business_app_onboarding',
          sessionInfoVersion: '3'
        }
      }
    );
  };

  return { isReady, login };
};
