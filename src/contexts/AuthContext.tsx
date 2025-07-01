"use client";

import { User, UserRole } from "@/types/users";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setMixpanelUser } from "@/lib/mixpanelClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (roles?: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  hasRole: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getAuthToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    if (!authCookie) return null;
    const token = authCookie.split('=')[1].trim();
    return decodeURIComponent(token);
  };

  // Função para limpar estado e redirecionar
  const handleLogout = () => {
    setUser(null);
    setLoading(false);
    
    // Só redireciona se estiver em uma rota privada
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/dashboard')) {
      router.push('/sign-in');
    }
  };

  // Carregamento inicial do usuário
  useEffect(() => {
    async function loadUser() {
      try {
        const token = getAuthToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          handleLogout();
          return;
        }

        const userData = await response.json();
        setUser(userData);
        setMixpanelUser(userData);
      } catch (err) {
        console.error('AuthContext: Erro ao carregar dados do usuário:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Monitoramento contínuo do token
  useEffect(() => {
    if (loading) return; // Não monitora durante o carregamento inicial

    const checkToken = () => {
      const token = getAuthToken();
      
      // Se tinha usuário mas não tem mais token, faz logout
      if (user && !token) {
        console.log('AuthContext: Token removido, fazendo logout...');
        handleLogout();
      }
    };

    // Verifica a cada 2 segundos
    const interval = setInterval(checkToken, 2000);

    // Verifica quando o foco volta para a aba (detecta mudanças manuais)
    const handleFocus = () => {
      checkToken();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, loading]);

  const hasRole = (roles?: UserRole[]): boolean => {
    // Se não foram especificadas roles, qualquer usuário autenticado tem acesso
    if (!roles || roles.length === 0) {
      return !!user;
    }
    
    // Verifica se o usuário tem uma das roles necessárias
    return !!user && roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated: !!user,
      hasRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 