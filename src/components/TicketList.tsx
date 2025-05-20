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
    const unsubscribe = chatService.onNewTicket((newTicket) => {
      console.log("Novo ticket recebido:", newTicket);

      setTickets((prevTickets) => {
        const updatedTickets = [newTicket, ...prevTickets];
        return updatedTickets.sort((a, b) => {
          const dateA = new Date(
            a.ticketMessages.at(-1)?.createdAt || 0
          ).getTime();
          const dateB = new Date(
            b.ticketMessages.at(-1)?.createdAt || 0
          ).getTime();
          return dateB - dateA;
        });
      });

      setHighlightedTicketId(newTicket.id);
      setTimeout(() => setHighlightedTicketId(null), 3000); // Destaque por 3 segundos
    });

    return () => {
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
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Atendimentos</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadTickets}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <div className="flex justify-between items-center gap-4">
          <Input
            placeholder="Buscar mensagem ou contato"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {}}
            disabled={isLoading}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
            <Button
              variant="link"
              className="ml-2 text-red-700"
              onClick={() => setError(null)}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}

      <div>
        <Tabs value={selectedTab} defaultValue="ai" className="w-full p-2">
          <TabsList className="w-full">
            <TabsTrigger
              value={TicketStatus.IN_PROGRESS}
              onClick={() => setSelectedTab(TicketStatus.IN_PROGRESS)}
            >
              Abertos
            </TabsTrigger>
            <TabsTrigger
              value={TicketStatus.CLOSED}
              onClick={() => setSelectedTab(TicketStatus.CLOSED)}
            >
              Fechados
            </TabsTrigger>
            <TabsTrigger
              value={TicketStatus.AI}
              onClick={() => setSelectedTab(TicketStatus.AI)}
            >
              IA <Sparkles className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value={TicketStatus.AI}>
            <div className="flex flex-col gap-4 w-full">
              {filteredTickets
                .filter((ticket) => ticket.status === TicketStatus.AI)
                .map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    selected={selectedTicket?.id === ticket.id}
                    highlighted={highlightedTicketId === ticket.id}
                    onSelect={onTicketSelect}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value={TicketStatus.IN_PROGRESS}>
            <div className="flex flex-col gap-4 w-full">
              {filteredTickets
                .filter((ticket) => ticket.status === TicketStatus.IN_PROGRESS)
                .map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    selected={selectedTicket?.id === ticket.id}
                    highlighted={highlightedTicketId === ticket.id}
                    onSelect={onTicketSelect}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value={TicketStatus.CLOSED}>
            <div className="flex flex-col gap-4 w-full">
              {filteredTickets
                .filter((ticket) => ticket.status === TicketStatus.CLOSED)
                .map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    selected={selectedTicket?.id === ticket.id}
                    highlighted={highlightedTicketId === ticket.id}
                    onSelect={onTicketSelect}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
