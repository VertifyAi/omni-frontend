import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Camera, Users } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb, Copy, Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { AgentTone, AgentObjective, AgentSegment } from "@/types/agent";

type FormData = {
  name: string;
  tone: AgentTone;
  objective: AgentObjective;
  segment: AgentSegment;
  description: string;
  presentation_example: string;
  products_or_services_knowledge_base?: {
    name: string;
    description: string;
    ctaType: string;
    ctaLink: string;
    amount?: number;
  }[];
  interaction_example?: {
    question: string;
    answer: string;
    reasoning: string;
  }[];
  teams_to_redirect?: number[];
};
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateAgentStep1Props {
  form: UseFormReturn<FormData>;
  selectedImage: File | null;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  promptDialogOpen: boolean;
  setPromptDialogOpen: (open: boolean) => void;
  copiedPrompt: string | null;
  handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePromptSelect: (prompt: string) => void;
  handleCopyPrompt: (prompt: string, title: string) => void;
}

const promptSuggestions = {
  triagem: [
    {
      title: "Triagem Geral Software",
      description:
        "Para classificar e direcionar consultas de clientes de software",
      prompt: `Você é um agente de triagem para a [Nome da empresa], responsável pela avaliação inicial e direcionamento das consultas dos clientes em vários contextos de negócios relacionados a uma empresa de software.`,
    },
    {
      title: "Triagem para E-commerce",
      description: "Especializada em lojas online",
      prompt: `Você é um agente de triagem para a [Nome da empresa], especializado em e-commerce e vendas online.
  
  Suas funções:
  • Identificar se o cliente quer comprar, trocar, devolver ou obter suporte
  • Coletar dados do pedido quando necessário
  • Verificar status de entregas
  • Direcionar dúvidas técnicas para suporte especializado
  • Qualificar interesse em novos produtos
  
  Seja eficiente e sempre ofereça soluções rápidas para questões comuns.`,
    },
    {
      title: "Triagem para Serviços B2B",
      description: "Para empresas que atendem outras empresas",
      prompt: `Você é um agente de triagem para a [Nome da empresa], focado em atendimento B2B e soluções empresariais.
  
  Suas responsabilidades:
  • Identificar o porte da empresa cliente (micro, pequena, média, grande)
  • Coletar informações sobre necessidades específicas
  • Agendar reuniões comerciais quando apropriado
  • Direcionar para consultores especializados
  • Qualificar orçamento e timing de decisão
  
  Mantenha uma abordagem consultiva e profissional.`,
    },
  ],
  vendas: [
    {
      title: "Vendedor Consultivo",
      description: "Para vendas complexas que precisam de consultoria",
      prompt: `Você é um consultor de vendas da [Nome da empresa], especializado em entender necessidades e apresentar soluções personalizadas.
  
  Sua abordagem:
  • Faça perguntas qualificadoras para entender a situação atual
  • Identifique dores e necessidades específicas
  • Apresente benefícios relevantes para cada situação
  • Use técnicas de venda consultiva (SPIN, BANT)
  • Gere urgência de forma natural
  • Sempre conduza para o fechamento
  
  Foque em valor, não em preço. Seja um consultor, não apenas um vendedor.`,
    },
    {
      title: "Vendedor de Produtos Digitais",
      description: "Para software, cursos, assinaturas",
      prompt: `Você é um especialista em vendas digitais da [Nome da empresa], focado em converter leads em assinantes/compradores.
  
  Suas técnicas:
  • Demonstre valor imediato do produto
  • Use social proof e depoimentos
  • Ofereça trials e demonstrações
  • Crie senso de urgência com ofertas limitadas
  • Supere objeções comuns sobre ROI
  • Conduza para ação imediata (trial, demo, compra)
  
  Seja direto, mostre resultados concretos e sempre peça a venda.`,
    },
    {
      title: "Vendedor de Alto Ticket",
      description: "Para produtos/serviços de valor elevado",
      prompt: `Você é um especialista em vendas de alto valor da [Nome da empresa], trabalhando com produtos/serviços premium.
  
  Sua estratégia:
  • Qualifique rigorosamente o poder de compra
  • Construa relacionamento e confiança
  • Apresente ROI e casos de sucesso detalhados
  • Negocie termos e condições especiais
  • Envolva tomadores de decisão
  • Acompanhe todo o processo de vendas
  
  Foque em valor premium, exclusividade e resultados transformadores.`,
    },
  ],
  atendimento: [
    {
      title: "Suporte Técnico Geral",
      description: "Para resolver problemas e dúvidas técnicas",
      prompt: `Você é um agente de suporte técnico da [Nome da empresa], especializado em resolver problemas de forma rápida e eficiente.
  
  Sua metodologia:
  • Identifique claramente o problema relatado
  • Colete informações técnicas necessárias
  • Ofereça soluções passo a passo
  • Confirme se o problema foi resolvido
  • Documente casos para futura referência
  • Escale para níveis superiores quando necessário
  
  Seja paciente, didático e sempre confirme o entendimento do cliente.`,
    },
    {
      title: "Atendimento Pós-Venda",
      description: "Para clientes que já compraram",
      prompt: `Você é um especialista em relacionamento pós-venda da [Nome da empresa], focado na satisfação e retenção de clientes.
  
  Suas prioridades:
  • Garantir satisfação total com a compra
  • Resolver rapidamente qualquer insatisfação
  • Educar sobre uso correto do produto/serviço
  • Identificar oportunidades de upsell/cross-sell
  • Coletar feedback para melhorias
  • Transformar clientes em promotores da marca
  
  Seja proativo, empático e sempre busque a excelência na experiência.`,
    },
    {
      title: "Atendimento de Retenção",
      description: "Para evitar cancelamentos e churn",
      prompt: `Você é um especialista em retenção da [Nome da empresa], focado em manter clientes satisfeitos e evitar cancelamentos.
  
  Sua abordagem:
  • Identifique motivos reais para insatisfação
  • Ofereça soluções personalizadas para cada situação
  • Negocie condições especiais quando apropriado
  • Eduque sobre recursos subutilizados
  • Conecte com valor contínuo do produto/serviço
  • Acompanhe progresso pós-intervenção
  
  Seja empático, flexível e sempre busque uma solução win-win.`,
    },
  ],
};
export default function CreateAgentStep1({
  form,
  imagePreview,
  fileInputRef,
  promptDialogOpen,
  setPromptDialogOpen,
  copiedPrompt,
  handleImageSelect,
  handlePromptSelect,
  handleCopyPrompt,
}: CreateAgentStep1Props) {
  return (
    <>
      {/* Input de Imagem */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <div
            className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Preview da equipe"
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Users className="w-8 h-8 mb-2" />
                <span className="text-xs text-center">
                  Foto do
                  <br />
                  Agente
                </span>
              </div>
            )}
          </div>

          {/* Botão de câmera */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        <p className="text-sm text-muted-foreground mt-2 text-center">
          Clique para adicionar uma foto do agente
          <br />
          <span className="text-xs">Máximo 5MB • JPG, PNG, JPEG</span>
        </p>
      </div>

      <div className="flex justify-between gap-4 mb-2">
        <div className="w-1/2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Agente</FormLabel>
                <FormControl>
                  <Input
                    className="h-10 bg-white-soft"
                    placeholder="Ex: Agente de Vendas"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 w-1/2">
          <div className="w-full">
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Tom de voz</FormLabel>
                  <FormControl>
                    <Tabs
                      defaultValue="casual"
                      onValueChange={field.onChange}
                      className="w-full"
                    >
                      <TabsList className="w-full">
                        <TabsTrigger value="casual">👱‍♂️ Casual</TabsTrigger>
                        <TabsTrigger value="formal">🧑‍💻 Formal</TabsTrigger>
                        <TabsTrigger value="informal">
                          🦸‍♂️ Descontraído
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4 mb-2">
        <div className="flex gap-4 w-1/2">
          <div className="w-full">
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Objetivo Principal</FormLabel>
                  <FormControl>
                    <Tabs
                      defaultValue="triage"
                      onValueChange={field.onChange}
                      className="w-full"
                    >
                      <TabsList className="w-full">
                        <TabsTrigger value="triage">🚦 Triagem</TabsTrigger>
                        <TabsTrigger value="sales">💰 Vendas</TabsTrigger>
                        <TabsTrigger value="support">📞 Suporte</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-4 w-1/2">
          <div className="w-full">
            <FormField
              control={form.control}
              name="segment"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Segmento</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-white-soft">
                        <SelectValue placeholder="Selecione um segmento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Tecnologia</SelectItem>
                        <SelectItem value="finance">
                          Serviços Financeiros
                        </SelectItem>
                        <SelectItem value="retail">Varejo</SelectItem>
                        <SelectItem value="industry">Indústria</SelectItem>
                        <SelectItem value="education">Educação</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              Descrição
              <Dialog
                open={promptDialogOpen}
                onOpenChange={setPromptDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs bg-white-soft"
                  >
                    <Lightbulb className="w-3 h-3 mr-1" />
                    Ver Sugestões
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Sugestões de Prompts para Agentes</DialogTitle>
                    <DialogDescription>
                      Escolha um prompt base para seu agente. Você pode
                      personalizar depois.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Triagem */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          Triagem
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Para qualificar e direcionar clientes
                        </span>
                      </div>
                      <div className="grid gap-3">
                        {promptSuggestions.triagem.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">
                                  {suggestion.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {suggestion.description}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleCopyPrompt(
                                      suggestion.prompt,
                                      suggestion.title
                                    )
                                  }
                                >
                                  {copiedPrompt === suggestion.title ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() =>
                                    handlePromptSelect(suggestion.prompt)
                                  }
                                >
                                  Usar
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded max-h-20 overflow-hidden">
                              {suggestion.prompt.substring(0, 150)}...
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vendas */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Vendas
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Para converter leads em clientes
                        </span>
                      </div>
                      <div className="grid gap-3">
                        {promptSuggestions.vendas.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">
                                  {suggestion.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {suggestion.description}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleCopyPrompt(
                                      suggestion.prompt,
                                      suggestion.title
                                    )
                                  }
                                >
                                  {copiedPrompt === suggestion.title ? (
                                    <Check className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() =>
                                    handlePromptSelect(suggestion.prompt)
                                  }
                                >
                                  Usar
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded max-h-20 overflow-hidden">
                              {suggestion.prompt.substring(0, 150)}...
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Atendimento */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800"
                        >
                          Atendimento
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Para suporte e relacionamento
                        </span>
                      </div>
                      <div className="grid gap-3">
                        {promptSuggestions.atendimento.map(
                          (suggestion, index) => (
                            <div
                              key={index}
                              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium">
                                    {suggestion.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {suggestion.description}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleCopyPrompt(
                                        suggestion.prompt,
                                        suggestion.title
                                      )
                                    }
                                  >
                                    {copiedPrompt === suggestion.title ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() =>
                                      handlePromptSelect(suggestion.prompt)
                                    }
                                  >
                                    Usar
                                  </Button>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground bg-muted p-2 rounded max-h-20 overflow-hidden">
                                {suggestion.prompt.substring(0, 150)}...
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva o propósito deste agente..."
                className="min-h-[200px] bg-white-soft"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
