"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBilling } from "@/contexts/BillingContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CheckCircle, 
  Zap, 
  Star, 
  ArrowRight, 
  Loader2, 
  TrendingUp,
  Clock,
  Shield,
  Target,
  BarChart3,
  Headphones,
  Rocket
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { plans, usageStats, hasActiveSubscription, createCheckoutSession, loading } = useBilling();
  const { user, isAuthenticated } = useAuth();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectPlan = async (priceId: string, planId: string) => {
    if (!isAuthenticated || !user) {
      router.push('/sign-in');
      return;
    }

    setProcessingPlan(planId);
    
    try {
      const isEnterprise = planId === 'empresarial';
      const companyId = user.companyId || 1;
      
      const checkoutUrl = await createCheckoutSession(
        priceId, 
        companyId,
        isEnterprise ? 10000 : undefined
      );
      
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    if (!usageStats || !isAuthenticated) return false;
    return usageStats.planType.toLowerCase() === planId.toLowerCase();
  };

  const getButtonText = (planId: string) => {
    if (!isAuthenticated) {
      return 'Começar Agora';
    }
    if (isCurrentPlan(planId)) {
      return 'Plano Atual';
    }
    if (hasActiveSubscription) {
      return 'Fazer Upgrade';
    }
    return 'Começar Agora';
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? 'Ilimitado' : limit.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando ofertas exclusivas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white-pure to-white-soft">
      {/* ATTENTION - Hero Section com Impacto */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Urgência */}
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mb-6">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              🔥 Oferta Limitada: 30 dias grátis + 50% OFF no primeiro mês
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Aumente Suas Vendas em
            <span className="text-green-600"> 300%</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            <strong>Mais de 10.000 empresas</strong> já automatizaram seu atendimento e <strong>triplicaram suas conversões</strong> 
            com nossa IA. Você será o próximo?
          </p>

          {/* Social Proof com Estatísticas */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">300%</div>
              <div className="text-sm text-muted-foreground">Aumento médio em vendas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Atendimento automatizado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-sm text-muted-foreground">Redução em custos</div>
            </div>
          </div>
        </div>
      </section>

      {/* INTEREST - Problemas e Soluções */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pare de Perder <span className="text-red-600">R$ 50.000+</span> Todo Mês
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Enquanto você lê isso, seus concorrentes estão roubando clientes que tentam falar com você 
              fora do horário comercial. Nossa IA nunca dorme.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Problemas */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-red-600">❌ Sem Nossa Solução:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <div className="font-medium text-red-800">78% dos leads se perdem</div>
                    <div className="text-sm text-red-600">Clientes desistem ao não ter resposta imediata</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <div className="font-medium text-red-800">Custos de equipe explodem</div>
                    <div className="text-sm text-red-600">R$ 8.000+ por funcionário + benefícios</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <div className="font-medium text-red-800">Atendimento inconsistente</div>
                    <div className="text-sm text-red-600">Diferentes respostas = clientes confusos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Soluções */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-green-600">✅ Com Nossa IA:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-green-800">95% dos leads convertidos</div>
                    <div className="text-sm text-green-600">Resposta em menos de 3 segundos, 24/7</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-green-800">Economia de 85% em custos</div>
                    <div className="text-sm text-green-600">Uma IA substitui 10 atendentes</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-green-800">Atendimento perfeito sempre</div>
                    <div className="text-sm text-green-600">Mesma qualidade, zero variação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESIRE - Planos com Muito Valor e Social Proof */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header com Social Proof */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 bg-gradient-to-r from-[#E97939] to-[#8A39DB] rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">+10.000 empresas confiam</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Escolha Seu <span className="text-transparent bg-gradient-to-r from-[#E97939] to-[#8A39DB] bg-clip-text">Crescimento</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Todos os planos incluem <strong>30 dias grátis</strong> + suporte premium + garantia de resultado ou seu dinheiro de volta
            </p>

            {hasActiveSubscription && usageStats && (
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-bold text-green-800">🎉 Parabéns! Você já está economizando milhares!</span>
                </div>
                <p className="text-green-700">
                  Plano <strong className="capitalize">{usageStats.planType}</strong> ativo • 
                  Próxima cobrança em {usageStats.daysUntilReset} dias
                </p>
              </div>
            )}
          </div>

          {/* Plans Grid com Mais Persuasão */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`relative flex flex-col transition-all duration-500 hover:scale-105 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-[#E97939] to-[#8A39DB] p-[3px] border-0 shadow-2xl' 
                    : 'elevated-1 hover:elevated-2 hover:border-primary/30'
                }`}
              >
                {plan.popular && (
                  <>
                    <div className="bg-gradient-to-r from-[#E97939] to-[#8A39DB] p-[2px] rounded-xl w-40 absolute top-[-16px] left-1/2 transform -translate-x-1/2">
                      <div className="bg-white rounded-xl py-2 px-4 text-center">
                        <span className="text-sm font-bold text-transparent bg-gradient-to-r from-[#E97939] to-[#8A39DB] bg-clip-text">
                          ⭐ MAIS ESCOLHIDO
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      50% OFF
                    </div>
                  </>
                )}

                {index === 0 && (
                  <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    INICIANTE
                  </div>
                )}

                {index === 2 && (
                  <div className="absolute top-4 right-4 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    PREMIUM
                  </div>
                )}
                
                <div className={`flex-1 flex flex-col ${plan.popular ? 'bg-white-pure rounded-xl' : ''}`}>
                  <CardHeader className="text-center pb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      {isCurrentPlan(plan.id) && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 animate-pulse">
                          Ativo
                        </Badge>
                      )}
                    </div>
                    
                    <CardDescription className="text-base mb-4">{plan.description}</CardDescription>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-2xl text-muted-foreground line-through">R$ {plan.monthlyPrice * 2}</span>
                        <span className="text-5xl font-bold text-transparent bg-gradient-to-r from-[#E97939] to-[#8A39DB] bg-clip-text">
                          R$ {plan.monthlyPrice}
                        </span>
                      </div>
                      <div className="text-muted-foreground">/mês • Primeiro mês 50% OFF</div>
                      <div className="text-xs text-green-600 font-medium mt-1">+ 30 dias grátis para testar</div>
                    </div>

                    {/* ROI Calculator */}
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-800">💰 Retorno do Investimento:</div>
                      <div className="text-xs text-green-600">
                        Economia mensal: <strong>R$ {(plan.monthlyPrice * 10).toLocaleString()}</strong>
                      </div>
                      <div className="text-xs text-green-600">
                        ROI: <strong>{Math.round(plan.monthlyPrice * 10 / plan.monthlyPrice)}x</strong> em 30 dias
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <Separator className="mb-6" />
                    
                    {/* Enhanced Limits Summary */}
                    <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{formatLimit(plan.limits.channels)}</div>
                        <div className="text-xs text-muted-foreground">Canais</div>
                        {plan.limits.channels === -1 && <div className="text-xs text-green-600 font-medium">WhatsApp + Instagram + Site</div>}
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{formatLimit(plan.limits.aiAgents)}</div>
                        <div className="text-xs text-muted-foreground">Agentes IA</div>
                        {plan.limits.aiAgents === -1 && <div className="text-xs text-green-600 font-medium">Vendas + Suporte + Custom</div>}
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{plan.limits.monthlyAttendances.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Atendimentos</div>
                        <div className="text-xs text-green-600 font-medium">por mês</div>
                      </div>
                    </div>
                    
                    {/* Enhanced Features List */}
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="size-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium">{feature}</span>
                        </li>
                      ))}
                      
                      {/* Bonus Features */}
                      {plan.popular && (
                        <>
                          <li className="flex items-start gap-3">
                            <Star className="size-5 text-yellow-500 mt-0.5 shrink-0" />
                            <span className="text-sm font-medium text-yellow-700">🎁 BÔNUS: Setup gratuito (R$ 500)</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Star className="size-5 text-yellow-500 mt-0.5 shrink-0" />
                            <span className="text-sm font-medium text-yellow-700">🎁 BÔNUS: Treinamento da equipe</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                  
                  <CardFooter className="pt-6">
                    <div className="w-full space-y-3">
                      <Button
                        onClick={() => {
                          if (!isAuthenticated) {
                            router.push('/sign-in');
                            return;
                          }
                          handleSelectPlan(plan.monthlyPriceId, plan.id);
                        }}
                        disabled={isCurrentPlan(plan.id) || processingPlan === plan.id || (!plan.monthlyPriceId && isAuthenticated)}
                        className={`w-full font-bold text-lg py-6 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-[#E97939] to-[#8A39DB] hover:opacity-90 shadow-lg hover:shadow-xl' 
                            : 'hover:shadow-lg'
                        }`}
                        size="lg"
                      >
                        {processingPlan === plan.id ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="size-5 animate-spin" />
                            Processando...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Rocket className="size-5" />
                            {getButtonText(plan.id)}
                            {!isCurrentPlan(plan.id) && <ArrowRight className="size-5" />}
                          </div>
                        )}
                      </Button>
                      
                      {!isCurrentPlan(plan.id) && (
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">✅ Sem compromisso • ✅ Cancele quando quiser</div>
                          <div className="text-xs text-green-600 font-medium">🔒 Garantia de 30 dias ou seu dinheiro de volta</div>
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>

          {/* Usage Stats Enhanced (if user has active subscription) */}
          {hasActiveSubscription && usageStats && (
            <Card className="max-w-5xl mx-auto elevated-2 bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <BarChart3 className="size-6 text-primary" />
                  Seu Desempenho Atual - {usageStats.planType}
                </CardTitle>
                <CardDescription className="text-lg">
                  Veja como você está <strong>economizando e ganhando mais</strong> com nossa IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {usageStats.usage.channels.current}
                      {!usageStats.usage.channels.isUnlimited && ` / ${usageStats.usage.channels.limit}`}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">Canais Conectados</div>
                    <div className="text-sm text-green-600 font-medium">
                      Economia: R$ {(usageStats.usage.channels.current * 2000).toLocaleString()}/mês
                    </div>
                    {!usageStats.usage.channels.isUnlimited && (
                      <div className="w-full bg-muted rounded-full h-3 mt-3">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${Math.min((usageStats.usage.channels.current / usageStats.usage.channels.limit) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {usageStats.usage.aiAgents.current}
                      {!usageStats.usage.aiAgents.isUnlimited && ` / ${usageStats.usage.aiAgents.limit}`}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">Agentes de IA Ativos</div>
                    <div className="text-sm text-green-600 font-medium">
                      Substituindo {usageStats.usage.aiAgents.current * 3} funcionários
                    </div>
                    {!usageStats.usage.aiAgents.isUnlimited && (
                      <div className="w-full bg-muted rounded-full h-3 mt-3">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${Math.min((usageStats.usage.aiAgents.current / usageStats.usage.aiAgents.limit) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {usageStats.usage.monthlyAttendances.current.toLocaleString()}
                      {!usageStats.usage.monthlyAttendances.isUnlimited && 
                        ` / ${usageStats.usage.monthlyAttendances.limit.toLocaleString()}`
                      }
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">Atendimentos Este Mês</div>
                    <div className="text-sm text-green-600 font-medium">
                      Receita gerada: R$ {(usageStats.usage.monthlyAttendances.current * 150).toLocaleString()}
                    </div>
                    {!usageStats.usage.monthlyAttendances.isUnlimited && (
                      <div className="w-full bg-muted rounded-full h-3 mt-3">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${Math.min((usageStats.usage.monthlyAttendances.current / usageStats.usage.monthlyAttendances.limit) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl">
                  <div className="text-lg font-bold text-green-800 mb-2">
                    🎉 Você já economizou R$ {((usageStats.usage.channels.current * 2000) + (usageStats.usage.aiAgents.current * 8000)).toLocaleString()} este mês!
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Próxima renovação em {usageStats.daysUntilReset} dias • 
                    Período atual até {new Date(usageStats.currentPeriodEnd).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* ACTION - Seção Final de Conversão */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#E97939] to-[#8A39DB] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Não Deixe Seus Concorrentes 
            <br />Te Passarem Para Trás
          </h2>
          
          <p className="text-xl mb-8 opacity-90">
            <strong>Mais de 50 empresas</strong> se inscreveram hoje. 
            Cada dia que você espera, é dinheiro perdido.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Garantias */}
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Garantia Total</h3>
              <p className="opacity-90">30 dias para testar. Se não triplicar suas vendas, devolvemos 100% do seu dinheiro.</p>
            </div>
            
            {/* Urgência */}
            <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Oferta Limitada</h3>
              <p className="opacity-90">50% OFF + 30 dias grátis válido apenas até o final do mês. Depois volta ao preço normal.</p>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => !isAuthenticated ? router.push('/sign-in') : router.push('#planos')}
              size="lg" 
              className="bg-white text-[#E97939] hover:bg-white/90 px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              🚀 QUERO TRIPLICAR MINHAS VENDAS AGORA
            </Button>
            
            <div className="text-sm opacity-80">
              ✅ Sem compromisso • ✅ Setup em 24h • ✅ Suporte premium incluído
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof Final */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">O Que Nossos Clientes Dizem</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Carlos Silva",
                company: "E-commerce Fashion",
                text: "Em 30 dias, nossas vendas aumentaram 280%. A IA atende melhor que nossos melhores vendedores!",
                revenue: "+R$ 45.000/mês"
              },
              {
                name: "Maria Santos",
                company: "Clínica Odontológica",
                text: "Reduzimos 90% das ligações perdidas. Agora não perdemos mais nenhum paciente, mesmo de madrugada.",
                revenue: "+150 pacientes/mês"
              },
              {
                name: "João Oliveira",
                company: "Imobiliária Premium",
                text: "A IA qualifica os leads automaticamente. Nossa equipe só fala com quem realmente quer comprar.",
                revenue: "+R$ 120.000/mês"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6 elevated-1 hover:elevated-2 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center gap-2 mb-4">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">{testimonial.revenue}</div>
                      <div className="text-xs text-muted-foreground">resultado</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Todos os planos incluem - Agora mais persuasivo */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tudo Que Você Precisa Para <span className="text-transparent bg-gradient-to-r from-[#E97939] to-[#8A39DB] bg-clip-text">Dominar Seu Mercado</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Headphones className="size-8 text-primary" />,
                title: "Suporte VIP 24/7",
                description: "Nossa equipe te ajuda sempre que precisar"
              },
              {
                icon: <Zap className="size-8 text-primary" />,
                title: "IA Mais Avançada",
                description: "Tecnologia que aprende e melhora sozinha"
              },
              {
                icon: <Target className="size-8 text-primary" />,
                title: "Setup Personalizado",
                description: "Configuramos tudo específico para seu negócio"
              },
              {
                icon: <TrendingUp className="size-8 text-primary" />,
                title: "Garantia de Resultado",
                description: "Se não aumentar suas vendas, devolvemos o dinheiro"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mx-auto mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 