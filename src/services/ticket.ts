import { Ticket, TicketPriority } from '@/types/chat';

class TicketService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async getTicket(ticketId: number): Promise<Ticket> {
    try {
      console.log('TicketService: Buscando ticket', ticketId);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${this.apiUrl}/tickets/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar ticket: ${response.status}`);
      }

      const ticket = await response.json();
      console.log('TicketService: Ticket carregado:', ticket);
      return ticket;
    } catch (error) {
      console.error('TicketService: Erro ao buscar ticket:', error);
      throw error;
    }
  }

  async updateTicket(ticketId: number, data: Partial<Ticket>): Promise<Ticket> {
    try {
      console.log('TicketService: Atualizando ticket', ticketId, data);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await fetch(`${this.apiUrl}/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Erro ao atualizar ticket: ${response.status}`);
      }

      const updatedTicket = await response.json();
      console.log('TicketService: Ticket atualizado:', updatedTicket);
      return updatedTicket;
    } catch (error) {
      console.error('TicketService: Erro ao atualizar ticket:', error);
      throw error;
    }
  }

  async updateTicketPriority(ticketId: number, priority: TicketPriority): Promise<Ticket> {
    return this.updateTicket(ticketId, { priority });
  }

  async updateTicketStatus(ticketId: number, status: 'open' | 'in_progress' | 'closed'): Promise<Ticket> {
    return this.updateTicket(ticketId, { status });
  }

  async updateTicketArea(ticketId: number, areaId: number): Promise<Ticket> {
    return this.updateTicket(ticketId, { area_id: areaId });
  }

  async updateTicketSummary(ticketId: number, summary: string): Promise<Ticket> {
    return this.updateTicket(ticketId, { summary });
  }
}

export const ticketService = new TicketService(); 