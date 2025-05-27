"use client";

import { User, UserRole } from "@/types/users";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
          setLoading(false);
          return;
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error('AuthContext: Erro ao carregar dados do usuário:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const getAuthToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    if (!authCookie) return null;
    const token = authCookie.split('=')[1].trim();
    return decodeURIComponent(token);
  };

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