import { Ticket } from "./ticket";

export interface Customer {
  id: number;
  city?: string;
  email?: string;
  name: string;
  phone?: string;
  companyId: number;
  state?: string;
  streetName?: string;
  streetNumber?: string;
  profilePicture?: string;
  tickets?: Ticket[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}
