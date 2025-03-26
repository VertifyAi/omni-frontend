import { useEffect } from 'react';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export const useFacebookSDK = (appId: string) => {
  useEffect(() => {
    // Carrega o SDK do Facebook
    const loadFacebookSDK = () => {
      if (window.FB) return;

      window.fbAsyncInit = function() {
        window.FB.init({
          appId: appId,
          cookie: true,
          xfbml: true,
          version: 'v19.0' // Usando a versão mais recente
        });
      };

      // Carrega o script do SDK
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = "https://connect.facebook.net/pt_BR/sdk.js";
      script.async = true;
      script.defer = true;
      
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);
    };

    loadFacebookSDK();
  }, [appId]);

  const checkLoginState = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('SDK do Facebook não carregado'));
        return;
      }

      window.FB.getLoginStatus((response: any) => {
        resolve(response);
      });
    });
  };

  const login = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('SDK do Facebook não carregado'));
        return;
      }

      window.FB.login((response: any) => {
        resolve(response);
      }, { scope: 'whatsapp_business_management' });
    });
  };

  return {
    checkLoginState,
    login
  };
}; 