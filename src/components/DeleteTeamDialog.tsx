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
import { Team } from "@/app/dashboard/teams/page";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DeleteTeamDialogProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deletedTeamId: number) => void;
}

export function DeleteTeamDialog({ team, isOpen, onClose, onSuccess }: DeleteTeamDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!team) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetchApi(`/api/teams/${team.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao excluir equipe');
      }

      toast.success('Equipe excluída com sucesso!');
      onSuccess(team.id);
      onClose();
    } catch (error) {
      console.error('Erro ao excluir equipe:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erro ao excluir equipe'
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
                Excluir Equipe
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-muted-foreground leading-relaxed">
            {team ? (
              <>
                Tem certeza que deseja excluir a equipe <span className="font-semibold text-foreground">&ldquo;{team.name}&rdquo;</span>?
                <br /><br />
                Esta ação não pode ser desfeita. Todos os dados relacionados à equipe serão permanentemente removidos.
              </>
            ) : (
              'Carregando informações da equipe...'
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
            disabled={isDeleting || !team}
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
                Excluir Equipe
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 
