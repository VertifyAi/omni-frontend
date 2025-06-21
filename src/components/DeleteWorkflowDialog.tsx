"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fetchApi } from "@/lib/fetchApi";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

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

interface DeleteWorkflowDialogProps {
  workflow: WorkflowData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (deletedWorkflowId: number) => void | undefined;
}

export function DeleteWorkflowDialog({
  workflow,
  isOpen,
  onClose,
  onSuccess,
}: DeleteWorkflowDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!workflow) return;

    setIsDeleting(true);

    try {
      const response = await fetchApi(`/api/workflows/${workflow.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao excluir workflow");
      }

      toast.success("Workflow excluído com sucesso!");
      onSuccess?.(workflow.id);
      onClose();
    } catch (error) {
      console.error("Erro ao excluir workflow:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao excluir workflow"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white-pure border border-white-warm shadow-white-elevated">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-semibold text-foreground">
                Excluir Workflow
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-muted-foreground leading-relaxed">
            {workflow ? (
              <>
                Tem certeza que deseja excluir o workflow{" "}
                <span className="font-semibold text-foreground">
                  &ldquo;{workflow.name}&rdquo;
                </span>
                ?
                <br />
                <br />
                Esta ação não pode ser desfeita. Todos os dados relacionados ao
                workflow serão permanentemente removidos, incluindo suas conexões
                com canais e configurações de fluxo.
              </>
            ) : (
              "Carregando informações do workflow..."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isDeleting}
            className="hover:bg-white-soft"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || !workflow}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Excluindo...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Excluir Workflow
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 