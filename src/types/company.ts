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

export interface Area {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  companyId: number;
  ownerId: number;
  workflowId?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}