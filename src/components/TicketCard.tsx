"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPhoneNumber } from "@/lib/utils";
import { Bot } from "lucide-react";
import { Ticket, TicketStatus } from "@/types/chat";
import { chatService } from "@/services/chat";
import "../app/globals.css";

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

export function TicketCard({
  ticket,
  selected,
  highlighted,
  onSelect,
}: TicketCardProps) {
  const lastMessage = ticket.ticketMessages.at(0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: highlighted ? 1.02 : 1,
        backgroundColor: highlighted ? "oklch(0.998 0.001 250)" : "oklch(1 0 0)",
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
              src={ticket.customer.avatar || "/default-avatar.svg"}
              alt={ticket.customer.name}
              width={40}
              height={40}
              className="rounded-full border-2 border-white-warm"
            />
            <div className="absolute -bottom-1 -right-1 rounded-full bg-white-pure p-1 shadow-white-soft border border-white-warm">
              <Image
                src={socialIcons[ticket.channel]}
                alt={ticket.channel}
                width={14}
                height={14}
              />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{ticket.customer.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatPhoneNumber(ticket.customer.phone)}
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground flex flex-col gap-2 items-end">
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
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:opacity-90"
                : ticket.status === TicketStatus.IN_PROGRESS
                ? "bg-gradient-to-r from-primary to-secondary text-white"
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
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        {lastMessage && (
          <p className="text-muted-foreground truncate flex-1 text-sm">
            <span className="font-medium text-foreground">{lastMessage.senderName}:</span>{" "}
            {lastMessage.message}
          </p>
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
