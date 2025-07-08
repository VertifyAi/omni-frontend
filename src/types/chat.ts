import { Ticket, TicketMessage } from "./ticket";

export interface WebSocketEvents {
  new_message: TicketMessage;
  ticket_updated: {
    ticketId: number;
    status: string;
    priority?: string;
    summary?: string;
    areaId?: number;
  };
  new_ticket: Ticket;
}
