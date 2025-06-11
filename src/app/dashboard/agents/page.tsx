"use client";

import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/fetchApi";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AgentCard } from "@/components/AgentCard";
import { Agent } from "@/types/agent";

export default function AgentsPage() {
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetchApi("/api/agents");
      
      if (!response.ok) {
        throw new Error("Erro ao carregar agentes");
      }
      
      const data = await response.json();
      setFilteredAgents(data);
    } catch (error) {
      console.error("Erro ao buscar agentes:", error);
      toast.error("Erro ao carregar agentes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando agentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 ml-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Agentes de IA
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus agentes de IA
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/teams/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agente
          </Link>
        </Button>
      </div>

      {/* Agents Grid */}
      {filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">
              Nenhum agente criado
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Comece criando seu primeiro agente de IA para automatizar o atendimento.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/agents/create">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Agente
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
            />
          ))}
        </div>
      )}
    </div>
  );
}
