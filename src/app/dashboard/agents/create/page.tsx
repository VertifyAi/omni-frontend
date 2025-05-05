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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { fetchApi } from "@/lib/fetchApi";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Integration, IntegrationType } from "@/types/integrations";

const socialIcons: Record<string, string> = {
  facebook:
    "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+20.svg",
  instagram:
    "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+21.svg",
  whatsapp:
    "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+27.svg",
  tiktok:
    "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+19.svg",
  telegram:
    "https://vertify-public-assets.s3.us-east-2.amazonaws.com/social-media/Ativo+16.svg",
};

const createAgentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  channel: z.enum(Object.values(IntegrationType) as [string, ...string[]], {
    errorMap: () => ({ message: "Canal de comunicação é obrigatório." }),
  }),
  whatsappNumber: z.string().min(1, "Número de WhatsApp é obrigatório."),
  systemMessage: z.string().min(1, "System Prompt é obrigatório."),
});

type CreateAgentFormData = z.infer<typeof createAgentSchema>;

export default function CreateAgentPage() {
  const router = useRouter();
  const params = useParams();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const form = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: "",
      description: "",
      whatsappNumber: "",
      systemMessage: "",
    },
  });
  const selectedChannel = form.watch("channel");

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

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const response = await fetchApi(`/api/integrations`);
        const integrations = await response.json();

        if (!response.ok) {
          throw new Error(integrations.message || "Erro ao buscar integrações");
        }

        setIntegrations(integrations);
      } catch (error) {
        console.error("Erro ao buscar agente:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };

    fetchAgentData();
  }, [params.id, form]);

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
                    <Input placeholder="Ex: Agente de Vendas" {...field} />
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

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Canal de comunicação</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um canal de comunicação" />
                        </SelectTrigger>
                        <SelectContent>
                          {integrations.map((integration) => (
                            <SelectItem
                              key={integration.id}
                              value={integration.type}
                            >
                              {integration.type ===
                                IntegrationType.WHATSAPP && (
                                <div className="flex items-center gap-6">
                                  <Image
                                    src={
                                      socialIcons[
                                        IntegrationType.WHATSAPP.toLowerCase()
                                      ]
                                    }
                                    alt={integration.type}
                                    width={24}
                                    height={24}
                                  />
                                  Whatsapp
                                </div>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedChannel === IntegrationType.WHATSAPP && (
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Número de WhatsApp</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um canal de comunicação" />
                          </SelectTrigger>
                          <SelectContent>
                            {integrations.map((integration) => (
                              <SelectItem
                                key={integration.id}
                                value={integration.type}
                              >
                                {integration.type ===
                                  IntegrationType.WHATSAPP && (
                                  <div className="flex items-center gap-6">
                                    <Image
                                      src={
                                        socialIcons[
                                          IntegrationType.WHATSAPP.toLowerCase()
                                        ]
                                      }
                                      alt={integration.type}
                                      width={24}
                                      height={24}
                                    />
                                    Whatsapp
                                  </div>
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

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
              <Button type="submit">{"Salvar"}</Button>
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
