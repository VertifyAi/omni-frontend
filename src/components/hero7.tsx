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
    rating?: string;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

const Hero7 = ({
  heading = "Clientes insatisfeitos, equipe sobrecarregada e atendimento descentralizado?",
  description = "Ofereça respostas rápidas 24h com IA que entende pessoas!\nUnifique todos os canais enquanto sua equipe foca no que realmente importa:\nrelacionamentos que convertem e fidelizam.",
  button = {
    text: "Veja na prática gratuitamente →",
    url: "https://forms.gle/FsLDDF5dWTSSVZGfA",
  },
  reviews = {
    count: 2000,
    rating: "4.9/5",
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
      <section className="min-h-[100vh] flex items-center justify-center bg-gradient-to-b from-white-pure to-white-soft px-4 sm:px-6">
        {/* <div className="container relative z-10 px-4"> */}
          <div className="text-center max-w-5xl mt-16 sm:mt-20 md:mt-24">
            {/* Main heading - ATENÇÃO */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 sm:mb-8 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight px-2 sm:px-0">
              {heading}
            </h1>

            {/* Description - INTERESSE + DESEJO */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
              {description.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < description.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
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
            <div className="mb-6 sm:mb-8 px-4 sm:px-0">
              <Button
                asChild
                size="lg"
                className="gradient-brand text-white hover:from-primary/90 hover:to-cool-teal/90 px-6 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg border-0 w-full sm:w-auto"
              >
                <a href={button.url}>{button.text}</a>
              </Button>
              <p className="text-xs sm:text-sm text-muted-foreground mt-3 px-2 sm:px-0">
                🔒 Teste sem compromisso • Cancele a qualquer momento • Suporte em português
              </p>
            </div>

            {/* Social proof */}
            <div className="mx-auto mt-8 sm:mt-10 flex w-fit flex-col items-center gap-3 sm:gap-4 px-4 sm:px-0">
              <span className="mx-2 sm:mx-4 inline-flex items-center -space-x-3 sm:-space-x-4">
                {reviews.avatars.map((avatar, index) => (
                  <Avatar key={index} className="size-12 sm:size-14">
                    <AvatarImage src={avatar.src} alt={avatar.alt} />
                  </Avatar>
                ))}
              </span>
              <div>
                <div className="flex items-center gap-1 justify-center">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className="size-4 sm:size-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="mr-1 font-semibold text-sm sm:text-base">
                    {reviews.rating}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground text-center">
                  ✨ {reviews.rating} - Mais de {reviews.count} empresas escalaram atendimento
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
