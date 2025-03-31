import { io, Socket } from 'socket.io-client';
import { Message, Ticket, WebSocketEvents } from '@/types/chat';

type MessageCallback = (message: Message) => void;
type TicketCallback = (ticket: Ticket) => void;

class ChatService {
  private socket: Socket | null = null;
  private messageCallbacks: Set<MessageCallback> = new Set();
  private ticketCallbacks: Set<TicketCallback> = new Set();

  async initialize() {
    this.connect();
  }

  private getAuthToken(): string | null {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
    if (!authCookie) return null;
    return authCookie.split('=')[1].trim();
  }

  connect() {
    if (this.socket?.connected) return;

    const token = this.getAuthToken();
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    this.socket = io(process.env.NEXT_PUBLIC_API_URL, {
      auth: { token }
    });

    this.socket.on('new_message', (data: Message) => {
      this.messageCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('ticket_updated', (data: WebSocketEvents['ticket_updated']) => {
      this.ticketCallbacks.forEach(callback => callback({
        id: data.ticketId,
        status: 'open',
        priority: data.priority,
        summary: data.summary,
        area_id: data.areaId,
        created_at: new Date().toISOString(),
        customer: { id: 0, name: 'Cliente', email: 'cliente@email.com', avatar: undefined },
        source: 'whatsapp'
      }));
    });

    this.socket.on('connect', () => {
      console.log('Conectado ao WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado do WebSocket');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  async getMessages(ticketId: number): Promise<Message[]> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticketId}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar mensagens');
    }

    return response.json();
  }

  async sendMessage(ticketId: number, message: string): Promise<void> {
    if (!this.socket?.connected) {
      this.connect();
    }

    this.socket?.emit('send_message', {
      ticketId,
      message
    });
  }

  async getTickets(): Promise<Ticket[]> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Token não encontrado');

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar tickets');
    }

    return response.json();
  }

  onNewMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  onTicketUpdate(callback: TicketCallback): () => void {
    this.ticketCallbacks.add(callback);
    return () => this.ticketCallbacks.delete(callback);
  }

  onNewTicket(callback: TicketCallback): () => void {
    return this.onTicketUpdate(callback);
  }
}

export const chatService = new ChatService(); 