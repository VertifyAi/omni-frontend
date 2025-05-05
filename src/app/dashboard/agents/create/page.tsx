"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { fetchApi } from "@/lib/fetchApi";
import { formatWhatsAppNumber } from "@/lib/utils";

const createAgentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  whatsappNumber: z.string().min(1, "Número de WhatsApp é obrigatório."),
  systemMessage: z.string().min(1, "System Prompt é obrigatório."),
});

type CreateAgentFormData = z.infer<typeof createAgentSchema>;

export default function CreateAgentPage() {
  const router = useRouter();
  const params = useParams();
  const form = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: "",
      description: "",
      whatsappNumber: "",
      systemMessage: "",
    },
  });

  const onSubmit = async (data: CreateAgentFormData) => {
    try {
      const response = await fetchApi(`/api/agents/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Erro ao atualizar agente");
      }

      toast.success("Agente atualizado com sucesso!");
      router.push("/dashboard/agents");
    } catch (error) {
      console.error("Erro ao atualizar agente:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="container p-8 ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar Agente</h1>
        <p className="text-muted-foreground mt-2">
          Preencha os dados abaixo para criar um agente de IA.
        </p>
      </div>

      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Agente</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Agente de Vendas"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o propósito deste agente..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsappNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de WhatsApp</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o número de WhatsApp..."
                      value={formatWhatsAppNumber(field.value)}
                      onChange={(e) => {
                        // Remove todos os caracteres não numéricos
                        const numbers = e.target.value.replace(/\D/g, '');
                        // Garante que começa com 55
                        const cleanNumber = numbers.startsWith('55') ? numbers : `55${numbers}`;
                        field.onChange(cleanNumber);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite o System Prompt..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit">
                {"Salvar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/agents")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
