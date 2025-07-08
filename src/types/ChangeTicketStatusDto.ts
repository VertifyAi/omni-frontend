import { TicketPriorityLevel, TicketStatus } from "./ticket";

export interface ChangeTicketStatusDto {
  status: TicketStatus;
  userId?: number;
  priorityLevel?: TicketPriorityLevel
}