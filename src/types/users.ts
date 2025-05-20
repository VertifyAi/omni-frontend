export interface User {
  areaId: number;
  city: string;
  companyId: number;
  createdAt: string;
  email: string;
  id: number;
  name: string;
  phone: string;
  role: UserRole;
  state: string;
  streetName: string;
  streetNumber: string;
  updatedAt: string;
}

export enum UserRole {
  USER = "USER",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
}