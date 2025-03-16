export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Ticket {
  id: number;
  status: 'open' | 'in_progress' | 'closed';
  priority: TicketPriority;
  summary: string;
  triaged: boolean;
  customer_phone_id: number;
  company_id: number;
  area_id: number;
  user_id?: number;
  created_at: Date;
  updated_at: Date;
  closed_at?: Date;
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