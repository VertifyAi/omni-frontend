"use client";

import { useState, useEffect, Suspense } from "react";
import { TicketList } from "@/components/TicketList";
import { Chat } from "@/components/Chat";
import { Ticket, TicketPriorityLevel, TicketStatus } from "@/types/ticket";
import { TransferTicketDto } from "@/types/ticket";
import { fetchApi } from "@/lib/fetchApi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import "../../globals.css";

function TicketsPageContent() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedTab, setSelectedTab] = useState<TicketStatus>(TicketStatus.IN_PROGRESS);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Escutar tecla ESC para desselecionar ticket
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedTicket) {
        setSelectedTicket(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTicket]);

  // Verificar se há um ticket específico na URL para selecionar automaticamente
  useEffect(() => {
    const selectedTicketId = searchParams.get('selectedTicket');
    if (selectedTicketId) {
      // Fazer uma requisição para buscar o ticket específico
      const fetchSpecificTicket = async () => {
        try {
          const response = await fetchApi(`/api/tickets/${selectedTicketId}`);
          if (response.ok) {
            const ticket = await response.json();
            setSelectedTicket(ticket);
            // Remover o parâmetro da URL
            window.history.replaceState({}, '', '/dashboard/tickets');
          }
        } catch (error) {
          console.error('Erro ao carregar ticket específico:', error);
        }
      };
      fetchSpecificTicket();
    }
  }, [searchParams]);

  const handleTransferTicket = async (status: TicketStatus) => {
    if (!selectedTicket) {
      console.error("Nenhum ticket selecionado");
      return;
    }

    try {
      const payload: TransferTicketDto = {};

      // Caso 1 e 2: Abrir ou pegar um atendimento (IN_PROGRESS)
      if (status === TicketStatus.IN_PROGRESS && user?.id) {
        payload.userId = user.id;
        payload.priorityLevel = TicketPriorityLevel.MEDIUM;
      }

      // Caso 3: Fechar um chamado (CLOSED)
      if (status === TicketStatus.CLOSED) {
        payload.closeTicket = true;
      }

      const response = await fetchApi(`/api/tickets/${selectedTicket.id}/transfer`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro ao transferir ticket: ${response.status}`);
      }

      // Atualizar o ticket local
      setSelectedTicket((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: status,
          userId: payload.userId,
          priorityLevel: payload.priorityLevel || prev.priorityLevel,
        };
      });

      // Atualizar a aba selecionada
      setSelectedTab(status);
      
      // Trigger refresh da lista
      setRefreshTrigger(prev => prev + 1);
      
      // Mostrar mensagem de sucesso
      if (status === TicketStatus.CLOSED) {
        toast.success("Ticket fechado com sucesso!");
      } else if (status === TicketStatus.IN_PROGRESS) {
        toast.success("Ticket transferido com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao transferir ticket:", error);
      toast.error("Erro ao transferir ticket. Tente novamente.");
    }
  };

  return (
    <div className="flex h-screen ml-16 bg-gradient-to-br from-background to-white-muted">
      {/* Nível 2: Listagem de Atendimentos */}
      <div className="w-[400px] bg-white-soft border-r border-white-warm shadow-white-soft">
        <TicketList
          onTicketSelect={setSelectedTicket}
          selectedTicket={selectedTicket}
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
          refreshTrigger={refreshTrigger}
        />
      </div>
      
      {/* Nível 3: Área do Chat */}
      <div className="flex-1 bg-white-warm">
        {selectedTicket ? (
          <Chat
            ticket={selectedTicket}
            handleTransferTicket={handleTransferTicket}
            onTicketUpdated={() => {
              setRefreshTrigger(prev => prev + 1);
              setSelectedTicket(null); // Desselecionar o ticket transferido
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-white-warm">
            <div className="text-center p-8 rounded-2xl bg-white-soft border border-white-warm shadow-white-soft max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum atendimento selecionado
              </h3>
              <p className="text-sm text-muted-foreground">
                Selecione um atendimento na lista ao lado para iniciar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-screen ml-16 bg-gradient-to-br from-background to-white-muted">
      <div className="w-[400px] bg-white-soft border-r border-white-warm shadow-white-soft">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 bg-white-warm">
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TicketsPageContent />
    </Suspense>
  );
}
