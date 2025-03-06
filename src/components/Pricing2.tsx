"use client";

import { ArrowRight, CircleCheck } from "lucide-react";
import { useState } from "react";

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

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: PricingFeature[];
  button: {
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
      id: "free",
      name: "Gratuito",
      description: "Plano gratuito para começar",
      monthlyPrice: "R$00",
      yearlyPrice: "R$00",
      features: [
        { text: "Dashboard para Análises" },
        { text: "Integrações Ilimitadas" },
        { text: "Suporte 24/7" },
        { text: "" },
      ],
      button: {
        text: "Purchase",
        url: "https://www.shadcnblocks.com",
      },
    },
    {
      id: "plus",
      name: "Profissional",
      description: "Para autônomos e equipes pequenas",
      monthlyPrice: "R$69",
      yearlyPrice: "R$44",
      features: [
        { text: "Agentes de IA para triagem e automação" },
        { text: "Equipes ilimitadas" },
        { text: "" },
        { text: "1GB storage space" },
      ],
      button: {
        text: "Purchase",
        url: "https://www.shadcnblocks.com",
      },
    },
    {
      id: "emp",
      name: "Empresarial",
      description: "Para equipes grandes e empresas",
      monthlyPrice: "R$89",
      yearlyPrice: "R$64",
      features: [
        { text: "Unlimited team members" },
        { text: "Advanced components" },
        { text: "Priority support" },
        { text: "Unlimited storage" },
      ],
      button: {
        text: "Purchase",
        url: "https://www.shadcnblocks.com",
      },
    },
  ],
}: Pricing2Props) => {
  const [isYearly, setIsYearly] = useState(true);
  return (
    <section className="pt-32 flex justify-center items-center">
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
          <div className="flex flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan) => (
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
                    {plan.id !== 'free' && <p className="text-sm font-normal text-muted-foreground">p/ usuário</p>}
                  </span>
                  <p className="text-muted-foreground">
                    Pagamento anual:{" "}
                    {isYearly
                      ? `R$${Number(plan.yearlyPrice.slice(2)) * 12}`
                      : `R$${Number(plan.monthlyPrice.slice(2)) * 12}`}
                  </p>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-6" />
                  {plan.id === "plus" ? (
                    <p className="mb-3 font-semibold">
                      Tudo no plano Gratuito +
                    </p>
                  ) : plan.id === "emp" ? (
                    <p className="mb-3 font-semibold">
                      Tudo no plano Profissional +
                    </p>
                  ) : null}
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
                    <a href={plan.button.url} target="_blank">
                      {plan.button.text}
                      <ArrowRight className="ml-2 size-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Pricing2 };
