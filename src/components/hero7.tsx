"use client";

import { Star } from "lucide-react";
import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import "../app/globals.css";

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

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 -z-10"
      options={{
        fullScreen: { enable: false },
        background: {
          color: { value: "transparent" },
        },
        fpsLimit: 120,
        particles: {
          color: {
            value: "#8A39DB",
          },
          links: {
            color: "#E97939",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: false,
            straight: false,
            outModes: {
              default: "bounce",
            },
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 70,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

const Hero7 = ({
  heading = "Venda Mais e Reduza Custos com IA Omnichannel",
  description = "Automatize e escale o seu atendimento de maneira inteligente com a Vera, a assistente virtual que gerencia conversas por 24h em múltiplos canais. Integre WhatsApp, Instagram, Messenger e muito mais, tudo em um só lugar.",
  button = {
    text: "Teste grátis por 14 dias",
    url: "https://www.shadcnblocks.com", 
  },
  reviews = {
    count: 200,
    rating: 5.0,
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
        src: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+19.svg",
        alt: "TikTok",
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
      <section className="py-32 relative min-h-[600px] overflow-hidden">
        <ParticlesBackground />
        <div className="text-center relative z-10">
          <div className="mx-auto flex max-w-screen-lg flex-col gap-6 pointer-events-auto">
            <h1 className="text-3xl font-extrabold lg:text-6xl">{heading}</h1>
            <p className="text-balance text-muted-foreground lg:text-lg">
              {description}
            </p>
          </div>
          <div className="bg-gradient-to-r from-[#E97939] to-[#8A39DB] p-[2px] rounded-xl mt-10 inline-block">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-[#f5f5f5] rounded-xl px-6 py-4"
            >
              <a href={button.url}>{button.text}</a>
            </Button>
          </div>
          <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 ">
            <span className="mx-4 inline-flex items-center -space-x-4">
              {reviews.avatars.map((avatar, index) => (
                <Avatar key={index} className="size-14 border">
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
      </section>
    </>
  );
};

export { Hero7 };
