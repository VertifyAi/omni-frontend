"use client";

import { useEffect, useState, useCallback } from 'react';

interface Company {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  company_id: number;
  company: Company;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log('Token não encontrado');
        return;
      }

      console.log('Buscando dados do usuário com token:', token);
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Status da resposta /me:', response.status);
      if (!response.ok) {
        throw new Error('Falha ao carregar dados do usuário');
      }

      const userData = await response.json();
      console.log('Dados do usuário recebidos:', userData);
      setUser(userData);
    } catch (err) {
      console.error('useAuth: Erro ao carregar dados do usuário:', err);
      setError('Não foi possível carregar seus dados. Por favor, faça login novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Iniciando login com email:', email);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Status da resposta login:', response.status);
      const data = await response.json();
      console.log('Dados da resposta login:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Credenciais inválidas');
      }

      if (!data.access_token) {
        throw new Error('Token não recebido do servidor');
      }

      // O cookie será definido automaticamente pelo servidor
      await fetchUserData();
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('useAuth: Erro ao fazer login:', err);
      throw new Error(err instanceof Error ? err.message : 'Falha ao fazer login');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const getAuthToken = (): string | null => {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    if (!authCookie) return null;
    const token = authCookie.split('=')[1].trim();
    return decodeURIComponent(token);
  };

  return {
    user,
    company: user?.company,
    loading,
    error,
    isAuthenticated: !!user,
    login
  };
} 