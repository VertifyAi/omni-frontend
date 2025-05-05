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
  const login = async () => {
    if (!isReady || typeof window === "undefined") {
      console.warn("Facebook SDK ainda não está pronto.");
      return;
    }

    const redirectUri = "https://vertify.com.br/whatsapp/onboarding";
    const oauthUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=${encodeURIComponent(
      "business_management,whatsapp_business_management"
    )}`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      oauthUrl,
      "Facebook Login",
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes`
    );

    if (!popup) {
      alert(
        "Não foi possível abrir a janela de login. Verifique se o navegador bloqueou pop-ups."
      );
    }
  };

  return { isReady, login };
};
