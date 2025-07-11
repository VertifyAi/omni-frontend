"use client";

import { useEffect, useState, useCallback } from "react";
import { Ticket, TicketStatus, TicketPriorityLevel } from "@/types/ticket";
import { Button } from "@/components/ui/button";
import { Filter, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/fetchApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chatService } from "@/services/chat";
import { TicketCard, TicketCardSkeleton } from "./TicketCard";
import Link from "next/link";
import "../app/globals.css";

interface TicketListProps {
  onTicketSelect: (ticket: Ticket) => void;
  selectedTicket: Ticket | null;
  setSelectedTab: (tab: TicketStatus) => void;
  selectedTab: TicketStatus;
  refreshTrigger?: number;
}

export function TicketList({
  onTicketSelect,
  selectedTicket,
  setSelectedTab,
  selectedTab,
  refreshTrigger,
}: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedTicketId, setHighlightedTicketId] = useState<number | null>(
    null
  );

  const getPriorityOrder = (priority: TicketPriorityLevel): number => {
    switch (priority) {
      case TicketPriorityLevel.CRITICAL:
        return 1;
      case TicketPriorityLevel.HIGH:
        return 2;
      case TicketPriorityLevel.MEDIUM:
        return 3;
      case TicketPriorityLevel.LOW:
        return 4;
      default:
        return 3; // Default to MEDIUM
    }
  };

  const sortTicketsByPriority = (tickets: Ticket[]): Ticket[] => {
    return tickets.sort((a: Ticket, b: Ticket) => {
      // Primeiro, ordenar por prioridade
      const priorityDiff =
        getPriorityOrder(a.priorityLevel) - getPriorityOrder(b.priorityLevel);
      if (priorityDiff !== 0) return priorityDiff;

      // Se a prioridade for igual, ordenar por data da última mensagem
      const dateA = new Date(a.ticketMessages.at(-1)?.createdAt || 0).getTime();
      const dateB = new Date(b.ticketMessages.at(-1)?.createdAt || 0).getTime();
      return dateB - dateA;
    });
  };

  const sortTicketsByLastMessage = (tickets: Ticket[]): Ticket[] => {
    return tickets.sort((a: Ticket, b: Ticket) => {
      // Pega a data da última mensagem ou usa a data de criação do ticket como fallback
      const lastMessageDateA =
        a.ticketMessages.length > 0
          ? new Date(
              a.ticketMessages[a.ticketMessages.length - 1].createdAt
            ).getTime()
          : new Date(a.createdAt).getTime();

      const lastMessageDateB =
        b.ticketMessages.length > 0
          ? new Date(
              b.ticketMessages[b.ticketMessages.length - 1].createdAt
            ).getTime()
          : new Date(b.createdAt).getTime();

      return lastMessageDateB - lastMessageDateA; // Mais recente primeiro
    });
  };

  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchApi("/api/tickets");
      let ticket = await result.json();

      ticket = sortTicketsByPriority(ticket);

      setTickets(ticket);
    } catch (error) {
      console.error("Erro ao carregar tickets:", error);
      setError("Não foi possível carregar os tickets.");
    } finally {
      setIsLoading(false);
    }
  }, [onTicketSelect, selectedTicket]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      loadTickets();
    }
  }, [refreshTrigger, loadTickets]);

  useEffect(() => {
    const unsubscribe = chatService.onNewMessage((message) => {
      console.log("Nova mensagem recebida:", message);

      setTickets((prevTickets) => {
        const updatedTickets = [...prevTickets];
        const index = updatedTickets.findIndex(
          (t) => t.id === message.ticketId
        );

        if (index === -1) return prevTickets;

        const ticketToUpdate = { ...updatedTickets[index] };

        ticketToUpdate.ticketMessages = [
          ...ticketToUpdate.ticketMessages,
          message,
        ];

        updatedTickets.splice(index, 1); // remove
        const reordered = [ticketToUpdate, ...updatedTickets]; // coloca no topo

        setHighlightedTicketId(message.ticketId);
        setTimeout(() => setHighlightedTicketId(null), 3000); // 3s destaque

        return reordered;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [selectedTicket?.id, onTicketSelect]);

  useEffect(() => {
    console.log("TicketList: Configurando listener para novos tickets...");

    const unsubscribe = chatService.onNewTicket((newTicket) => {
      console.log("TicketList: Novo ticket recebido via callback:", newTicket);
      console.log("TicketList: Tipo do ticket:", typeof newTicket);
      console.log("TicketList: ID do ticket:", newTicket.id);

      setTickets((prevTickets) => {
        console.log("TicketList: Tickets anteriores:", prevTickets.length);

        // Verificar se o ticket já existe na lista
        const ticketExists = prevTickets.some(
          (ticket) => ticket.id === newTicket.id
        );
        if (ticketExists) {
          console.log(
            "TicketList: Ticket já existe na lista, ignorando duplicação"
          );
          return prevTickets;
        }

        const updatedTickets = [newTicket, ...prevTickets];
        const sortedTickets = sortTicketsByPriority(updatedTickets);
        console.log(
          "TicketList: Tickets após adicionar novo:",
          sortedTickets.length
        );
        return sortedTickets;
      });

      setHighlightedTicketId(newTicket.id);
      console.log("TicketList: Destacando ticket ID:", newTicket.id);
      setTimeout(() => {
        setHighlightedTicketId(null);
        console.log("TicketList: Removendo destaque do ticket");
      }, 3000); // Destaque por 3 segundos
    });

    console.log("TicketList: Listener configurado, função de cleanup criada");

    return () => {
      console.log("TicketList: Removendo listener de novos tickets");
      unsubscribe();
    };
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const searchMatch =
      searchTerm === "" ||
      ticket.customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.phone?.includes(searchTerm) ||
      ticket.customer.city?.toLowerCase().includes(searchTerm.toLowerCase());

    return searchMatch;
  });

  const groupTicketsByPriority = (tickets: Ticket[]) => {
    const groups: Record<TicketPriorityLevel, Ticket[]> = {
      [TicketPriorityLevel.CRITICAL]: [],
      [TicketPriorityLevel.HIGH]: [],
      [TicketPriorityLevel.MEDIUM]: [],
      [TicketPriorityLevel.LOW]: [],
    };

    tickets.forEach((ticket) => {
      // Se o ticket não tem priorityLevel definido, coloca no grupo LOW
      const priority = ticket.priorityLevel || TicketPriorityLevel.MEDIUM;
      groups[priority]?.push(ticket);
    });

    return groups;
  };

  const getPriorityLabel = (priority: TicketPriorityLevel): string => {
    switch (priority) {
      case TicketPriorityLevel.CRITICAL:
        return "🔴 Crítica";
      case TicketPriorityLevel.HIGH:
        return "🟠 Alta";
      case TicketPriorityLevel.MEDIUM:
        return "🟡 Média";
      case TicketPriorityLevel.LOW:
        return "🟢 Baixa";
      default:
        return "Média";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white-soft">
      {/* Nível 1: Header com elementos principais */}
      <div className="p-4 border-b border-white-warm bg-white-pure shadow-white-soft">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Atendimentos
          </h1>
        </div>

        <div className="flex justify-between items-center gap-4">
          <Input
            placeholder="Buscar mensagem ou contato"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white-soft border-white-warm focus:border-primary"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {}}
            disabled={isLoading}
            className="hover-brand-purple elevated-1"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-white-soft">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg elevated-1">
            {error}
            <Button
              variant="link"
              className="ml-2 text-red-700 hover:text-red-800"
              onClick={() => setError(null)}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}

      {/* Nível 1: Tabs */}
      <div className="bg-white-soft flex-1 flex flex-col">
        <Tabs value={selectedTab} defaultValue="ai" className="w-full p-2 flex-1 flex flex-col">
          <TabsList className="w-full bg-white-pure border border-white-warm shadow-white-soft">
            <TabsTrigger
              value={TicketStatus.IN_PROGRESS}
              onClick={() => setSelectedTab(TicketStatus.IN_PROGRESS)}
              className="data-[state=active]:bg-white-soft data-[state=active]:text-primary data-[state=active]:shadow-white-soft hover-brand-purple"
            >
              Abertos
            </TabsTrigger>
            <TabsTrigger
              value={TicketStatus.CLOSED}
              onClick={() => setSelectedTab(TicketStatus.CLOSED)}
              className="data-[state=active]:bg-white-soft data-[state=active]:text-primary data-[state=active]:shadow-white-soft hover-brand-purple"
            >
              Fechados
            </TabsTrigger>
            <TabsTrigger
              value={TicketStatus.AI}
              onClick={() => setSelectedTab(TicketStatus.AI)}
              className="data-[state=active]:bg-white-soft data-[state=active]:text-primary data-[state=active]:shadow-white-soft hover-brand-purple"
            >
              IA <Sparkles className="h-4 w-4 ml-1" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value={TicketStatus.AI} className="mt-4 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3 w-full px-2">
              {isLoading && tickets.length === 0 ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TicketCardSkeleton key={`ai-skeleton-${index}`} />
                ))
              ) : filteredTickets.length > 0 ? (
                (() => {
                  const aiTickets = filteredTickets.filter(
                    (ticket) => ticket.status === TicketStatus.AI
                  );
                  const sortedTickets = sortTicketsByLastMessage(aiTickets);

                  return (
                    <div className="space-y-3">
                      {sortedTickets.map((ticket) => (
                        <TicketCard
                          key={ticket.id}
                          ticket={ticket}
                          selected={selectedTicket?.id === ticket.id}
                          highlighted={highlightedTicketId === ticket.id}
                          onSelect={onTicketSelect}
                        />
                      ))}
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum ticket IA</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value={TicketStatus.IN_PROGRESS} className="mt-4 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3 w-full px-2">
              {isLoading && tickets.length === 0 ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TicketCardSkeleton key={`progress-skeleton-${index}`} />
                ))
              ) : filteredTickets.length > 0 ? (
                (() => {
                  const progressTickets = filteredTickets.filter(
                    (ticket) => ticket.status === TicketStatus.IN_PROGRESS
                  );
                  const groupedTickets =
                    groupTicketsByPriority(progressTickets);

                  return (
                    <div className="space-y-6">
                      {Object.entries(groupedTickets).map(
                        ([priority, tickets]) => {
                          if (tickets.length === 0) return null;

                          return (
                            <div key={priority} className="space-y-3">
                              <div className="flex items-center gap-2 px-2">
                                <h3 className="text-sm font-semibold text-muted-foreground">
                                  {getPriorityLabel(
                                    priority as TicketPriorityLevel
                                  )}
                                </h3>
                                <div className="flex-1 h-px bg-white-warm"></div>
                                <span className="text-xs text-muted-foreground">
                                  {tickets.length} ticket
                                  {tickets.length > 1 ? "s" : ""}
                                </span>
                              </div>
                              {tickets.map((ticket) => (
                                <TicketCard
                                  key={ticket.id}
                                  ticket={ticket}
                                  selected={selectedTicket?.id === ticket.id}
                                  highlighted={
                                    highlightedTicketId === ticket.id
                                  }
                                  onSelect={onTicketSelect}
                                />
                              ))}
                            </div>
                          );
                        }
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhum ticket em andamento
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value={TicketStatus.CLOSED} className="mt-4 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-3 w-full px-2">
              {isLoading && tickets.length === 0 ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TicketCardSkeleton key={`closed-skeleton-${index}`} />
                ))
              ) : filteredTickets.length > 0 ? (
                (() => {
                  const closedTickets = filteredTickets.filter(
                    (ticket) => ticket.status === TicketStatus.CLOSED
                  );
                  const sortedTickets = sortTicketsByLastMessage(closedTickets);

                  return (
                    <div className="space-y-3">
                      {sortedTickets.map((ticket) => (
                        <TicketCard
                          key={ticket.id}
                          ticket={ticket}
                          selected={selectedTicket?.id === ticket.id}
                          highlighted={highlightedTicketId === ticket.id}
                          onSelect={onTicketSelect}
                        />
                      ))}
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum ticket fechado</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="h-[73px] border-t border-white-warm bg-white-pure shadow-white-soft min-h-[57px] flex items-center justify-center">
        <Link href="/dashboard/tickets/list">
          <Button variant="link" className="text-primary hover:text-primary/80">
            Ver todos os atendimentos
          </Button>
        </Link>
      </div>
    </div>
  );
}
