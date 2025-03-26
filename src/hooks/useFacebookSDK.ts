import { useEffect } from 'react';

interface FacebookResponse {
  accessToken: string;
  userID: string;
  signedRequest: string;
}

interface FacebookLoginResponse {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse: FacebookResponse | null;
}

interface FacebookInitParams {
  appId: string;
  cookie: boolean;
  xfbml: boolean;
  version: string;
}

interface FacebookSDK {
  init: (params: FacebookInitParams) => void;
  login: (callback: (response: FacebookLoginResponse) => void, options?: { scope: string }) => void;
  logout: (callback: (response: { status: string }) => void) => void;
  getLoginStatus: (callback: (response: FacebookLoginResponse) => void) => void;
}

declare global {
  interface Window {
    FB: FacebookSDK;
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

  const checkLoginState = (): Promise<FacebookLoginResponse> => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('SDK do Facebook não carregado'));
        return;
      }

      window.FB.getLoginStatus((response: FacebookLoginResponse) => {
        resolve(response);
      });
    });
  };

  const login = (): Promise<FacebookLoginResponse> => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        reject(new Error('SDK do Facebook não carregado'));
        return;
      }

      window.FB.login((response: FacebookLoginResponse) => {
        resolve(response);
      }, { scope: 'whatsapp_business_management' });
    });
  };

  const logout = (callback: (response: { status: string }) => void): void => {
    window.FB.logout(callback);
  };

  const getLoginStatus = (callback: (response: FacebookLoginResponse) => void): void => {
    window.FB.getLoginStatus(callback);
  };

  return {
    checkLoginState,
    login,
    logout,
    getLoginStatus
  };
}; 