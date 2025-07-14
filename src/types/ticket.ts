import { Area, Company } from "./company";
import { Customer } from "./customer";
import { User } from "./users";

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
  OMNIFY = "OMNIFY",
}

export interface Ticket {
  id: number;
  status: TicketStatus;
  priorityLevel: TicketPriorityLevel;
  company: Company;
  channel: string;
  customer: Customer;
  ticketMessages: TicketMessage[];
  agentId?: number;
  userId?: number;
  areaId?: number;
  companyId: number;
  createdAt: string;
  closedAt: string;
  area: Area;
  user: User
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

export interface TransferTicketDto {
  userId?: number;
  areaId?: number;
  teamId?: number;
  agentId?: number;
  priorityLevel?: TicketPriorityLevel;
  closeTicket?: boolean;
}
