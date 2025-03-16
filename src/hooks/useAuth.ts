"use client";

import { useEffect, useState } from 'react';

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

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
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
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      console.log('data', data);
      document.cookie = `auth_token=${data.access_token}; path=/`;
      await fetchUserData();
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('useAuth: Erro ao fazer login:', err);
      throw new Error('Falha ao fazer login');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const getAuthToken = (): string | null => {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    console.log('authCookie', authCookie);
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