"use client";

import React, { useEffect, useState, useRef } from "react";
import { Message, Ticket } from "@/types/chat";
import { chatService } from "@/services/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { fetchApi } from "@/lib/fetchApi";
import { formatPhoneNumber } from "@/lib/utils";
import Image from "next/image";

interface ChatProps {
  ticket: Ticket;
  handleChangeStatus: () => Promise<void>;
}

export function Chat({ ticket, handleChangeStatus }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoadingInitial(true);
        setError(null);
        const response = await fetchApi(`/api/tickets/${ticket.id}/messages`);
        const loadedMessages = await response.json();
        setMessages(loadedMessages);
        chatService.markAsRead(ticket.id);
      } catch (error) {
        console.error("Chat: Erro ao carregar mensagens:", error);
        setError("Não foi possível carregar as mensagens. Tente novamente.");
      } finally {
        setIsLoadingInitial(false);
      }
    };

    // Conectar ao chat e carregar mensagens
    chatService.connect();
    loadMessages();

    // Configurar listener para novas mensagens
    const unsubscribe = chatService.onNewMessage((message) => {
      if (message.ticketId === ticket.id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      unsubscribe();
      chatService.disconnect();
    };
  }, [ticket.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsSendingMessage(true);
      setError(null);
      const response = await fetchApi(`/api/tickets/${ticket.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage,
          sender: "USER",
        }),
      });
      const newMessageData = await response.json();
      setMessages((prev) => [...prev, newMessageData]);
      chatService.sendMessage(ticket.id, newMessageData);
      chatService.markAsRead(ticket.id);
      setNewMessage("");
    } catch (error) {
      console.error("Chat: Erro ao enviar mensagem:", error);
      setError("Não foi possível enviar a mensagem. Tente novamente.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b pl-4">
        <Image
          src={ticket.customer.avatar || "/default-avatar.svg"}
          alt={ticket.customer.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold">{ticket.customer.name}</h2>
          <p className="text-sm text-muted-foreground">
            {formatPhoneNumber(ticket.customer.phone)}
          </p>
        </div>
        {chatService.getUnreadCount(ticket.id) > 0 && (
          <div className="ml-auto p-4">
            <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
              {chatService.getUnreadCount(ticket.id)} nova(s)
            </span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <Button
              variant="link"
              className="ml-2 text-red-700"
              onClick={() => setError(null)}
            >
              Fechar
            </Button>
          </div>
        )}

        {isLoadingInitial ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                ref={scrollRef}
                key={index}
                className={`flex ${
                  message.sender === "AI" || message.sender === "USER"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] break-words whitespace-pre-wrap rounded-lg p-3 ${
                    message.sender === "AI" || message.sender === "USER"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {formatDate(message.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          {ticket.status === "AI" ? (
            <div className="flex w-full items-center justify-center">
              <p className="mr-12">Atualizar status:</p>

              <div className="flex gap-6">
                <Button onClick={handleChangeStatus}>Atender Cliente</Button>
                <Button variant={"destructive"}>Finalizar Atendimento</Button>
              </div>
            </div>
          ) : (
            <>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isSendingMessage || !newMessage.trim()}
              >
                {isSendingMessage ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
