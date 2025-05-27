export interface Company {
  id: number;
  name: string;
  email: string;
  streetName: string;
  streetNumber: string;
  city: string;
  state: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}