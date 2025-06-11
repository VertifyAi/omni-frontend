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
import { Agent } from "@/types/agent";

interface DeleteAgentDialogProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (deletedAgentId: number) => void | undefined;
}

export function DeleteAgentDialog({
  agent,
  isOpen,
  onClose,
  onSuccess,
}: DeleteAgentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!agent) return;

    setIsDeleting(true);

    try {
      const response = await fetchApi(`/api/agents/${agent.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao excluir agente");
      }

      toast.success("Agente excluído com sucesso!");
      onSuccess?.(agent.id);
      onClose();
    } catch (error) {
      console.error("Erro ao excluir agente:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao excluir agente"
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
                Excluir Agente
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-muted-foreground leading-relaxed">
            {agent ? (
              <>
                Tem certeza que deseja excluir o agente{" "}
                <span className="font-semibold text-foreground">
                  &ldquo;{agent.name}&rdquo;
                </span>
                ?
                <br />
                <br />
                Esta ação não pode ser desfeita. Todos os dados relacionados à
                agente serão permanentemente removidos.
              </>
            ) : (
              "Carregando informações do agente..."
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
            disabled={isDeleting || !agent}
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
                Excluir Agente
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
