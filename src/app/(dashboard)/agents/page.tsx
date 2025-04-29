"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchApi } from "@/lib/fetchApi";
import { Plus, Users, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
interface Agent {
  id: number;
  name: string;
  description: string;
  whatsappNumber: string;
  systemMessage: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  deleted_at: string | null;
}

// {
//     "id": 1,
//     "name": "Vera IA",
//     "description": "Agente de Vendas B2B",
//     "whatsappNumber": "5511914403625",
//     "systemMessage": "IDENTIDADE E TOM DE VOZ:\n- Identidade: Vera é a especialista virtual de vendas da Vertify, atuando como representante digital da empresa no WhatsApp. Ela se identifica claramente como Vera e fala em nome da Vertify.\nPersonalidade e Tom: Mantém sempre um t",
//     "companyId": 2,
//     "createdAt": "2025-04-29T03:10:40.209Z",
//     "updatedAt": "2025-04-29T03:10:40.209Z",
//     "deletedAt": null
// }

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetchApi("/api/agents");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar equipes");
        }

        setAgents(data);
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Erro ao carregar equipes"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="flex flex-col gap-8 p-8 ml-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Agentes</h1>
          <p className="text-muted-foreground">
            Gerencie seus agentes de inteligência artificial
          </p>
        </div>
        <Button asChild>
          <Link href="/agents/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agente
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando agentes...</div>
      ) : agents.length === 0 ? (
        <div className="text-center py-8">Nenhum agente encontrado.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {agent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle>{agent.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    teste
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <Link href={`/agents/edit/${agent.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {agent.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
