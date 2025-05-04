"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPhoneNumber } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { Ticket, TicketStatus } from "@/types/chat";
import { chatService } from "@/services/chat";

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
        scale: highlighted ? 1.01 : 1,
        backgroundColor: highlighted ? "#FEF9C3" : "#ffffff",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`w-full min-h-[100px] p-4 rounded-lg border cursor-pointer transition-colors ${
        selected
          ? "bg-blue-50 border-blue-200"
          : highlighted
          ? "hover:bg-yellow-100"
          : "hover:bg-gray-50"
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
              className="rounded-full"
            />
            <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5">
              <Image
                src={socialIcons[ticket.channel]}
                alt={ticket.channel}
                width={16}
                height={16}
              />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{ticket.customer.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatPhoneNumber(ticket.customer.phone)}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500 flex flex-col gap-2 items-end">
          {lastMessage && (
            <span>
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
            className="capitalize text-xs"
          >
            {ticket.status === TicketStatus.IN_PROGRESS ? (
              "Em Andamento"
            ) : ticket.status === TicketStatus.CLOSED ? (
              "Fechado"
            ) : (
              <span className="flex items-center gap-1">
                IA <Sparkles className="h-4 w-4" />
              </span>
            )}
          </Badge>
        </div>
      </div>
      <div className="mt-2 flex gap-4">
        {lastMessage && (
          <p className="text-gray-500 truncate w-full">
            <span className="font-semibold">{lastMessage.senderName}:</span>{" "}
            {lastMessage.message}
          </p>
        )}
        {chatService.getUnreadCount(ticket.id) > 0 && (
          <span className="bg-blue-500 text-white rounded-full h-6 w-6 p-2 flex items-center justify-center text-xs">
            {chatService.getUnreadCount(ticket.id)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
