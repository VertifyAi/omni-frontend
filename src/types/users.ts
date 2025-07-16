import { Company } from "./company";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  streetName: string;
  streetNumber: string;
  city: string;
  state: string;
  phone: string;
  profilePictureUrl: string;
  areaId: number;
  companyId: number;
  company: Company;
  createdAt?: string;
  updatedAt?: string;
}

export enum UserRole {
  USER = "USER",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
}