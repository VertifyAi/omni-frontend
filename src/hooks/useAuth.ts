"use client";

import { fetchApi } from '@/lib/fetchApi';
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

  const me = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar dados do usuário');
      }

      const userData = await response.json();
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
      const response = await fetchApi('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciais inválidas');
      }

      if (!data.access_token) {
        throw new Error('Token não recebido do servidor');
      }

      document.cookie = `auth_token=${data.access_token}; path=/; max-age=3600; secure; samesite=strict`;
      await me();
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('useAuth: Erro ao fazer login:', err);
      throw new Error(err instanceof Error ? err.message : 'Falha ao fazer login');
    }
  };

  useEffect(() => {
    me();
  }, [me]);

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