"use client";

import { useEffect, useState, useCallback } from 'react';
import { Ticket, TicketPriority, SocialNetwork } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const socialIcons: Record<SocialNetwork, string> = {
  facebook: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+20.svg",
  instagram: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+21.svg",
  whatsapp: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+27.svg",
  tiktok: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+19.svg",
  telegram: "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+16.svg",
};

// Dados mockados
const mockTickets: Ticket[] = [
  {
    id: 1,
    status: 'in_progress',
    priority: TicketPriority.HIGH,
    summary: 'Cliente com problemas na integração do WhatsApp',
    created_at: new Date(2024, 2, 22, 14, 30).toISOString(),
    area_id: 1,
    source: 'whatsapp',
    customer: {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      avatar: 'https://avatar.vercel.sh/joao.png',
    },
  },
  {
    id: 2,
    status: 'open',
    priority: TicketPriority.MEDIUM,
    summary: 'Dúvida sobre plano Enterprise',
    created_at: new Date(2024, 2, 22, 10, 15).toISOString(),
    area_id: 2,
    source: 'instagram',
    customer: {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      avatar: 'https://avatar.vercel.sh/maria.png',
    },
  },
  {
    id: 3,
    status: 'closed',
    priority: TicketPriority.LOW,
    summary: 'Solicitação de material de marketing',
    created_at: new Date(2024, 2, 21, 16, 45).toISOString(),
    area_id: 3,
    source: 'facebook',
    customer: {
      id: 3,
      name: 'Pedro Oliveira',
      email: 'pedro@email.com',
      avatar: 'https://avatar.vercel.sh/pedro.png',
    },
  },
  {
    id: 4,
    status: 'in_progress',
    priority: TicketPriority.HIGH,
    summary: 'Erro crítico no sistema de pagamentos',
    created_at: new Date(2024, 2, 22, 9, 0).toISOString(),
    area_id: 1,
    source: 'telegram',
    customer: {
      id: 4,
      name: 'Ana Costa',
      email: 'ana@email.com',
      avatar: 'https://avatar.vercel.sh/ana.png',
    },
  },
  {
    id: 5,
    status: 'open',
    priority: TicketPriority.MEDIUM,
    summary: 'Configuração de webhook',
    created_at: new Date(2024, 2, 22, 11, 20).toISOString(),
    area_id: 2,
    source: 'tiktok',
    customer: {
      id: 5,
      name: 'Lucas Mendes',
      email: 'lucas@email.com',
      avatar: 'https://avatar.vercel.sh/lucas.png',
    },
  },
];

interface TicketListProps {
  onTicketSelect: (ticket: Ticket) => void;
  selectedTicket: Ticket | null;
}

export function TicketList({ onTicketSelect, selectedTicket }: TicketListProps) {
  const { loading: authLoading, error: authError } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as TicketPriority[],
    area: [] as number[]
  });

  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulando delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTickets(mockTickets);

      // Se não houver ticket selecionado, selecionar o primeiro da lista
      if (mockTickets.length > 0 && !selectedTicket) {
        onTicketSelect(mockTickets[0]);
      }
    } catch (error) {
      console.error('TicketList: Erro ao carregar tickets:', error);
      setError('Não foi possível carregar os tickets. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [onTicketSelect, selectedTicket]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const filteredTickets = tickets.filter(ticket => {
    const searchMatch = searchTerm === '' || 
      ticket.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch = filters.status.length === 0 || filters.status.includes(ticket.status);
    const priorityMatch = filters.priority.length === 0 || filters.priority.includes(ticket.priority);
    const areaMatch = filters.area.length === 0 || filters.area.includes(ticket.area_id);
    
    return searchMatch && statusMatch && priorityMatch && areaMatch;
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
          <p className="text-red-500 mb-4">
            {authError}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/sign-in'}
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
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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
                setFilters({ status: [], priority: [], area: [] });
                setSearchTerm('');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedTicket?.id === ticket.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onTicketSelect(ticket)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={ticket.customer.avatar} alt={ticket.customer.name} />
                        <AvatarFallback>
                          {ticket.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5">
                        <img
                          src={socialIcons[ticket.source]}
                          alt={ticket.source}
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{ticket.id}</Badge>
                        <Badge
                          variant={ticket.status === 'closed' ? 'secondary' : 'default'}
                          className="capitalize"
                        >
                          {ticket.status === 'in_progress' ? 'Em Andamento' : 
                           ticket.status === 'closed' ? 'Fechado' : 'Aberto'}
                        </Badge>
                        <Badge
                          variant={
                            ticket.priority === TicketPriority.HIGH ? 'destructive' :
                            ticket.priority === TicketPriority.MEDIUM ? 'secondary' :
                            'default'
                          }
                        >
                          {ticket.priority === TicketPriority.HIGH ? 'Alta' :
                           ticket.priority === TicketPriority.MEDIUM ? 'Média' :
                           'Baixa'}
                        </Badge>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm font-medium">{ticket.customer.name}</p>
                        <p className="text-sm text-gray-500">{ticket.customer.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(ticket.created_at).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="mt-2 pl-14">
                  <p className="text-gray-700">{ticket.summary}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 