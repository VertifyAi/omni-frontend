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
import { Badge } from "@/components/ui/badge";
import { fetchApi } from "@/lib/fetchApi";
import { Plus, Workflow, Edit, Trash2, Calendar, Eye, GitBranch, Bot, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WorkflowDetailsPanel } from "@/components/WorkflowDetailsPanel";
import { DeleteWorkflowDialog } from "@/components/DeleteWorkflowDialog";

interface WorkflowChannel {
  id: number;
  workflowId: number;
  integrationId: number;
  channelIdentifier: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface WorkflowAgent {
  id: number;
  name: string;
  tone: string;
  objective: string;
  segment: string;
  description: string;
  presentationExample: string;
  llmAssistantId: string;
  companyId: number;
  workflowId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface FlowData {
  nodes: Array<{
    id: string;
    type: string;
    data: Record<string, unknown>;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
}

interface WorkflowData {
  id: number;
  name: string;
  description?: string;
  flowData: FlowData;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  workflowChannels: WorkflowChannel[];
  workflowUser: Record<string, unknown> | null;
  workflowAgent: WorkflowAgent | null;
  workflowTeam: Record<string, unknown> | null;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<WorkflowData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleDeleteSuccess = (deletedWorkflowId: number) => {
    setWorkflows(workflows.filter((workflow) => workflow.id !== deletedWorkflowId));
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await fetchApi("/api/workflows");
      if (!response.ok) {
        throw new Error("Erro ao carregar workflows");
      }
      const data = await response.json();
      setWorkflows(data);
    } catch (error) {
      console.error("Erro ao buscar workflows:", error);
      toast.error("Erro ao carregar workflows");
    } finally {
      setLoading(false);
    }
  };

  const openWorkflowPanel = (workflow: WorkflowData) => {
    setSelectedWorkflow(workflow);
    setIsPanelOpen(true);
  };

  const closeWorkflowPanel = () => {
    setIsPanelOpen(false);
    setSelectedWorkflow(null);
  };

  const openDeleteDialog = (workflow: WorkflowData) => {
    setWorkflowToDelete(workflow);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setWorkflowToDelete(null);
  };

  return (
    <div className="flex flex-col gap-8 p-8 ml-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Fluxos de Atendimento
          </h1>
          <p className="text-muted-foreground">
            Configure e gerencie os fluxos de roteamento dos seus canais de atendimento
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/workflows/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Workflow
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
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Skeleton className="h-3 w-12" />
                        </Badge>
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
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        disabled
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 min-h-12 flex flex-col gap-1">
                  <span className="font-bold">Descrição:</span>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-32" />
                </p>
                
                <div className="mb-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-3 w-16 mt-1" />
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : workflows.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Workflow className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">
              Nenhum workflow criado
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Comece criando seu primeiro fluxo de atendimento para automatizar o roteamento dos seus canais.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/workflows/create">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Workflow
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => {
            const isActive = workflow.deletedAt === null && workflow.workflowChannels.length > 0;
            const nodesCount = workflow.flowData?.nodes?.length || 0;
            const connectionsCount = workflow.flowData?.edges?.length || 0;
            const channelsCount = workflow.workflowChannels?.length || 0;
            
            return (
              <Card key={workflow.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <Workflow className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{workflow.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                      <Badge 
                        variant={isActive ? 'default' : 'secondary'}
                            className="text-xs"
                      >
                        {isActive ? '🟢 Ativo' : '🔴 Inativo'}
                      </Badge>
                        </CardDescription>
                    </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => openWorkflowPanel(workflow)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                          className="cursor-pointer"
                          onClick={() =>
                            router.push(`/dashboard/workflows/create?edit=${workflow.id}`)
                          }
                        >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                          className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => openDeleteDialog(workflow)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 min-h-12 flex flex-col gap-1">
                    <span className="font-bold">Descrição:</span>
                    {workflow.description && workflow.description.length > 60
                      ? `${workflow.description.substring(0, 60)}...`
                      : workflow.description || "Nenhuma descrição disponível."}
                  </p>
                  
                  {/* Agent Info */}
                  {workflow.workflowAgent && (
                    <div className="mb-3 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <Bot className="h-3 w-3 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-700">
                          {workflow.workflowAgent.name}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-600 mt-1">
                        {workflow.workflowAgent.objective === 'screening' ? 'Triagem' : 
                         workflow.workflowAgent.objective === 'sales' ? 'Vendas' :
                         workflow.workflowAgent.objective === 'support' ? 'Suporte' : 
                         workflow.workflowAgent.objective}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                      <span>{nodesCount} nós</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                      <span>{connectionsCount} conexões</span>
                      </div>
                      <span>{channelsCount} {channelsCount === 1 ? 'canal' : 'canais'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(workflow.updatedAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Workflow Details Panel */}
      <WorkflowDetailsPanel
        workflow={selectedWorkflow}
        isOpen={isPanelOpen}
        onClose={closeWorkflowPanel}
      />

      {/* Delete Workflow Dialog */}
      <DeleteWorkflowDialog
        workflow={workflowToDelete}
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
