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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Integration,
  IntegrationType,
  PhoneNumber,
} from "@/types/integrations";

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
  template: z.string().min(1, "Template é obrigatório."),
  answers: z.array(
    z.object({
      question: z.string().min(1, "Pergunta é obrigatória"),
      answer: z.string().min(1, "Resposta é obrigatória"),
    })
  ),
});

type CreateAgentFormData = z.infer<typeof createAgentSchema>;

export default function CreateAgentPage() {
  const router = useRouter();
  const params = useParams();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isLoadingPhones, setIsLoadingPhones] = useState(false);
  const [step, setStep] = useState(3);
  const form = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: "",
      description: "",
      whatsappNumber: "",
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
    const fetchIntegrationsData = async () => {
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

    fetchIntegrationsData();
  }, [params.id, form]);

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        setIsLoadingPhones(true);
        const response = await fetchApi(
          `/api/integrations/whatsapp/phone_numbers`
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Erro ao buscar números de WhatsApp"
          );
        }

        setPhoneNumbers(result);
        if (result.length > 0) {
          form.setValue("whatsappNumber", result[0].id);
        }
      } catch (error) {
        console.error("Erro ao buscar números:", error);
        if (error instanceof Error) toast.error(error.message);
      } finally {
        setIsLoadingPhones(false);
      }
    };

    if (selectedChannel === IntegrationType.WHATSAPP) {
      fetchPhoneNumbers();
    }
  }, [selectedChannel, form]);

  const handleStep = () => {
    switch (step) {
      case 1:
        return (
          <>
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
                          <SelectTrigger disabled={isLoadingPhones}>
                            <SelectValue
                              placeholder={
                                isLoadingPhones
                                  ? "Carregando números..."
                                  : "Selecione um número"
                              }
                            />
                          </SelectTrigger>

                          <SelectContent>
                            {phoneNumbers.map((phone) => (
                              <SelectItem key={phone.id} value={phone.id}>
                                {phone.verified_name} -{" "}
                                {phone.display_phone_number}
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
          </>
        );
      case 2:
        return (
          <div className="">
            <h2 className="text-2xl font-bold">Escolha um template</h2>

            <div className="flex flex-wrap gap-16 mt-4 w-full">
              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>Suporte Técnico</CardTitle>
                  <CardDescription>
                    Agente IA conversacional para suporte técnico.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <img
                      src="https://vertify-public-assets.s3.us-east-2.amazonaws.com/website-assets/ChatGPT+Image+May+5%2C+2025%2C+05_05_32+PM.png"
                      alt=""
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button className="w-full">Selecionar</Button>
                </CardFooter>
              </Card>

              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>Vendas Inbound</CardTitle>
                  <CardDescription>
                    Agente IA conversacional para vendas inbound.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center gap-4">
                    <img
                      src="https://vertify-public-assets.s3.us-east-2.amazonaws.com/website-assets/May+5%2C+2025%2C+05_07_28+PM.png"
                      alt=""
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button className="w-full">Selecionar</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        );
      case 3:
        return (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Qual produto ou serviço você oferece suporte?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Sistema de atendimento Vertify, utilizado por pequenas e médias empresas para centralizar conversas de WhatsApp, Instagram e Messenger."
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Como o cliente final geralmente utiliza esse produto?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Os usuários usam o sistema diariamente para conversar com seus clientes, criar tickets e automatizar o atendimento com IA."
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Quais são os problemas mais comuns relatados pelos seus
                    clientes?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Dificuldade para acessar a conta, mensagens não aparecendo no painel, falhas na integração com o WhatsApp Business."
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Como você costuma resolver esses problemas?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Acesso ao painel de administração, verificação de token expirado, orientação para reconectar o canal no painel."
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Existe algum passo a passo que o agente pode seguir para
                    resolver esses problemas?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Acesso ao painel de administração, verificação de token expirado, orientação para reconectar o canal no painel."
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Você tem links úteis, tutoriais ou documentos que o agente
                    pode compartilhar?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Sim, temos vídeos tutoriais no YouTube e artigos no nosso help center: https://ajuda.vertify.com.br"
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    O que o agente não deve fazer ou responder?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: O agente não deve realizar testes no lugar do cliente, confirmar pagamentos ou acessar dados sensíveis."
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Qual é o tom de voz desejado para o agente?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Profissional e empático, com foco em clareza e resolução rápida."
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Qual é o horário de atendimento da sua equipe humana?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: De segunda a sexta, das 09h às 18h. Fora desse horário, o agente pode avisar que a equipe retornará assim que possível."
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    O que o agente deve fazer se não conseguir ajudar?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: De segunda a sexta, das 09h às 18h. Fora desse horário, o agente pode avisar que a equipe retornará assim que possível."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      default:
        setStep(1);
    }
  };

  return (
    <div className="container p-8 ml-16 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar Agente</h1>
        <p className="text-muted-foreground mt-2">
          Preencha os dados abaixo para criar um agente de IA.
        </p>
      </div>

      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {handleStep()}
            <div className="flex gap-4">
              {step >= 1 && step < 4 ? (
                <Button
                  type="button"
                  onClick={() => setStep((prev) => prev + 1)}
                >
                  {"Próximo"}
                </Button>
              ) : (
                <Button type="submit">{"Salvar"}</Button>
              )}
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep((prev) => prev - 1)}
                >
                  {"Voltar"}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/agents")}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
