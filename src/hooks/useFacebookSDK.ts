import { useEffect, useState } from 'react';

interface FacebookSDK {
  init: (params: { appId: string; cookie?: boolean; xfbml?: boolean; version: string }) => void;
  login: (callback: (response: { status: string; authResponse?: { accessToken: string; userID: string; expiresIn: number; signedRequest: string; } }) => void, options?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    FB: FacebookSDK;
    fbAsyncInit: () => void;
  }
}

export const useFacebookSDK = (appId: string) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadFacebookSDK = () => {
      if (window.FB) {
        setIsInitialized(true);
        return;
      }

      window.fbAsyncInit = () => {
        window.FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: 'v22.0',
        });
        setIsInitialized(true);
      };

      const script = document.createElement('script');
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, [appId]);

  return { isInitialized };
};
