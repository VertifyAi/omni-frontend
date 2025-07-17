export interface Agent {
  id: number;
  name: string;
  description: string;
  whatsappNumber: string;
  systemMessage?: string;
  companyId?: number;
  createdAt: string;
  updatedAt?: string;
  deleted_at?: string | null;
  imageUrl?: string;
}

export interface AgentCardProps {
  agent: Agent;
  onDeleteSuccess?: (agentId: number) => void | undefined;
}

export type AgentTone = "casual" | "formal" | "informal";

export type AgentObjective = "screening" | "sales" | "support";

export type AgentSegment =
  | "technology"
  | "finance"
  | "health"
  | "education"
  | "other";
