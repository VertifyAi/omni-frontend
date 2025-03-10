export interface Message {
  ticketId: string;
  message: string;
  sender: 'customer' | 'agent';
  createdAt: Date;
} 