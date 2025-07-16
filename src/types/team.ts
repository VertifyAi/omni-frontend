import { Company } from "./company";
import { User } from "./users";

export interface Team {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  companyId: number;
  ownerId: number;
  workflowId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  owner: User;
  members: User[];
  company: Company;
}
