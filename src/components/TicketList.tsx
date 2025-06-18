"use client";

import { useEffect, useState, useCallback } from "react";
import { Ticket, TicketStatus } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/fetchApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chatService } from "@/services/chat";
import { TicketCard } from "./TicketCard";
import "../app/globals.css";

interface TicketListProps {
  onTicketSelect: (ticket: Ticket) => void;
  selectedTicket: Ticket | null;
  setSelectedTab: (tab: TicketStatus) => void;
  selectedTab: TicketStatus;
}

export function TicketList({
  onTicketSelect,
  selectedTicket,
  setSelectedTab,
  selectedTab,
}: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedTicketId, setHighlightedTicketId] = useState<number | null>(
    null
  );

  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchApi("/api/tickets");
      let ticket = await result.json();

      ticket = ticket.sort((a: Ticket, b: Ticket) => {
        const dateA = new Date(
          a.ticketMessages.at(-1)?.createdAt || 0
        ).getTime();
        const dateB = new Date(
          b.ticketMessages.at(-1)?.createdAt || 0
        ).getTime();
        return dateB - dateA;
      });

      setTickets(ticket);

      if (ticket.length > 0 && !selectedTicket) {
        onTicketSelect(ticket[0]);
      }
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
        const ticketExists = prevTickets.some(ticket => ticket.id === newTicket.id);
        if (ticketExists) {
          console.log("TicketList: Ticket já existe na lista, ignorando duplicação");
          return prevTickets;
        }
        
        const updatedTickets = [newTicket, ...prevTickets];
        const sortedTickets = updatedTickets.sort((a, b) => {
          const dateA = new Date(
            a.ticketMessages.at(-1)?.createdAt || 0
          ).getTime();
          const dateB = new Date(
            b.ticketMessages.at(-1)?.createdAt || 0
          ).getTime();
          return dateB - dateA;
        });
        console.log("TicketList: Tickets após adicionar novo:", sortedTickets.length);
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
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    return searchMatch;
  });

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
      <div className="bg-white-soft">
        <Tabs value={selectedTab} defaultValue="ai" className="w-full p-2">
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
          
          <TabsContent value={TicketStatus.AI} className="mt-4">
            <div className="flex flex-col gap-3 w-full px-2">
              {filteredTickets.length > 0 ? (
                filteredTickets
                  .filter((ticket) => ticket.status === TicketStatus.AI)
                  .map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      selected={selectedTicket?.id === ticket.id}
                      highlighted={highlightedTicketId === ticket.id}
                      onSelect={onTicketSelect}
                    />
                  ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-muted-foreground">Nenhum ticket IA</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value={TicketStatus.IN_PROGRESS} className="mt-4">
            <div className="flex flex-col gap-3 w-full px-2">
              {filteredTickets.length > 0 ? (
                filteredTickets
                  .filter(
                    (ticket) => ticket.status === TicketStatus.IN_PROGRESS
                  )
                  .map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      selected={selectedTicket?.id === ticket.id}
                      highlighted={highlightedTicketId === ticket.id}
                      onSelect={onTicketSelect}
                    />
                  ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-muted-foreground">Nenhum ticket em andamento</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value={TicketStatus.CLOSED} className="mt-4">
            <div className="flex flex-col gap-3 w-full px-2">
              {filteredTickets.length > 0 ? (
                filteredTickets
                  .filter((ticket) => ticket.status === TicketStatus.CLOSED)
                  .map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      selected={selectedTicket?.id === ticket.id}
                      highlighted={highlightedTicketId === ticket.id}
                      onSelect={onTicketSelect}
                    />
                  ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground">Nenhum ticket fechado</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
