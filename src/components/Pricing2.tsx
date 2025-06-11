"use client";

import { ArrowRight, CircleCheck, TrendingUp, Clock, Users, Star, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useBilling } from "@/contexts/BillingContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PricingFeature {
  text: string;
  highlight?: boolean;
}

interface PlanData {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  badge?: string;
  savings?: string;
  roi?: string;
  features: string[];
}

interface Pricing2Props {
  heading?: string;
  description?: string;
}

const Pricing2 = ({
<<<<<<< HEAD
  heading = "Conheça nossos planos",
  description = "Escolha o plano que melhor se encaixa nas suas necessidades",
  plans = [
    {
      id: "professional",
      name: "Profissional",
      description: "Feito para escalar suas vendas.",
      monthlyPrice: "R$360",
      yearlyPrice: "R$250",
      main: true,
      features: [
        { text: "Canais ilimitados" },
        { text: "2 Agentes de IA" },
        { text: "Até 1000 tickets/mês" },
        { text: "Relatórios detalhados" },
        { text: "Suporte 24/7" },
      ],
      monthlyButton: {
        text: "Testar grátis por 30 dias",
        url: "https://buy.stripe.com/9AQdRTcL14jz9fW7sv",
      },
      yearlyButton: {
        text: "Testar grátis por 30 dias",
        url: "https://buy.stripe.com/eVa01326naHX3VC5km",
      },
    },
    {
      id: "essential",
      name: "Essencial",
      description: "Ideal para começar com automação.",
      monthlyPrice: "R$170",
      yearlyPrice: "R$120",
      features: [
        { text: "1 Canal de atendimento" },
        { text: "1 Agente de IA" },
        { text: "Até 300 tickets/mês" },
        { text: "Relatórios básicos" },
        { text: "Suporte 24/7" },
      ],
      monthlyButton: {
        text: "Testar grátis por 30 dias",
        url: "https://buy.stripe.com/00gbJL6mD4jz63K7st",
      },
      yearlyButton: {
        text: "Testar grátis por 30 dias",
        url: "https://buy.stripe.com/3cseVXcL1g2h3VCbII",
      },
    },
    {
      id: "enterprise",
      name: "Empresarial",
      description: "Soluções sob medida para empresas.",
      monthlyPrice: "A combinar",
      yearlyPrice: "A combinar",
      features: [
        { text: "Canais ilimitados" },
        { text: "Agentes de IA ilimitados" },
        { text: "Tickets ilimitados" },
        { text: "Relatórios detalhados" },
        { text: "Suporte 24/7" },
      ],
      monthlyButton: {
        text: "Fale com especialista",
        url: "https://forms.gle/FsLDDF5dWTSSVZGfA",
      },
      yearlyButton: {
        text: "Fale com especialista",
        url: "https://forms.gle/FsLDDF5dWTSSVZGfA",
      },
    },
  ],
=======
  heading = "Invista no Seu Crescimento. Veja o Retorno em 30 Dias.",
  description = "Com a nossa IA, suas vendas estão prestes a decolar. Qual será o impacto no seu negócio?",
>>>>>>> 61d60be (feat: :rocket:)
}: Pricing2Props) => {
  const [isYearly, setIsYearly] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { plans } = useBilling();
  
  // Estado para controlar se estamos em um dispositivo móvel
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Verificar o tamanho da tela quando o componente montar
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px é o breakpoint 'md' no Tailwind
    };
    
    // Verificar tamanho inicial
    checkIfMobile();
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkIfMobile);
    
    // Limpar listener ao desmontar
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Função para calcular economia anual
  const calculateYearlyDiscount = (monthlyPrice: number, yearlyPrice: number) => {
    const yearlyTotal = yearlyPrice * 12;
    const monthlyTotal = monthlyPrice * 12;
    return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
  };

  // Função para lidar com a mudança do switch
  const handleSwitchChange = () => {
    setIsAnimating(true);
    setIsYearly(!isYearly);
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Função para mapear features para o formato com highlight
  const mapFeatures = (features: string[]): PricingFeature[] => {
    const highlightKeywords = ['ilimitados', 'ilimitadas', '🎁', 'VIP', 'personalizado', 'gratuito', 'completo'];
    
    return features.map(feature => ({
      text: feature,
      highlight: highlightKeywords.some(keyword => feature.toLowerCase().includes(keyword.toLowerCase()))
    }));
  };

  // Função para gerar URL do plano
  const getPlanUrl = (plan: PlanData, isYearly: boolean): string => {
    if (plan.id === 'empresarial') {
      return "https://forms.gle/FsLDDF5dWTSSVZGfA"; // Formulário para plano customizado
    }
    
    // Para planos essencial e profissional, usar URLs hardcoded por enquanto
    const urls: Record<string, { monthly: string; yearly: string }> = {
      essencial: {
        // monthly: "https://buy.stripe.com/00gbJL6mD4jz63K7st",
        monthly: "/sign-up",
        yearly: "/sign-up",
        // yearly: "https://buy.stripe.com/3cseVXcL1g2h3VCbII"
      },
      profissional: {
        monthly: "/sign-up",
        yearly: "/sign-up",
        // monthly: "https://buy.stripe.com/9AQdRTcL14jz9fW7sv",
        // yearly: "https://buy.stripe.com/eVa01326naHX3VC5km"
      }
    };
    
    const planUrls = urls[plan.id];
    if (!planUrls) return "";
    
    return isYearly ? planUrls.yearly : planUrls.monthly;
  };

  // Função para gerar texto do botão
  const getButtonText = (plan: PlanData): string => {
    if (plan.id === 'empresarial') {
      return "Falar com Especialista";
    }
    return "Começar Teste de 30 Dias";
  };
  
  // Renderizar o conteúdo do card
  const renderPlanCard = (plan: PlanData) => {
    const discount = calculateYearlyDiscount(plan.monthlyPrice, plan.yearlyPrice);
    const features = mapFeatures(plan.features);
    const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const displayPrice = plan.id === 'empresarial' 
      ? `A combinar` 
      : `R$${currentPrice}`;
    
    if (plan.popular) {
      return (
        <div
          key={plan.id}
          className="bg-gradient-to-r from-[#E97939] to-[#8A39DB] p-[3px] rounded-2xl relative mt-6"
        >
          {/* Badge Popular */}
          <div className="bg-gradient-to-r from-[#E97939] to-[#8A39DB] p-[2px] rounded-xl w-36 absolute top-[-20px] left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white rounded-xl py-2 px-4 text-center">
              <span className="text-sm font-bold text-transparent bg-gradient-to-r from-[#E97939] to-[#8A39DB] bg-clip-text">
                {plan.badge}
              </span>
            </div>
          </div>
<<<<<<< HEAD
          <Card className="flex w-78 flex-col justify-between text-left bg-white-pure rounded-xl elevated-2">
            <CardHeader>
              <CardTitle>
                <p>{plan.name}</p>
=======

          {/* Badge de Desconto Anual */}
          {isYearly && plan.id !== 'empresarial' && (
            <div className="absolute top-6 right-6 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              -{discount}%
            </div>
          )}
          
          <Card className="flex w-96 flex-col text-left bg-white-pure rounded-2xl elevated-2 h-[600px] overflow-hidden">
            <CardHeader className="pt-5 pb-3 px-5 flex-shrink-0">
              <CardTitle className="flex items-center justify-between mb-2">
                <p className="text-xl font-bold">{plan.name}</p>
>>>>>>> 61d60be (feat: :rocket:)
              </CardTitle>
              <p className="text-sm text-muted-foreground leading-snug mb-3">
                {plan.description}
              </p>
              
              {/* Preço com animação */}
              <div className="space-y-2 mb-3">
                <div className="flex items-baseline gap-2">
                  <span className={`${plan.id === 'empresarial' ? 'text-2xl' : 'text-4xl'} font-bold text-transparent bg-gradient-to-r from-[#E97939] to-[#8A39DB] bg-clip-text transition-all duration-300 ${isAnimating ? 'scale-110 opacity-60' : 'scale-100 opacity-100'}`}>
                    {displayPrice}
                  </span>
                  {plan.id !== 'empresarial' && (
                    <span className="text-sm text-muted-foreground">/mês</span>
                  )}
                </div>

                {/* Economia anual */}
                <div className="flex items-center min-h-[20px]">
                  {isYearly && plan.savings && plan.id !== 'empresarial' ? (
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-2 py-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-800">{plan.savings}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground opacity-60">
                      {plan.id === 'empresarial' ? 'Plano personalizado' : 'Cobrança mensal'}
                    </div>
                  )}
                </div>

                {/* ROI Badge */}
                {plan.roi && (
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-2 py-1">
                    <TrendingUp className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">{plan.roi}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 px-5 py-0 overflow-hidden">
              <Separator className="mb-3" />
              <div className="h-full overflow-y-auto">
                <ul className="space-y-1.5 pb-2">
                  {features.map((feature, index) => (
                    <li key={index} className={`flex items-start gap-2 ${feature.highlight ? 'bg-green-50 p-2 rounded-md border border-green-200' : 'py-0.5'}`}>
                      <CircleCheck className={`size-4 mt-0.5 shrink-0 ${feature.highlight ? 'text-green-600' : 'text-primary'}`} />
                      <span className={`${feature.highlight ? 'font-medium text-green-800' : ''} leading-snug text-sm`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="pt-4 pb-5 px-5 flex-shrink-0">
              <div className="w-full space-y-2">
                <Button asChild className="w-full bg-gradient-to-r from-[#E97939] to-[#8A39DB] hover:from-[#E97939]/90 hover:to-[#8A39DB]/90 py-5 text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300">
                  <a
                    href={getPlanUrl(plan, isYearly)}
                    target="_blank"
                  >
                    {getButtonText(plan)}
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">✅ Sem cartão • ✅ Cancele quando quiser</div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      );
    } else {
      return (
        <Card
          key={plan.id}
<<<<<<< HEAD
          className="flex w-80 flex-col justify-between text-left bg-white-pure border-white-warm shadow-white-elevated hover:shadow-cool-teal transition-all duration-300"
=======
          className="flex w-80 flex-col text-left bg-white-pure border-white-warm shadow-white-elevated h-[600px] relative overflow-hidden"
>>>>>>> 61d60be (feat: :rocket:)
        >
          {/* Badge de Desconto Anual */}
          {isYearly && plan.id !== 'empresarial' && (
            <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              -{discount}%
            </div>
          )}

          <CardHeader className="pt-5 pb-3 px-5 flex-shrink-0">
            <CardTitle className="flex items-center justify-between mb-2">
              <p className="text-lg font-bold">{plan.name}</p>
              {plan.badge && (
                <div className="bg-blue-50 border border-blue-200 rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-blue-800">{plan.badge}</span>
                </div>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground mb-3 leading-snug">
              {plan.description}
            </p>
            
            {/* Preço com animação */}
            <div className="space-y-2 mb-3">
              <div className="flex items-baseline gap-2">
                <span className={`${plan.id === 'empresarial' ? 'text-xl' : 'text-3xl'} font-bold transition-all duration-300 ${isAnimating ? 'scale-110 opacity-60' : 'scale-100 opacity-100'}`}>
                  {displayPrice}
                </span>
                {plan.id !== 'empresarial' && (
                  <span className="text-sm text-muted-foreground">/mês</span>
                )}
              </div>

              {/* Economia anual */}
              <div className="flex items-center min-h-[20px]">
                {isYearly && plan.savings && plan.id !== 'empresarial' ? (
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-2 py-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-800">{plan.savings}</span>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground opacity-60">
                    {plan.id === 'empresarial' ? 'Plano personalizado' : `Cobrança ${isYearly ? 'anual' : 'mensal'}`}
                  </div>
                )}
              </div>

              {/* ROI Badge */}
              {plan.roi && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-2 py-1">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-800">{plan.roi}</span>
                </div>
              )}
            </div>
          </CardHeader>
<<<<<<< HEAD
          <CardContent>
            <Separator className="mb-6" />
            <ul className="space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CircleCheck className="size-4 text-primary" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
=======
          
          <CardContent className="flex-1 px-5 py-0 overflow-hidden">
            <Separator className="mb-3" />
            <div className="h-full overflow-y-auto">
              <ul className="space-y-1.5 pb-2">
                {features.map((feature, index) => (
                  <li key={index} className={`flex items-start gap-2 ${feature.highlight ? 'bg-green-50 p-2 rounded-md border border-green-200' : 'py-0.5'}`}>
                    <CircleCheck className={`size-4 mt-0.5 shrink-0 ${feature.highlight ? 'text-green-600' : 'text-primary'}`} />
                    <span className={`text-sm ${feature.highlight ? 'font-medium text-green-800' : ''} leading-snug`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
>>>>>>> 61d60be (feat: :rocket:)
          </CardContent>
          
          <CardFooter className="pt-4 pb-5 px-5 flex-shrink-0">
            <div className="w-full space-y-2">
              <Button asChild className="w-full py-5 font-semibold hover:shadow-lg transition-shadow duration-300">
                <a
                  href={getPlanUrl(plan, isYearly)}
                  target="_blank"
                >
                  {getButtonText(plan)}
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">✅ Sem cartão • ✅ Cancele quando quiser</div>
              </div>
            </div>
          </CardFooter>
        </Card>
      );
    }
  };

  // Ordenar planos: popular no meio
  const getOrderedPlans = () => {
    const popularPlan = plans.find(plan => plan.popular);
    const otherPlans = plans.filter(plan => !plan.popular);
    
    if (!popularPlan) return plans;
    
    // Se temos 3 planos, colocar o popular no meio
    if (otherPlans.length === 2) {
      return [otherPlans[0], popularPlan, otherPlans[1]];
    }
    
    // Para outros casos, popular primeiro
    return [popularPlan, ...otherPlans];
  };

  const orderedPlans = getOrderedPlans();

  return (
    <section className="py-24 bg-gradient-to-b from-background to-white-soft flex justify-center">
      <div className="container px-4">
<<<<<<< HEAD
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {heading}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{description}</p>
          <div className="flex items-center gap-3 text-lg bg-white-soft border border-white-warm rounded-2xl px-6 py-4 shadow-white-soft mb-12">
            Mensal
            <Switch
              checked={isYearly}
              onCheckedChange={() => setIsYearly(!isYearly)}
            />
            Anual
=======
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 text-center">
          {/* ATTENTION - Social Proof com Urgência Sutil */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-4">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              <strong>Multiplique</strong> suas vendas com IA
            </span>
>>>>>>> 61d60be (feat: :rocket:)
          </div>

          {/* INTEREST - Headlines persuasivos */}
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {heading}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">{description}</p>
          
          {/* DESIRE - Social Proof com Resultados */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-green-800">4.9/5 estrelas</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Setup em 24h</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">30 dias garantidos</span>
            </div>
          </div>

          {/* Switch Anual/Mensal MELHORADO com animações */}
          <div className="relative">
            <div className="flex items-center gap-6 text-lg bg-white/80 backdrop-blur-sm border border-white-warm rounded-3xl px-8 py-6 shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
              <span className={`transition-all duration-300 ${!isYearly ? 'font-bold text-primary scale-110' : 'text-muted-foreground'}`}>
                Mensal
              </span>
              
              <div className="relative">
                <Switch
                  checked={isYearly}
                  onCheckedChange={handleSwitchChange}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-green-600"
                />
              </div>
              
              <span className={`transition-all duration-300 ${isYearly ? 'font-bold text-primary scale-110' : 'text-muted-foreground'}`}>
                Anual
              </span>
              
              {/* Badge de economia que aparece com animação */}
              <div className={`transition-all duration-500 ${isYearly ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-4'}`}>
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-full px-4 py-2 shadow-sm">
                  <span className="text-sm font-bold text-green-700 flex items-center gap-2">
                    💰 Economize até 30%
                    <span className="animate-bounce">🎉</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Indicador visual de economia total */}
            {isYearly && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-4 py-1 shadow-sm">
                  <span className="text-xs font-medium text-amber-800">
                    🔥 Você pode economizar até R$ 1.320 por ano!
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Testimonial Rápido */}
          {/* <div className="max-w-3xl mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white-warm shadow-white-soft mb-12">
            <p className="text-lg text-muted-foreground italic mb-3">
              &ldquo;Investimos R$ 250/mês e tivemos retorno de R$ 18.000 no primeiro trimestre. 
              A IA da Vera é impressionante!&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#E97939] to-[#8A39DB] rounded-full flex items-center justify-center text-white font-bold text-sm">
                AS
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Ana Santos</p>
                <p className="text-sm text-muted-foreground">Fundadora, Digital Solutions</p>
              </div>
            </div>
          </div> */}

          {/* ACTION - Cards dos Planos com alinhamento perfeito */}
          {/* Renderizar carrossel para dispositivos móveis */}
          {isMobile ? (
            <div className="w-full max-w-md mx-auto">
              <Carousel opts={{ loop: true, align: "center" }}>
                <CarouselContent className="-ml-2 md:-ml-4">
                  {orderedPlans.map((plan) => (
                    <CarouselItem key={plan.id} className="pl-2 md:pl-4 flex justify-center">
                      <div className="w-full flex justify-center mt-4">
                        {renderPlanCard(plan)}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1" />
                <CarouselNext className="right-1" />
              </Carousel>
            </div>
          ) : (
            /* Layout com alinhamento perfeito para telas maiores */
            <div className="flex flex-row items-end justify-center gap-8 w-full max-w-7xl mx-auto mt-12">
              {orderedPlans.map((plan) => (
                <div key={plan.id} className={`flex justify-center ${plan.popular ? '' : 'mt-6'}`}>
                  {renderPlanCard(plan)}
                </div>
              ))}
            </div>
          )}

          {/* Garantias Finais */}
          <div className="mt-16 text-center max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold mb-8">Todas as Garantias Que Você Precisa</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-green-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <div className="font-bold text-xl text-green-800 mb-2">30 Dias Grátis</div>
                <div className="text-green-600">Teste sem compromisso</div>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="font-bold text-xl text-blue-800 mb-2">Setup em 24h</div>
                <div className="text-blue-600">Comece a vender amanhã</div>
              </div>
              <div className="p-6 bg-purple-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <div className="font-bold text-xl text-purple-800 mb-2">Suporte VIP</div>
                <div className="text-purple-600">Ajuda quando precisar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing2 };
