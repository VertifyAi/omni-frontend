# Sistema de Billing - Integração Frontend

Esta documentação descreve a implementação completa do sistema de billing integrado com Stripe para o frontend da aplicação.

## 📋 Visão Geral

O sistema implementado inclui:

- ✅ Context de billing com estado global
- ✅ Página de pricing com 3 planos (Essencial, Profissional, Empresarial)
- ✅ Verificação automática de limites
- ✅ Modais de upgrade quando limites são atingidos
- ✅ Integração com Stripe Checkout e Customer Portal
- ✅ Componentes de status de billing
- ✅ Páginas de sucesso/erro
- ✅ Hooks para verificação de limites

## 🏗️ Estrutura dos Arquivos

```
src/
├── contexts/
│   └── BillingContext.tsx          # Context principal de billing
├── components/
│   ├── BillingStatusCard.tsx       # Card de status de assinatura
│   └── LimitReachedModal.tsx       # Modal quando limite é atingido
├── hooks/
│   └── useLimitCheck.tsx           # Hook para verificação de limites
├── app/
│   ├── pricing/
│   │   └── page.tsx                # Página de planos
│   └── billing/
│       └── success/
│           └── page.tsx            # Página de sucesso do pagamento
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione no seu `.env.local`:

```env
NEXT_PUBLIC_STRIPE_ESSENCIAL_PRICE_ID=price_xxxxx
NEXT_PUBLIC_STRIPE_PROFISSIONAL_PRICE_ID=price_xxxxx  
NEXT_PUBLIC_STRIPE_EMPRESARIAL_PRICE_ID=price_xxxxx
```

### 2. Integração no Layout

O `BillingProvider` já está integrado no layout do dashboard:

```tsx
// src/app/dashboard/layout.tsx
<AuthProvider>
  <BillingProvider>
    {/* Conteúdo do dashboard */}
  </BillingProvider>
</AuthProvider>
```

## 📊 Planos Disponíveis

### Essencial (R$ 29/mês)
- 1 canal de atendimento
- 1 agente de IA
- 300 atendimentos/mês

### Profissional (R$ 79/mês) - **Mais Popular**
- Canais ilimitados
- 2 agentes de IA
- 1.000 atendimentos/mês

### Empresarial (R$ 199/mês)
- Canais ilimitados
- Agentes ilimitados
- Atendimentos customizáveis (padrão: 5.000)

## 🎣 Como Usar os Hooks

### useBilling() - Context Principal

```tsx
import { useBilling } from '@/contexts/BillingContext';

function MeuComponente() {
  const { 
    usageStats,
    hasActiveSubscription,
    canCreateChannel,
    canCreateAIAgent,
    canProcessAttendance,
    createCheckoutSession,
    createPortalSession,
    plans
  } = useBilling();

  // Verificar se pode criar um canal
  if (!canCreateChannel) {
    // Mostrar modal de upgrade
  }
}
```

### useLimitCheck() - Verificação com Modal Automático

```tsx
import { useLimitCheck } from '@/hooks/useLimitCheck';

function CriarAgente() {
  const { checkLimit, LimitModal } = useLimitCheck();

  const handleCreateAgent = () => {
    // Verifica limite e executa ação se permitido
    checkLimit('aiAgents', () => {
      // Ação para criar agente
      router.push('/dashboard/agents/create');
    });
  };

  return (
    <div>
      <Button onClick={handleCreateAgent}>
        Criar Agente
      </Button>
      
      {/* Modal aparece automaticamente quando limite atingido */}
      {LimitModal}
    </div>
  );
}
```

### useCanPerformAction() - Verificações Simples

```tsx
import { useCanPerformAction } from '@/hooks/useLimitCheck';

function MeuComponente() {
  const { 
    canCreateChannel,
    canCreateAIAgent,
    canProcessAttendance,
    hasActiveSubscription 
  } = useCanPerformAction();

  return (
    <Button disabled={!canCreateChannel}>
      Criar Canal
    </Button>
  );
}
```

## 🎨 Componentes Prontos

### BillingStatusCard

```tsx
import { BillingStatusCard } from '@/components/BillingStatusCard';

// Versão completa
<BillingStatusCard />

// Versão compacta
<BillingStatusCard compact={true} />

// Sem botão de upgrade
<BillingStatusCard showUpgradeButton={false} />
```

### LimitReachedModal

```tsx
import { LimitReachedModal } from '@/components/LimitReachedModal';

<LimitReachedModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  limitType="aiAgents" // 'channels' | 'aiAgents' | 'monthlyAttendances'
  title="Limite Custom" // opcional
  description="Descrição custom" // opcional
/>
```

## 🔄 Fluxo de Pagamento

### 1. Usuário Clica "Escolher Plano"

```tsx
const handleSelectPlan = async (priceId: string) => {
  try {
    const checkoutUrl = await createCheckoutSession(priceId, companyId);
    window.location.href = checkoutUrl; // Redireciona para Stripe
  } catch (error) {
    toast.error('Erro ao processar pagamento');
  }
};
```

### 2. Stripe Processa Pagamento

O usuário é redirecionado para `checkout.stripe.com` e completa o pagamento.

### 3. Redirecionamento de Sucesso

Após pagamento bem-sucedido, Stripe redireciona para:
```
/billing/success?session_id=cs_xxxxx
```

### 4. Atualização de Dados

A página de sucesso automaticamente recarrega os dados de billing via webhook.

## 🛡️ Verificação de Limites em Ações

### Exemplo: Criar Canal

```tsx
// ❌ Sem verificação
const createChannel = async () => {
  await fetchApi('/api/channels', { method: 'POST', ... });
};

// ✅ Com verificação
const createChannel = async () => {
  const canCreate = checkLimit('channels', async () => {
    await fetchApi('/api/channels', { method: 'POST', ... });
    toast.success('Canal criado com sucesso!');
  });
  
  if (!canCreate) {
    // Modal de upgrade é mostrado automaticamente
    return;
  }
};
```

### Exemplo: Processar Atendimento

```tsx
const processAttendance = async () => {
  if (!canProcessAttendance) {
    showLimitModal('monthlyAttendances', 
      'Limite de Atendimentos Atingido',
      'Você atingiu o limite mensal do seu plano.'
    );
    return;
  }
  
  // Prosseguir com atendimento
  await processTicket();
};
```

## 📈 Interface de Dados

### UsageStats

```typescript
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
```

### Plan

```typescript
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  limits: {
    channels: number | -1; // -1 = ilimitado
    aiAgents: number | -1;
    monthlyAttendances: number;
  };
  priceId: string;
  productId: string;
  popular?: boolean;
}
```

## 🔗 Endpoints da API

### Criar Sessão de Checkout
```
POST /billing/create-checkout-session
Body: { priceId, companyId, monthlyAttendanceLimit? }
Response: { url }
```

### Portal do Cliente
```
POST /billing/create-portal-session
Response: { url }
```

### Estatísticas de Uso
```
GET /billing/usage-stats
Response: UsageStats
```

### Dados da Assinatura
```
GET /billing/subscription
Response: Subscription
```

## 🎯 Boas Práticas

### 1. Sempre Verificar Limites

```tsx
// ✅ Bom
const { checkLimit } = useLimitCheck();
const handleAction = () => checkLimit('channels', executeAction);

// ❌ Ruim
const handleAction = () => executeAction();
```

### 2. Feedback Visual

```tsx
const { canCreateChannel } = useCanPerformAction();

return (
  <Button disabled={!canCreateChannel}>
    {canCreateChannel ? 'Criar Canal' : 'Limite Atingido'}
  </Button>
);
```

### 3. Estados de Loading

```tsx
const { loading } = useBilling();

if (loading) {
  return <BillingStatusSkeleton />;
}
```

### 4. Tratamento de Erros

```tsx
try {
  await createCheckoutSession(priceId, companyId);
} catch (error) {
  toast.error('Erro ao processar pagamento. Tente novamente.');
}
```

## 🚀 Exemplo de Integração Completa

Aqui está um exemplo completo de como integrar o sistema de billing em uma página:

```tsx
"use client";

import { useBilling } from '@/contexts/BillingContext';
import { useLimitCheck } from '@/hooks/useLimitCheck';
import { BillingStatusCard } from '@/components/BillingStatusCard';

export default function MinhaPage() {
  const { hasActiveSubscription, usageStats } = useBilling();
  const { checkLimit, LimitModal } = useLimitCheck();

  const handleCreateResource = () => {
    checkLimit('aiAgents', () => {
      // Lógica para criar recurso
      console.log('Criando recurso...');
    });
  };

  return (
    <div className="p-8">
      <div className="flex gap-6">
        <div className="flex-1">
          <h1>Minha Funcionalidade</h1>
          
          <Button 
            onClick={handleCreateResource}
            disabled={!hasActiveSubscription}
          >
            Criar Recurso
          </Button>
        </div>
        
        <div className="w-80">
          <BillingStatusCard />
        </div>
      </div>
      
      {/* Modal aparece automaticamente */}
      {LimitModal}
    </div>
  );
}
```

## 🔮 Próximos Passos

Para expandir o sistema, considere:

1. **Webhooks de Billing**: Implementar listeners para eventos do Stripe
2. **Métricas Avançadas**: Dashboards de uso por período
3. **Alertas Proativos**: Notificações quando próximo do limite
4. **Planos Customizados**: Interface para criar planos específicos
5. **Trial Automático**: Sistema de trial gratuito
6. **Descontos e Cupons**: Integração com promoções

---

## 📞 Suporte

Para dúvidas sobre a implementação:
- Consulte os comentários no código
- Verifique os console.logs em desenvolvimento
- Teste o fluxo completo em ambiente de desenvolvimento

O sistema está pronto para produção e integrado com todas as melhores práticas de UX e segurança! 🎉 