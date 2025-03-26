"use client";

import { useEffect, useState, useCallback } from "react";
import { IntegrationsService } from "@/services/integrations";
import { WhatsAppIntegration } from "@/types/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export function WhatsAppIntegrationComponent() {
  const [integration, setIntegration] = useState<WhatsAppIntegration | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const { toast } = useToast();

  const loadIntegration = useCallback(async () => {
    try {
      const data =
        await IntegrationsService.getInstance().getWhatsAppIntegration();
      setIntegration(data);
      if (data?.whatsapp_number) {
        setWhatsappNumber(data.whatsapp_number);
      }
    } catch (err) {
      console.error("Erro ao carregar integração:", err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a integração",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    loadIntegration();
  }, [loadIntegration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappNumber) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("Iniciando criação da integração...");
      const data =
        await IntegrationsService.getInstance().createWhatsAppIntegration({
          whatsapp_number: whatsappNumber,
        });
      console.log("Integração criada com sucesso:", data);
      setIntegration(data);
      toast({
        title: "Sucesso",
        description: "Integração criada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao criar integração:", error);
      if (error instanceof Error) {
        if (error.message === "Token não encontrado") {
          toast({
            title: "Erro de autenticação",
            description: "Você precisa estar logado para criar uma integração",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro",
            description: error.message || "Não foi possível criar a integração",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível criar a integração",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await IntegrationsService.getInstance().deleteWhatsAppIntegration();
      setIntegration(null);
      setWhatsappNumber("");
      toast({
        title: "Sucesso",
        description: "Integração removida com sucesso",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível remover a integração",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Integração WhatsApp</h2>
          <p className="text-muted-foreground">
            Configure sua integração com o WhatsApp para enviar e receber
            mensagens.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Integração WhatsApp</h2>
        <p className="text-muted-foreground">
          Configure sua integração com o WhatsApp para enviar e receber
          mensagens.
        </p>
      </div>

      {integration ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">
                Número: {integration.whatsapp_number}
              </h3>
              <p className="text-sm text-muted-foreground">
                Status: {integration.status}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Remover Integração
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">Número do WhatsApp</Label>
            <Input
              id="whatsapp"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Digite o número do WhatsApp (ex: 5511999999999)"
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            Criar Integração
          </Button>
        </form>
      )}
    </div>
  );
}
