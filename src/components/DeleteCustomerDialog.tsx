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
import { Customer } from "@/types/customer";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DeleteCustomerDialogProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deletedCustomerId: number) => void;
}

export function DeleteCustomerDialog({ customer, isOpen, onClose, onSuccess }: DeleteCustomerDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!customer) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetchApi(`/api/customers/${customer.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erro ao excluir contato');
      }

      toast.success('Contato excluído com sucesso!');
      onSuccess(customer.id);
      onClose();
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erro ao excluir contato'
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
                Excluir Contato
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-muted-foreground leading-relaxed">
            {customer ? (
              <>
                Tem certeza que deseja excluir o contato <span className="font-semibold text-foreground">&ldquo;{customer.name}&rdquo;</span>?
                <br /><br />
                <span className="font-medium text-red-600">⚠️ ATENÇÃO:</span> Esta ação não pode ser desfeita. Todos os dados relacionados ao contato serão permanentemente removidos, incluindo:
                <br />
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li><span className="font-medium">Todos os atendimentos</span> deste contato</li>
                  <li>Histórico completo de mensagens e conversas</li>
                  <li>Dados pessoais e informações de contato</li>
                </ul>
              </>
            ) : (
              'Carregando informações do contato...'
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
            disabled={isDeleting || !customer}
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
                Excluir Contato
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 