"use client";

import { Button } from "@/components/ui/button";
import { Plus, Workflow, Edit, Trash2, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WorkflowData {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  nodesCount?: number;
  connectionsCount?: number;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      // Temporariamente usando dados mock até a API estar disponível
      const mockWorkflows: WorkflowData[] = [
        {
          id: 1,
          name: "Atendimento WhatsApp Principal",
          description: "Fluxo principal de atendimento via WhatsApp com triagem automática",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodesCount: 5,
          connectionsCount: 4
        },
        {
          id: 2,
          name: "Suporte Técnico",
          description: "Direcionamento de tickets de suporte para equipe especializada",
          status: "inactive",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodesCount: 3,
          connectionsCount: 2
        }
      ];
      
      setTimeout(() => {
        setWorkflows(mockWorkflows);
        setLoading(false);
      }, 500);
      
      // Quando a API estiver disponível, use:
      // const response = await fetchApi("/api/workflows");
      // if (!response.ok) {
      //   throw new Error("Erro ao carregar workflows");
      // }
      // const data = await response.json();
      // setWorkflows(data);
    } catch (error) {
      console.error("Erro ao buscar workflows:", error);
      toast.error("Erro ao carregar workflows");
      setLoading(false);
    }
  };

  const handleDeleteWorkflow = async (workflowId: number) => {
    try {
      // Implementar quando a API estiver disponível
      // const response = await fetchApi(`/api/workflows/${workflowId}`, {
      //   method: 'DELETE'
      // });
      // if (!response.ok) {
      //   throw new Error("Erro ao excluir workflow");
      // }
      
      setWorkflows(prev => prev.filter(w => w.id !== workflowId));
      toast.success("Workflow excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir workflow:", error);
      toast.error("Erro ao excluir workflow");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando workflows...</p>
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

      {/* Workflows Grid */}
      {workflows.length === 0 ? (
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Workflow className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <Badge 
                      variant={workflow.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs mt-1"
                    >
                      {workflow.status === 'active' ? '🟢 Ativo' : '🔴 Inativo'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    asChild
                  >
                    <Link href={`/dashboard/workflows/create?edit=${workflow.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2 mb-4">
                  {workflow.description || "Nenhuma descrição disponível."}
                </CardDescription>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{workflow.nodesCount || 0} nós</span>
                    <span>{workflow.connectionsCount || 0} conexões</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(workflow.updatedAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
