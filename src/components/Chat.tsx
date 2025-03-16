"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Message, Ticket } from '@/types/chat';
import { chatService } from '@/services/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';

interface ChatProps {
  ticket: Ticket;
}

export function Chat({ ticket }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedMessages = await chatService.getMessages(ticket.id);
        setMessages(loadedMessages);
      } catch (error) {
        console.error('Chat: Erro ao carregar mensagens:', error);
        setError('Não foi possível carregar as mensagens. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    // Conectar ao chat e carregar mensagens
    chatService.connect();
    loadMessages();

    // Configurar listener para novas mensagens
    const unsubscribe = chatService.onNewMessage((message) => {
      if (message.ticketId === ticket.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      unsubscribe();
      chatService.disconnect();
    };
  }, [ticket.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      await chatService.sendMessage(ticket.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Chat: Erro ao enviar mensagem:', error);
      setError('Não foi possível enviar a mensagem. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Ticket #{ticket.id}</h2>
        <p className="text-sm text-muted-foreground">{ticket.summary}</p>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 p-4">
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
        
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "AGENT" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "AGENT"
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
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
            disabled={isLoading || !newMessage.trim()}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
