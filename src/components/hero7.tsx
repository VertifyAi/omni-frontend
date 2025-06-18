"use client";

import { Star } from "lucide-react";
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
  heading = "Transforme Conversas em Vendas com IA em 24h",
  description = "Pare de perder clientes por demora no atendimento. A Vera responde instantaneamente no WhatsApp, Instagram e Messenger, qualifica tickets automaticamente e converte 3x mais vendas - mesmo enquanto você dorme.",
  button = {
    text: "Comece seu teste GRATUITO agora",
    url: "https://forms.gle/FsLDDF5dWTSSVZGfA",
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
      <section className="min-h-[100vh] flex items-center justify-center bg-gradient-to-b from-white-pure to-white-soft">
        {/* <div className="container relative z-10 px-4"> */}
          <div className="text-center max-w-5xl mt-12">
            {/* Main heading - ATENÇÃO */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              {heading}
            </h1>

            {/* Description - INTERESSE + DESEJO */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              {description}
            </p>

            {/* Benefícios específicos - DESEJO */}
            {/* <div className="flex justify-center items-center gap-8 mb-12 text-sm md:text-base text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Resposta em segundos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Funciona 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Sem mensalidade nos primeiros 30 dias</span>
              </div>
            </div> */}

            {/* CTA Button - AÇÃO */}
            <div className="mb-8">
              <Button
                asChild
                size="lg"
                className="gradient-brand text-white hover:from-primary/90 hover:to-cool-teal/90 px-10 py-6 text-lg font-semibold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg border-0"
              >
                <a href={button.url}>{button.text}</a>
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                🔒 Sem compromisso • Cancele quando quiser • Suporte em português
              </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Mais de {reviews.count}+ empresas já aumentaram suas vendas
                </p>
              </div>
            </div>
          </div>
        {/* </div> */}
      </section>
    </>
  );
};

export { Hero7 };
