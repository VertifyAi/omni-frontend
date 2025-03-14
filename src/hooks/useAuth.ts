import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: number;
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const logout = useCallback(() => {
    Cookies.remove('auth_token');
    setUser(null);
    router.push('/sign-in');
  }, [router]);

  const checkAuth = useCallback(async () => {
    try {
      const token = Cookies.get('auth_token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token inválido');
      }

      setUser(data);
    } catch (error) {
      console.error('Erro de autenticação:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    setMounted(true);
    const token = Cookies.get('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha no login');
      }

      const { access_token, user: userData } = data;
      
      if (!access_token) {
        throw new Error('Token não recebido do servidor');
      }

      Cookies.set('auth_token', access_token, { expires: 7 });
      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  if (!mounted) {
    return {
      user: null,
      loading: true,
      login,
      logout,
      isAuthenticated: false,
    };
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
} 