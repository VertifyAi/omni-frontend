/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { websocketService } from '../services/websocket';
import { chatService } from '@/services/chat';
import { PaperclipIcon } from "lucide-react";

interface Message {
  ticketId: string;
  message: string;
  sender: 'customer' | 'agent';  // usando enum SenderEnum
  createdAt: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const cleanup = initializeWebSocket();

    // Reconecta se a página ficar offline/online
    window.addEventListener('online', websocketService.connect);
    
    return () => {
      cleanup();
      window.removeEventListener('online', websocketService.connect);
    };
  }, []);

  const loadMessages = async () => {
    try {
      const messages = await chatService.getMessages();
      setMessages(messages);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const initializeWebSocket = () => {
    websocketService.connect();

    const handleNewMessage = (event: CustomEvent) => {
      const newMessage = event.detail;
      setMessages(prev => [...prev, newMessage]);
    };

    window.addEventListener('newMessage', handleNewMessage as EventListener);

    return () => {
      window.removeEventListener('newMessage', handleNewMessage as EventListener);
      websocketService.disconnect();
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newMessage: Message = {
      ticketId: 'temp-id',
      message: inputMessage,
      sender: 'agent',
      createdAt: new Date()
    };

    setIsLoading(true);
    try {
      await chatService.sendMessage(newMessage);
      setInputMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <section className="flex h-[calc(100vh)] w-full shadow-md rounded-lg bg-gray-50">
      {/* Sidebar esquerda - Lista de conversas */}
      <div className="flex flex-col h-full w-[320px] min-w-[320px] bg-white p-4 border-r">
        {/* Header da sidebar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Conversas</h2>
          <Button variant="ghost" size="icon">
            <MessageSquarePlus className="h-5 w-5" />
          </Button>
        </div>

        {/* Lista de conversas */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {/* Conversa ativa */}
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="font-medium">João Silva</p>
                <span className="text-xs text-gray-500">12:30</span>
              </div>
              <p className="text-sm text-gray-500 truncate">Última mensagem da conversa...</p>
            </div>
          </div>

          {/* Exemplo de outras conversas */}
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="font-medium">Maria Santos</p>
                <span className="text-xs text-gray-500">11:45</span>
              </div>
              <p className="text-sm text-gray-500 truncate">Ok, obrigada!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Área central - Chat */}
      <div className="flex flex-col h-full flex-1 bg-gray-50">
        {/* Header do chat */}
        <div className="flex items-center p-4 bg-white border-b">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-medium">João Silva</p>
            <p className="text-xs text-gray-500">Online agora</p>
          </div>
        </div>

        {/* Área de mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.ticketId}
              className={`flex ${msg.sender === "agent" ? "justify-end" : "justify-start"}`}
            >
              <div className={`
                max-w-[70%] p-3 rounded-2xl
                ${msg.sender === "agent" 
                  ? "bg-blue-500 text-white rounded-br-none" 
                  : "bg-white text-gray-800 rounded-bl-none shadow-sm"}
              `}>
                <p className="text-sm">{msg.message}</p>
                <div className={`
                  text-[10px] mt-1
                  ${msg.sender === "agent" ? "text-blue-100" : "text-gray-400"}
                `}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Área de input */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
              <PaperclipIcon className="h-5 w-5" />
            </Button>
            <Input 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="border-0 focus-visible:ring-0 bg-transparent"
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading}
              className={`rounded-full ${!inputMessage.trim() ? 'text-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar direita - Detalhes */}
      <div className="flex flex-col h-full w-[280px] min-w-[280px] bg-white p-4 border-l">
        <div className="text-center pb-4 border-b">
          <Avatar className="h-20 w-20 mx-auto mb-3">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold">João Silva</h3>
          <p className="text-sm text-gray-500">Cliente desde Jan 2024</p>
        </div>
        
        {/* Informações adicionais */}
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Informações do Cliente</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <p>Email: joao@email.com</p>
              <p>Tel: (11) 99999-9999</p>
              <p>ID: #123456</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
