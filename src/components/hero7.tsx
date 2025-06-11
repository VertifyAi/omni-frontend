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
  heading = "Acabe com Filas e Impulsione Vendas",
  description = "Automatize e escale o seu atendimento de maneira inteligente com a Vera, a assistente virtual que gerencia conversas por 24h em múltiplos canais. Integre WhatsApp, Instagram, Messenger e muito mais, tudo em um só lugar.",
  button = {
    text: "Teste grátis por 30 dias",
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
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-white-pure to-white-soft overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-cool-blue-subtle via-transparent to-cool-teal-subtle opacity-30"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-cool-subtle rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-brand-subtle rounded-full blur-3xl opacity-15"></div>

        <div className="container relative z-10 px-4">
          <div className="text-center max-w-5xl mx-auto">
            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              {heading}
            </h1>

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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export { Hero7 };
