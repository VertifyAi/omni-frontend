"use client";

import { useEffect, useRef } from 'react';
import { chatService } from '@/services/chat';

interface ChatServiceProviderProps {
  children: React.ReactNode;
}

export function ChatServiceProvider({ children }: ChatServiceProviderProps) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      console.log('ChatServiceProvider: Já foi inicializado, ignorando');
      return;
    }

    console.log('ChatServiceProvider: Inicializando...');
    
    // Marcar como inicializado imediatamente para evitar múltiplas inicializações
    hasInitialized.current = true;
    
    // Inicializar o serviço de chat
    chatService.initialize();

    console.log('ChatServiceProvider: ChatService inicializado');

    // Cleanup ao desmontar
    return () => {
      console.log('ChatServiceProvider: Cleanup executado');
      hasInitialized.current = false;
    };
  }, []);

  return <>{children}</>;
} 