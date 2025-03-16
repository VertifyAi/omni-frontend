"use client";

import { useEffect, useState } from 'react';
import { Ticket, TicketPriority } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import { chatService } from '@/services/chat';
import { useAuth } from '@/hooks/useAuth';

interface TicketListProps {
  onTicketSelect: (ticket: Ticket) => void;
  selectedTicket: Ticket | null;
}

export function TicketList({ onTicketSelect, selectedTicket }: TicketListProps) {
  const { loading: authLoading, error: authError } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as TicketPriority[],
    area: [] as number[]
  });

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedTickets = await chatService.getTickets();
      setTickets(loadedTickets);

      // Se não houver ticket selecionado, selecionar o primeiro da lista
      if (loadedTickets.length > 0 && !selectedTicket) {
        onTicketSelect(loadedTickets[0]);
      }
    } catch (error) {
      console.error('TicketList: Erro ao carregar tickets:', error);
      setError('Não foi possível carregar os tickets. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        await chatService.initialize();
        await loadTickets();

        // Configurar listener para novos tickets
        const unsubscribe = chatService.onNewTicket((newTicket) => {
          setTickets(prev => [...prev, newTicket]);
        });

        return () => {
          unsubscribe();
          chatService.disconnect();
        };
      } catch (error) {
        console.error('TicketList: Erro ao inicializar chat:', error);
        setError('Não foi possível conectar ao serviço de chat. Tente novamente.');
      }
    };

    if (!authLoading && !authError) {
      initializeChat();
    }
  }, [authLoading, authError]);

  const toggleFilter = (type: 'status' | 'priority' | 'area', value: string | TicketPriority | number) => {
    setFilters(prev => {
      const currentValues = prev[type] as Array<typeof value>;
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [type]: newValues };
    });
  };

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filters.status.length === 0 || filters.status.includes(ticket.status);
    const priorityMatch = filters.priority.length === 0 || filters.priority.includes(ticket.priority);
    const areaMatch = filters.area.length === 0 || filters.area.includes(ticket.area_id);
    return statusMatch && priorityMatch && areaMatch;
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
        
        <div className="flex flex-wrap gap-2">
          <div>
            <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
            <Badge
              variant={filters.status.includes('open') ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleFilter('status', 'open')}
            >
              Aberto
            </Badge>
            <Badge
              variant={filters.status.includes('in_progress') ? 'default' : 'outline'}
              className="cursor-pointer ml-1"
              onClick={() => toggleFilter('status', 'in_progress')}
            >
              Em Andamento
            </Badge>
            <Badge
              variant={filters.status.includes('closed') ? 'default' : 'outline'}
              className="cursor-pointer ml-1"
              onClick={() => toggleFilter('status', 'closed')}
            >
              Fechado
            </Badge>
          </div>

          <div className="ml-4">
            <span className="text-sm font-medium text-gray-700 mr-2">Prioridade:</span>
            <Badge
              variant={filters.priority.includes(TicketPriority.HIGH) ? 'destructive' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleFilter('priority', TicketPriority.HIGH)}
            >
              Alta
            </Badge>
            <Badge
              variant={filters.priority.includes(TicketPriority.MEDIUM) ? 'secondary' : 'outline'}
              className="cursor-pointer ml-1"
              onClick={() => toggleFilter('priority', TicketPriority.MEDIUM)}
            >
              Média
            </Badge>
            <Badge
              variant={filters.priority.includes(TicketPriority.LOW) ? 'default' : 'outline'}
              className="cursor-pointer ml-1"
              onClick={() => toggleFilter('priority', TicketPriority.LOW)}
            >
              Baixa
            </Badge>
          </div>
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
              onClick={() => setFilters({ status: [], priority: [], area: [] })}
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
                <p className="mt-2 text-gray-700">{ticket.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 