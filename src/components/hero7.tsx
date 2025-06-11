"use client";

<<<<<<< HEAD
import { Star } from "lucide-react";
=======
import { Star, TrendingUp, Users, Clock } from "lucide-react";
>>>>>>> 61d60be (feat: :rocket:)
import React from "react";

import { Button } from "@/components/ui/button";

import "../app/globals.css";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

interface Hero7Props {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  reviews?: {
    count: number;
    rating?: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

const Hero7 = ({
<<<<<<< HEAD
  heading = "Acabe com Filas e Impulsione Vendas",
  description = "Automatize e escale o seu atendimento de maneira inteligente com a Vera, a assistente virtual que gerencia conversas por 24h em múltiplos canais. Integre WhatsApp, Instagram, Messenger e muito mais, tudo em um só lugar.",
  button = {
    text: "Teste grátis por 30 dias",
    url: "https://forms.gle/FsLDDF5dWTSSVZGfA",
=======
  heading = "Menos Esforço, Mais Resultados para Sua Equipe!",
  description = "Enquanto seus concorrentes perdem leads fora do horário comercial, nossa IA trabalha 24h automatizando vendas e suporte.",
  button = {
    text: "Começar Teste Gratuito de 30 Dias",
    url: "/sign-up",
>>>>>>> 61d60be (feat: :rocket:)
  },
  reviews = {
    count: 2000,
    rating: 4.9,
    avatars: [
      {
        src: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+20.svg",
        alt: "Facebook",
      },
      {
        src: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+21.svg",
        alt: "Instagram",
      },
      {
        src: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+27.svg",
        alt: "WhatsApp",
      },
      {
        src: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+17.svg",
        alt: "Discord",
      },
      {
        src: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+16.svg",
        alt: "Telegram",
      },
    ],
  },
}: Hero7Props) => {
  return (
    <>
<<<<<<< HEAD
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-white-pure to-white-soft overflow-hidden">
=======
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-white-pure to-white-soft overflow-hidden pt-24">
>>>>>>> 61d60be (feat: :rocket:)
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-cool-blue-subtle via-transparent to-cool-teal-subtle opacity-30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-cool-subtle rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-brand-subtle rounded-full blur-3xl opacity-15"></div>

        <div className="container relative z-10 px-4">
          <div className="text-center max-w-5xl mx-auto">
<<<<<<< HEAD
            {/* Main heading */}
=======
            {/* ATTENTION - Urgência Sutil */}
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">
                <strong>Automatize seu atendimento</strong> antes dos
                concorrentes
              </span>
            </div>

            {/* Main heading - ATTENTION com benefício */}
>>>>>>> 61d60be (feat: :rocket:)
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              {heading}
            </h1>

<<<<<<< HEAD
            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              {description}
            </p>

            {/* CTA Button */}
            <div className="mb-20">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-cool-teal text-white hover:from-primary/90 hover:to-cool-teal/90 px-10 py-6 text-lg font-semibold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg border-0"
              >
                <a href={button.url}>{button.text}</a>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 ">
              <span className="mx-4 inline-flex items-center -space-x-4 ">
                {reviews.avatars.map((avatar, index) => (
                  <Avatar key={index} className="size-14">
                    <AvatarImage src={avatar.src} alt={avatar.alt} />
                  </Avatar>
                ))}
              </span>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className="size-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="mr-1 font-semibold">
                    {reviews.rating?.toFixed(1)}
                  </span>
                </div>
                {/* <p className="text-left font-medium text-muted-foreground">
                from {reviews.count}+ reviews
              </p> */}
=======
            {/* Description - INTEREST com problema e solução */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
              {description}
            </p>

            {/* DESIRE - Benefícios Rápidos */}
            <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white-warm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-medium">Aumente suas conversões</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white-warm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Resposta em 3 segundos</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-white-warm">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="font-medium">24/7 sem parar</span>
              </div>
            </div>

            {/* ACTION - CTA Button Enhanced */}
            <div className="mb-8">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#E97939] to-[#8A39DB] text-white hover:from-[#E97939]/90 hover:to-[#8A39DB]/90 px-12 py-8 text-xl font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl border-0"
              >
                <a href={button.url}>{button.text}</a>
              </Button>
              <div className="text-xs text-muted-foreground mt-3 max-w-md mx-auto">
                Inicie em 5 minutos • Suporte 24/7 • Treinamento para equipe
              </div>
            </div>

            {/* Enhanced Social proof com mais credibilidade */}
            <div className="mx-auto mt-12 flex w-fit flex-col items-center gap-6">
              {/* Avatars das redes sociais */}
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center -space-x-3">
                  {reviews.avatars.map((avatar, index) => (
                    <Avatar key={index} className="size-16">
                      <AvatarImage src={avatar.src} alt={avatar.alt} />
                    </Avatar>
                  ))}
                </span>
                <div className="text-left">
                  <div className="text-sm font-medium text-muted-foreground">
                    Integra com todas as principais plataformas
                  </div>
                  <div className="text-xs text-muted-foreground">
                    WhatsApp • Instagram • Facebook • Discord • Telegram
                  </div>
                </div>
              </div>

              {/* Rating e Social Proof */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="size-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="font-bold text-lg">
                    {reviews.rating?.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    Aprovado por quem usa
                  </span>
                </div>

                {/* Testimonial Rápido */}
                {/* <div className="max-w-md text-center">
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;Nossa receita aumentou R$ 45.000 no primeiro mês com
                    a Vera&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    — Carlos Silva, CEO da TechFlow
                  </p>
                </div> */}
              </div>

              {/* Garantia e Urgência Sutil */}
              <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>30 dias grátis garantidos</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Cancelamento livre</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Suporte VIP</span>
                </div>
>>>>>>> 61d60be (feat: :rocket:)
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { Hero7 };
