"use client";

import { ArrowRight, CircleCheck } from "lucide-react";
import { useState, useEffect } from "react";

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
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  main?: boolean;
  features: PricingFeature[];
  monthlyButton: {
    text: string;
    url: string;
  };
  yearlyButton: {
    text: string;
    url: string;
  };
}

interface Pricing2Props {
  heading?: string;
  description?: string;
  plans?: PricingPlan[];
}

const Pricing2 = ({
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
        text: "Testar grátis por 14 dias",
        url: "https://buy.stripe.com/9AQdRTcL14jz9fW7sv",
      },
      yearlyButton: {
        text: "Testar grátis por 14 dias",
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
        text: "Testar grátis por 14 dias",
        url: "https://buy.stripe.com/00gbJL6mD4jz63K7st",
      },
      yearlyButton: {
        text: "Testar grátis por 14 dias",
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
}: Pricing2Props) => {
  const [isYearly, setIsYearly] = useState(true);
  
  // Ordenar os planos para que o plano principal (main) seja o primeiro
  const sortedPlans = [...plans].sort((a, b) => {
    if (a.main) return -1;
    if (b.main) return 1;
    return 0;
  });
  
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
  
  // Renderizar o conteúdo do card
  const renderPlanCard = (plan: PricingPlan) => {
    if (plan.main) {
      return (
        <div
          key={plan.id}
          className="bg-gradient-to-r from-[#E97939] to-[#8A39DB] p-[2px] rounded-xl relative"
        >
          <div className="bg-gradient-to-r from-[#E97939] to-[#8A39DB] p-[2px] rounded-xl w-32 absolute top-[-2.2%] left-[29%]">
            <div className="bg-white rounded-xl">Mais popular</div>
          </div>
          <Card className="flex w-78 flex-col justify-between text-left bg-white rounded-xl">
            <CardHeader>
              <CardTitle>
                <p>{plan.name}</p>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
              <span className="text-4xl font-bold flex items-end gap-1">
                {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
              </span>
              <p className="text-muted-foreground">
                Pagamento anual:{" "}
                {isYearly && plan.yearlyPrice === "A combinar"
                  ? "A combinar"
                  : !isYearly && plan.monthlyPrice === "A combinar"
                  ? "A combinar"
                  : isYearly
                  ? `R$${Number(plan.yearlyPrice.slice(2)) * 12}`
                  : `R$${Number(plan.monthlyPrice.slice(2)) * 12}`}
              </p>
            </CardHeader>
            <CardContent>
              <Separator className="mb-6" />
              <ul className="space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CircleCheck className="size-4" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <a
                  href={
                    isYearly
                      ? plan.yearlyButton.url
                      : plan.monthlyButton.url
                  }
                  target="_blank"
                >
                  {isYearly
                    ? plan.yearlyButton.text
                    : plan.monthlyButton.text}
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    } else {
      return (
        <Card
          key={plan.id}
          className="flex w-80 flex-col justify-between text-left"
        >
          <CardHeader>
            <CardTitle>
              <p>{plan.name}</p>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {plan.description}
            </p>
            <span className="text-4xl font-bold flex items-end gap-1">
              {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
            </span>
            <p className="text-muted-foreground">
              Pagamento anual:{" "}
              {isYearly && plan.yearlyPrice === "A combinar"
                ? "A combinar"
                : !isYearly && plan.monthlyPrice === "A combinar"
                ? "A combinar"
                : isYearly
                ? `R$${Number(plan.yearlyPrice.slice(2)) * 12}`
                : `R$${Number(plan.monthlyPrice.slice(2)) * 12}`}
            </p>
          </CardHeader>
          <CardContent>
            <Separator className="mb-6" />
            <ul className="space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CircleCheck className="size-4" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button asChild className="w-full">
              <a
                href={
                  isYearly
                    ? plan.yearlyButton.url
                    : plan.monthlyButton.url
                }
                target="_blank"
              >
                {isYearly
                  ? plan.yearlyButton.text
                  : plan.monthlyButton.text}
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      );
    }
  };

  return (
    <section className="py-32 flex justify-center items-center">
      <div className="container">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-pretty text-4xl font-bold lg:text-4xl">
            {heading}
          </h2>
          <p className="text-muted-foreground">{description}</p>
          <div className="flex items-center gap-3 text-lg">
            Mensal
            <Switch
              checked={isYearly}
              onCheckedChange={() => setIsYearly(!isYearly)}
            />
            Anual
          </div>

          {/* Renderizar carrossel para dispositivos móveis */}
          {isMobile ? (
            <div className="w-full max-w-md mx-auto">
              <Carousel opts={{ loop: true, align: "center" }}>
                <CarouselContent className="-ml-2 md:-ml-4">
                  {sortedPlans.map((plan) => (
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
            /* Layout original para telas maiores */
            <div className="flex flex-col items-stretch gap-6 md:flex-row">
              {plans.map((plan) => renderPlanCard(plan))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export { Pricing2 };
