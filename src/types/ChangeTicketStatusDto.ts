import { TicketPriorityLevel, TicketStatus } from "./chat";

export interface ChangeTicketStatusDto {
  status: TicketStatus;
  userId?: number;
  priorityLevel?: TicketPriorityLevel
}