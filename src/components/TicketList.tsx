"use client";

import { useEffect, useState, useCallback } from "react";
import { Ticket, TicketStatus } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { fetchApi } from "@/lib/fetchApi";
import { formatPhoneNumber } from "@/lib/utils";

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

interface TicketListProps {
  onTicketSelect: (ticket: Ticket) => void;
  selectedTicket: Ticket | null;
}

export function TicketList({
  onTicketSelect,
  selectedTicket,
}: TicketListProps) {
  const { loading: authLoading, error: authError } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: [] as string[],
    area: [] as number[],
  });

  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchApi("/api/tickets");
      const ticket = await result.json();
      console.log(ticket)
      setTickets(ticket);

      // Se não houver ticket selecionado, selecionar o primeiro da lista
      if (tickets.length > 0 && !selectedTicket) {
        onTicketSelect(tickets[0]);
      }
    } catch (error) {
      console.error("TicketList: Erro ao carregar tickets:", error);
      setError("Não foi possível carregar os tickets. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [onTicketSelect, selectedTicket]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const filteredTickets = tickets.filter((ticket) => {
    const searchMatch =
      searchTerm === "" ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch =
      filters.status.length === 0 || filters.status.includes(ticket.status);
    const areaMatch =
      filters.area.length === 0 || filters.area.includes(ticket.areaId);

    return searchMatch && statusMatch && areaMatch;
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-4">{authError}</p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/sign-in")}
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

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

      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Nenhum ticket encontrado.</p>
            <Button
              variant="link"
              className="mt-2"
              onClick={() => {
                setFilters({ status: [], area: [] });
                setSearchTerm("");
              }}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTicket?.id === ticket.id
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onTicketSelect(ticket)}
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
                    <div className="">
                      <p className="text-sm font-medium">
                        {ticket.customer.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatPhoneNumber(ticket.customer.phone)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex flex-col gap-2 items-end">
                    {new Date(ticket.createdAt).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <Badge
                      variant={
                        ticket.status === TicketStatus.CLOSED
                          ? "secondary"
                          : "default"
                      }
                      className="capitalize w-12 text-xs"
                    >
                      {ticket.status === TicketStatus.IN_PROGRESS
                        ? "Em Andamento"
                        : ticket.status === TicketStatus.CLOSED
                        ? "Fechado"
                        : "Aberto"}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-700">TEste</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
