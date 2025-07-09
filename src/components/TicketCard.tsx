"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPhoneNumber } from "@/lib/utils";
import { Bot, Volume2 } from "lucide-react";
import { Ticket, TicketStatus } from "@/types/ticket";
import { chatService } from "@/services/chat";
import "../app/globals.css";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const socialIcons: Record<string, string> = {
  facebook:
    "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+20.svg",
  instagram:
    "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+21.svg",
  whatsapp:
    "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+27.svg",
  tiktok:
    "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+19.svg",
  telegram:
    "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+16.svg",
};

interface TicketCardProps {
  ticket: Ticket;
  selected: boolean;
  highlighted: boolean;
  onSelect: (ticket: Ticket) => void;
}

// Função para detectar se é um link de áudio da S3
const isS3AudioUrl = (url: string): boolean => {
  return (
    url.includes(".s3.") &&
    (url.includes(".mp3") ||
      url.includes(".wav") ||
      url.includes(".m4a") ||
      url.includes(".ogg") ||
      url.includes(".webm"))
  );
};

// Função para obter a duração do áudio
const getAudioDuration = (audioUrl: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
    audio.addEventListener("error", () => {
      reject(0);
    });
  });
};

// Função para formatar duração em mm:ss
const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function TicketCard({
  ticket,
  selected,
  highlighted,
  onSelect,
}: TicketCardProps) {
  const lastMessage = ticket.ticketMessages.at(-1);
  const [audioDuration, setAudioDuration] = useState<string | null>(null);

  useEffect(() => {
    if (
      lastMessage &&
      lastMessage.messageType === "AUDIO" &&
      isS3AudioUrl(lastMessage.message)
    ) {
      getAudioDuration(lastMessage.message)
        .then((duration) => {
          setAudioDuration(formatDuration(duration));
        })
        .catch(() => {
          setAudioDuration("0:00");
        });
    } else {
      setAudioDuration(null);
    }
  }, [lastMessage]);

  // const getPriorityConfig = (priority: TicketPriorityLevel) => {
  //   switch (priority) {
  //     case TicketPriorityLevel.CRITICAL:
  //       return {
  //         text: "Crítica",
  //         className: "bg-red-500 text-white border-red-600",
  //       };
  //     case TicketPriorityLevel.HIGH:
  //       return {
  //         text: "Alta",
  //         className: "bg-orange-500 text-white border-orange-600",
  //       };
  //     case TicketPriorityLevel.MEDIUM:
  //       return {
  //         text: "Média",
  //         className: "bg-yellow-500 text-white border-yellow-600",
  //       };
  //     case TicketPriorityLevel.LOW:
  //       return {
  //         text: "Baixa",
  //         className: "bg-green-500 text-white border-green-600",
  //       };
  //     default:
  //       return {
  //         text: "Média",
  //         className: "bg-yellow-500 text-white border-yellow-600",
  //       };
  //   }
  // };

  // const priorityConfig = getPriorityConfig(ticket.priorityLevel);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: highlighted ? 1.02 : 1,
        backgroundColor: highlighted
          ? "oklch(0.998 0.001 250)"
          : "oklch(1 0 0)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`w-full min-h-[100px] p-4 rounded-xl border cursor-pointer transition-all duration-200 elevated-1 hover:elevated-2 ${
        selected
          ? "bg-white-pure border-primary shadow-brand-orange"
          : highlighted
          ? "bg-white-soft border-yellow-300 shadow-lg"
          : "bg-white-pure border-white-warm hover:border-primary"
      }`}
      onClick={() => onSelect(ticket)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={ticket.customer.profilePicture || `https://avatar.vercel.sh/${ticket.customer.name || 'User'}.png`}
              alt={ticket.customer.name}
              width={40}
              height={40}
              className="rounded-full border-2 border-white-warm"
            />
            <div className="absolute -bottom-1 -right-1 rounded-full bg-white-pure p-0.5">
              <Image
                src={socialIcons[ticket.channel]}
                alt={ticket.channel}
                width={14}
                height={14}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">
                {ticket.customer.name.length > 15
                  ? ticket.customer.name.substring(0, 15) + "..."
                  : ticket.customer.name}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPhoneNumber(ticket.customer.phone || "")}
            </p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground flex flex-col gap-2 items-end">
          {lastMessage && (
            <span className="text-xs">
              {new Date(lastMessage.createdAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
            <Badge
              variant={
                ticket.status === TicketStatus.CLOSED ? "secondary" : "default"
              }
              className={`capitalize text-xs font-medium ${
                ticket.status === TicketStatus.AI
                  ? "bg-primary text-white hover:opacity-90"
                  : ticket.status === TicketStatus.IN_PROGRESS
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {ticket.status === TicketStatus.IN_PROGRESS ? (
                "Em Andamento"
              ) : ticket.status === TicketStatus.CLOSED ? (
                "Fechado"
              ) : (
                <span className="flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  IA
                </span>
              )}
            </Badge>
          {/* {ticket.status === TicketStatus.IN_PROGRESS &&
            ticket.priorityLevel && (
              <Badge
                className={`text-xs px-2 py-0.5 ${priorityConfig.className}`}
              >
                {priorityConfig.text}
              </Badge>
            )} */}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        {lastMessage && (
          <div className="text-muted-foreground truncate flex text-xs gap-2">
            <span className="font-medium text-foreground">
              {lastMessage.senderName}:
            </span>{" "}
            {lastMessage.messageType === "AUDIO" &&
            isS3AudioUrl(lastMessage.message) ? (
              <span className="flex items-center gap-1">
                <Volume2 className="h-4 w-4" />
                <span>Áudio</span>
                {audioDuration && (
                  <span className="text-xs text-muted-foreground">
                    ({audioDuration})
                  </span>
                )}
              </span>
            ) : (
              <span>{lastMessage.message}</span>
            )}
          </div>
        )}
        {chatService.getUnreadCount(ticket.id) > 0 && (
          <span className="bg-gradient-to-r from-primary to-secondary text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-semibold elevated-1 animate-pulse">
            {chatService.getUnreadCount(ticket.id)}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function TicketCardSkeleton() {
  return (
    <div className="w-full min-h-[100px] p-4 rounded-xl border bg-white-pure border-white-warm elevated-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="absolute -bottom-1 -right-1 rounded-full bg-white-pure p-0.5">
              <Skeleton className="w-[14px] h-[14px] rounded-full" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="text-sm text-muted-foreground flex flex-col gap-2 items-end">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex-1">
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
