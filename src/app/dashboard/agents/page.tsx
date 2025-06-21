"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/fetchApi";
import { Plus, Bot, Pencil, Trash, Eye, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Agent } from "@/types/agent";
import { AgentDetailsPanel } from "@/components/AgentDetailsPanel";
import { DeleteAgentDialog } from "@/components/DeleteAgentDialog";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleDeleteSuccess = (deletedAgentId: number) => {
    setAgents(agents.filter((agent) => agent.id !== deletedAgentId));
  };

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
      setAgents(data);
    } catch (error) {
      console.error("Erro ao buscar agentes:", error);
      toast.error("Erro ao carregar agentes");
    } finally {
      setLoading(false);
    }
  };

  const openAgentPanel = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsPanelOpen(true);
  };

  const closeAgentPanel = () => {
    setIsPanelOpen(false);
    setSelectedAgent(null);
  };

  const openDeleteDialog = (agent: Agent) => {
    setAgentToDelete(agent);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setAgentToDelete(null);
  };

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
          <Link href="/dashboard/agents/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agente
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <Skeleton className="h-12 w-12" />
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        <Skeleton className="h-4 w-24" />
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Bot className="h-3 w-3" />
                        <Skeleton className="h-4 w-16" />
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        disabled
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <span className="font-bold">WhatsApp: </span>
                  <Skeleton className="h-4 w-32" />
                </p>
                <p className="text-sm text-muted-foreground mb-2 min-h-24 flex flex-col gap-2">
                  <span className="font-bold">Descrição: </span>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                </p>
                <div className="text-sm text-muted-foreground flex flex-col gap-2">
                  <span className="font-bold">Data de Criação:</span>
                  <Skeleton className="h-4 w-40" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : agents.length === 0 ? (
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={agent.imageUrl} />
                  <AvatarFallback>
                    {agent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{agent.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Bot className="h-3 w-3" />
                        Agente Virtual
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => openAgentPanel(agent)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/dashboard/agents/${agent.id}`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => openDeleteDialog(agent)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <span className="font-bold">WhatsApp: </span>
                  <Phone className="h-3 w-3" />
                  {agent.whatsappNumber}
                </p>
                <p className="text-sm text-muted-foreground mb-2 min-h-24 flex flex-col gap-2">
                  <span className="font-bold">Descrição: </span>
                  {agent.description.length > 80
                    ? `${agent.description.substring(0, 80)}...`
                    : agent.description}
                </p>
                <div className="text-sm text-muted-foreground flex flex-col gap-1">
                  {agent.createdAt && (
                    <>
                      <span className="font-bold">Data de Criação:</span>
                      <span>
                        {new Date(agent.createdAt).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Agent Details Panel */}
      <AgentDetailsPanel
        agent={selectedAgent}
        isOpen={isPanelOpen}
        onClose={closeAgentPanel}
      />

      {/* Delete Agent Dialog */}
      <DeleteAgentDialog
        agent={agentToDelete}
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
