"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchApi } from '@/lib/fetchApi';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface UsageStats {
  planType: string;
  subscriptionStatus: 'active' | 'inactive' | 'trialing' | 'past_due';
  currentPeriodEnd: string;
  usage: {
    channels: { current: number; limit: number; isUnlimited: boolean };
    aiAgents: { current: number; limit: number; isUnlimited: boolean };
    monthlyAttendances: { current: number; limit: number; isUnlimited: boolean };
  };
  daysUntilReset: number;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    channels: number | -1;
    aiAgents: number | -1;
    monthlyAttendances: number;
  };
  monthlyPriceId: string;
  yearlyPriceId: string;
  productId: string;
  popular?: boolean;
  badge?: string;
  savings?: string;
  roi?: string;
}

interface Subscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  plan: {
    id: string;
    name: string;
    amount: number;
  };
}

interface BillingContextType {
  usageStats: UsageStats | null;
  subscription: Subscription | null;
  plans: Plan[];
  loading: boolean;
  error: string | null;
  fetchUsageStats: () => Promise<void>;
  fetchSubscription: () => Promise<void>;
  createCheckoutSession: (priceId: string, companyId: number, monthlyAttendanceLimit?: number) => Promise<string>;
  createPortalSession: () => Promise<string>;
  hasActiveSubscription: boolean;
  canCreateChannel: boolean;
  canCreateAIAgent: boolean;
  canProcessAttendance: boolean;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

const PLANS: Plan[] = [
  {
    id: 'essencial',
    name: 'Essencial',
    description: 'Perfeito para começar a automatizar e ver primeiros resultados',
    monthlyPrice: 170,
    yearlyPrice: 120,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_ESSENCIAL_MONTHLY_PRICE_ID || '',
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_ESSENCIAL_YEARLY_PRICE_ID || '',
    productId: 'prod_S4pWVf0oiJPawZ',
    badge: '🚀 INICIANTES',
    savings: 'Economize R$600/ano',
    // roi: 'ROI médio: 425%',
    features: [
      '1 Canal de atendimento',
      '1 Agente de IA especialista',
      'Até 300 atendimentos/mês',
      'Relatórios de performance',
      'Suporte 24/7',
      'Treinamento incluído'
    ],
    limits: {
      channels: 1,
      aiAgents: 1,
      monthlyAttendances: 300
    }
  },
  {
    id: 'profissional',
    name: 'Profissional',
    description: 'O plano mais escolhido por empresas em crescimento',
    monthlyPrice: 360,
    yearlyPrice: 250,
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PROFISSIONAL_MONTHLY_PRICE_ID || '',
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PROFISSIONAL_YEARLY_PRICE_ID || '',
    productId: 'prod_SFLn7s9TgvayWC',
    popular: true,
    badge: '⭐ MAIS POPULAR',
    savings: 'Economize R$1.320/ano',
    // roi: 'ROI médio: 890%',
    features: [
      'Canais ilimitados',
      '2 Agentes de IA especializados',
      'Até 1.000 atendimentos/mês',
      'Relatórios de ROI em tempo real',
      'Suporte VIP 24/7',
      '🎁 Setup personalizado gratuito'
    ],
    limits: {
      channels: -1,
      aiAgents: 2,
      monthlyAttendances: 1000
    }
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    description: 'Solução completa para empresas que querem escalar sem limites',
    monthlyPrice: 500, // Preço base
    yearlyPrice: 400, // Preço base
    monthlyPriceId: '', // Será definido dinamicamente
    yearlyPriceId: '', // Será definido dinamicamente
    productId: 'prod_EMPRESARIAL_ID',
    badge: '💎 ENTERPRISE',
    savings: 'Economia personalizada',
    // roi: 'ROI médio: 1.200%+',
    features: [
      'Canais ilimitados',
      'Agentes de IA ilimitados',
      'Atendimentos ilimitados',
      'Analytics avançados',
      'Account Manager dedicado',
      '🎁 Onboarding completo gratuito'
    ],
    limits: {
      channels: -1,
      aiAgents: -1,
      monthlyAttendances: 5000 // Padrão, pode ser customizado
    }
  }
];

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchUsageStats = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    
    try {
      const response = await fetchApi('/api/billing/usage-stats');
      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas de uso');
      }
      const data = await response.json();
      setUsageStats(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar usage stats:', err);
    }
  }, [isAuthenticated]);

  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    
    try {
      const response = await fetchApi('/api/billing/subscription');
      if (!response.ok) {
        throw new Error('Erro ao carregar dados da assinatura');
      }
      const data = await response.json();
      setSubscription(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar subscription:', err);
    }
  }, [isAuthenticated]);

  const createCheckoutSession = async (
    priceId: string, 
    companyId: number, 
    monthlyAttendanceLimit?: number
  ): Promise<string> => {
    try {
      const body: Record<string, unknown> = { priceId, companyId };
      if (monthlyAttendanceLimit) {
        body.monthlyAttendanceLimit = monthlyAttendanceLimit;
      }

      const response = await fetchApi('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar sessão de checkout');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar pagamento';
      toast.error(errorMessage);
      throw err;
    }
  };

  const createPortalSession = async (): Promise<string> => {
    try {
      const response = await fetchApi('/billing/create-portal-session', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao acessar portal de billing');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao acessar portal';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    const loadBillingData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await Promise.all([fetchUsageStats(), fetchSubscription()]);
      } catch (err) {
        console.error('Erro ao carregar dados de billing:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBillingData();
  }, [fetchSubscription, fetchUsageStats]);

  // Computed values
  const hasActiveSubscription = usageStats?.subscriptionStatus === 'active' || 
                                usageStats?.subscriptionStatus === 'trialing';

  const canCreateChannel = usageStats?.usage.channels.isUnlimited || 
                          (usageStats?.usage.channels.current || 0) < (usageStats?.usage.channels.limit || 0);

  const canCreateAIAgent = usageStats?.usage.aiAgents.isUnlimited || 
                          (usageStats?.usage.aiAgents.current || 0) < (usageStats?.usage.aiAgents.limit || 0);

  const canProcessAttendance = usageStats?.usage.monthlyAttendances.isUnlimited || 
                              (usageStats?.usage.monthlyAttendances.current || 0) < (usageStats?.usage.monthlyAttendances.limit || 0);

  return (
    <BillingContext.Provider
      value={{
        usageStats,
        subscription,
        plans: PLANS,
        loading,
        error,
        fetchUsageStats,
        fetchSubscription,
        createCheckoutSession,
        createPortalSession,
        hasActiveSubscription,
        canCreateChannel,
        canCreateAIAgent,
        canProcessAttendance,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
} 