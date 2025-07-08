import { Company } from "./company";
import { Customer } from "./customer";

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

export enum MessageType {
  TEXT = "TEXT",
  AUDIO = "AUDIO",
}

export enum SenderType {
  CUSTOMER = "CUSTOMER",
  AI = "AI",
  USER = "USER",
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
  ticketMessages: TicketMessage[];
}

export interface TicketMessage {
  id?: number;
  senderIdentifier: string;
  ticketId: number;
  message: string;
  messageType: MessageType;
  senderName?: string;
  senderType: SenderType;
  createdAt: Date;
}
