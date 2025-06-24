import { Company } from "./companies";

export enum TicketStatus {
  AI = "AI",
  IN_PROGRESS = "IN_PROGRESS",
  CLOSED = "CLOSED",
}

export enum TicketPriorityLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface Customer {
  id: number;
  city: string;
  email: string;
  name: string;
  phone: string;
  avatar?: string;
  state: string;
  streetName: string;
  streetNumber: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Ticket {
  id: number;
  status: TicketStatus;
  priorityLevel: TicketPriorityLevel;
  areaId: number;
  closedAt: string;
  company: Company;
  channel: string;
  companyId: number;
  createdAt: string;
  customer: Customer;
  ticketMessages: Message[];
}

export interface Message {
  id?: number;
  senderIdentifier: string;
  ticketId: number;
  message: string;
  messageType: "TEXT" | "AUDIO";
  senderName?: string;
  senderType: "CUSTOMER" | "AI" | "USER";
  createdAt: Date;
}

export interface WebSocketEvents {
  new_message: {
    id?: number;
    ticketId: number;
    message: string;
    senderType: "CUSTOMER" | "AI" | "USER";
    senderIdentifier: string;
    messageType: "TEXT" | "AUDIO";
    senderName?: string;
    createdAt: Date;
  };
  ticket_updated: {
    ticketId: number;
    status: string;
    priority?: string;
    summary?: string;
    areaId?: number;
  };
  new_ticket: Ticket;
}
