"use client";

import React, { useState } from 'react';
import { Ticket, TicketPriority } from '@/types/chat';
import { ticketService } from '@/services/ticket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface TicketDetailsProps {
  ticket: Ticket;
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState(ticket.summary);
  const [isEditingSummary, setIsEditingSummary] = useState(false);

  const handleSummaryUpdate = async () => {
    if (summary === ticket.summary || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);
      await ticketService.updateTicketSummary(ticket.id, summary);
      setIsEditingSummary(false);
    } catch (error) {
      console.error('Erro ao atualizar resumo:', error);
      setError('Não foi possível atualizar o resumo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriorityChange = async (priority: TicketPriority) => {
    try {
      setIsLoading(true);
      setError(null);
      await ticketService.updateTicketPriority(ticket.id, priority);
    } catch (error) {
      console.error('Erro ao atualizar prioridade:', error);
      setError('Não foi possível atualizar a prioridade. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: 'open' | 'in_progress' | 'closed') => {
    try {
      setIsLoading(true);
      setError(null);
      await ticketService.updateTicketStatus(ticket.id, status);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setError('Não foi possível atualizar o status. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAreaChange = async (areaId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await ticketService.updateTicketArea(ticket.id, Number(areaId));
    } catch (error) {
      console.error('Erro ao atualizar área:', error);
      setError('Não foi possível atualizar a área. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 space-y-4">
      {error && (
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
      )}

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
          Criado em {formatDate(ticket.created_at)}
        </div>
      </div>

      <div className="space-y-2">
        {isEditingSummary ? (
          <div className="flex gap-2">
            <Input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Resumo do ticket"
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSummaryUpdate}
              disabled={isLoading || summary === ticket.summary}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Salvar'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingSummary(false);
                setSummary(ticket.summary);
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{summary}</h2>
            <Button
              variant="ghost"
              onClick={() => setIsEditingSummary(true)}
              disabled={isLoading}
            >
              Editar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select
            value={ticket.status}
            onValueChange={handleStatusChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Prioridade</label>
          <Select
            value={ticket.priority}
            onValueChange={handlePriorityChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TicketPriority.LOW}>Baixa</SelectItem>
              <SelectItem value={TicketPriority.MEDIUM}>Média</SelectItem>
              <SelectItem value={TicketPriority.HIGH}>Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Área</label>
          <Select
            value={String(ticket.area_id)}
            onValueChange={handleAreaChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Suporte</SelectItem>
              <SelectItem value="2">Vendas</SelectItem>
              <SelectItem value="3">Financeiro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 