export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export type SocialNetwork = 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'telegram';

export interface Customer {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Ticket {
  id: number;
  status: 'open' | 'in_progress' | 'closed';
  priority: TicketPriority;
  summary: string;
  created_at: string;
  area_id: number;
  customer: Customer;
  source: SocialNetwork;
}

export interface Message {
  ticketId: number;
  message: string;
  sender: 'CUSTOMER' | 'AGENT';
  createdAt: Date;
}

export interface WebSocketEvents {
  'new_message': Message;
  'ticket_updated': {
    ticketId: number;
    priority: TicketPriority;
    summary: string;
    areaId: number;
  };
}

export interface TicketFilters {
  status?: string[];
  priority?: TicketPriority[];
  area?: number[];
} 