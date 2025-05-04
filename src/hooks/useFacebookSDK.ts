import { useEffect, useState } from 'react';

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

    const scriptAlreadyAdded = document.getElementById("facebook-jssdk");
    if (scriptAlreadyAdded) return;

    // Cria o script
    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
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
  const login = (callback: Parameters<FacebookSDK["login"]>[0]) => {
    if (typeof window !== "undefined" && isReady && window.FB) {
      window.FB.login(callback, {
        scope: "business_management, whatsapp_business_management",
        response_type: "code",
      });
    } else {
      console.warn("Facebook SDK ainda não está pronto.");
    }
  };

  return { isReady, login };
};
