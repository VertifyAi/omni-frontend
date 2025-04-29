export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  CANCELED = 'CANCELED',
}

export interface Company {
  city: string;
  email: string;
  id: number;
  name: string;
  phone: string;
  state: string;
  streetName: string;
  streetNumber: string;
  createdAt: string;
  updatedAt: string
  deletedAt?: string;
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
  areaId: number;
  closedAt: string;
  company: Company;
  channel: string
  companyId: number;
  createdAt: string;
  customer: Customer;
}