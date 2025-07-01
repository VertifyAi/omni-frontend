"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchApi } from "@/lib/fetchApi";
import { useEffect, useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, FileText, X } from "lucide-react";
import { Team } from "../../teams/page";
import { TeamCard } from "@/components/TeamCard";
import CreateAgentStep1 from "@/components/CreateAgentStep1";
import { setMixpanelTrack } from "@/lib/mixpanelClient";

const createAgentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  tone: z.enum(["casual", "formal", "informal"]),
  objective: z.enum(["screening", "sales", "support"]),
  segment: z.enum(["technology", "finance", "health", "education", "other"]),
  description: z.string().min(1, "Descrição é obrigatória"),
  teams_to_redirect: z.array(z.number()).optional(),
  interaction_example: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
        reasoning: z.string(),
      })
    )
    .optional(),
  presentation_example: z
    .string()
    .min(1, "Exemplo de apresentação é obrigatório"),
  products_or_services_knowledge_base: z
    .array(
      z.object({
        name: z.string(),
        amount: z.number().optional(),
        description: z.string(),
        ctaType: z.string(),
        ctaLink: z.string(),
      })
    )
    .optional(),
});

type CreateAgentFormData = z.infer<typeof createAgentSchema>;

// Tipo para produto/serviço
type ProductService = {
  name: string;
  description: string;
  value?: string;
  ctaType?: string;
  ctaLink?: string;
};

export default function CreateAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);

  // Estados para produtos/serviços
  const [products, setProducts] = useState<ProductService[]>([]);
  const [newProduct, setNewProduct] = useState<ProductService>({
    name: "",
    description: "",
    value: "",
    ctaType: "",
    ctaLink: "",
  });

  // Estados para upload de PDFs (base de conhecimento)
  const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Estados para exemplos de interação
  const [greetingExample, setGreetingExample] = useState<string>("");
  const [interactionExamples, setInteractionExamples] = useState<
    Array<{
      question: string;
      reasoning: string;
      response: string;
    }>
  >([]);
  const [newExample, setNewExample] = useState({
    question: "",
    reasoning: "",
    response: "",
  });

  // Estado para equipes selecionadas (sincronizado com o form)
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const form = useForm<CreateAgentFormData>({
    resolver: zodResolver(createAgentSchema),
    defaultValues: {
      name: "",
      tone: "casual",
      objective: "screening",
      segment: "technology",
      description: "",
      presentation_example: "",
      products_or_services_knowledge_base: [],
      interaction_example: [],
      teams_to_redirect: [],
    },
  });

  const onSubmit = async (data: CreateAgentFormData) => {
    try {
      // Preparar payload com dados do formulário e estados
      const payload = {
        name: data.name,
        tone: data.tone,
        objective: data.objective,
        segment: data.segment,
        description: data.description,
        presentation_example: greetingExample || data.presentation_example,
        teams_to_redirect: selectedTeams,
        interaction_example: interactionExamples.map((example) => ({
          question: example.question,
          answer: example.response,
          reasoning: example.reasoning,
        })),
        products_or_services_knowledge_base: products.map((product) => ({
          name: product.name,
          description: product.description,
          amount: product.value
            ? parseFloat(
                product.value.replace(/[R$\s.]/g, "").replace(",", ".")
              )
            : undefined,
          cta_type: product.ctaType || "",
          cta_url: product.ctaLink || "",
        })),
      };

      console.log("payload", payload);

      const response = await fetchApi("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Erro ao criar agente");
      }

      if (selectedImage) {
        await uploadTeamImage(responseData.id);
      }

      setMixpanelTrack("agent_created", {
        event_id: "agent_created",
        properties: {
          agent: responseData.agent,
          timestamp: new Date().toISOString(),
        },
      });

      toast.success("Agente criado com sucesso!");
      router.push("/dashboard/agents");
    } catch (error) {
      console.error("Erro ao criar agente:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleStep = () => {
    switch (step) {
      case 1:
        return (
          <CreateAgentStep1
            form={form}
            selectedImage={selectedImage}
            imagePreview={imagePreview}
            fileInputRef={fileInputRef}
            promptDialogOpen={promptDialogOpen}
            setPromptDialogOpen={setPromptDialogOpen}
            copiedPrompt={copiedPrompt}
            handleImageSelect={handleImageSelect}
            handlePromptSelect={handlePromptSelect}
            handleCopyPrompt={handleCopyPrompt}
          />
        );
      case 2:
        const currentObjective = form.watch("objective");

        if (currentObjective === "screening") {
          return (
            <div className="">
              <h2 className="text-2xl font-bold text-center">
                Escolha as equipes que o agente irá redirecionar os atendimentos
              </h2>

              {/* Mostrar erro de equipes se houver */}
              {form.formState.errors.teams_to_redirect && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="text-red-600 text-sm font-medium">
                    {form.formState.errors.teams_to_redirect.message}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap mt-4 gap-4 w-full">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    toSelectTeam={true}
                    isSelected={selectedTeams.includes(team.id)}
                    onToggleSelection={(teamId) => {
                      const newSelectedTeams = selectedTeams.includes(teamId)
                        ? selectedTeams.filter((id) => id !== teamId)
                        : [...selectedTeams, teamId];

                      setSelectedTeams(newSelectedTeams);
                      form.setValue("teams_to_redirect", newSelectedTeams);

                      // Limpar erro de teams_to_redirect se houver
                      if (form.formState.errors.teams_to_redirect) {
                        form.clearErrors("teams_to_redirect");
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          );
        } else if (currentObjective === "sales") {
          return (
            <div className="overflow-y-hidden">
              <h2 className="text-2xl font-bold mb-2 text-center">
                Cadastre os produtos ou serviços
              </h2>
              <p className="text-muted-foreground mb-6 text-center">
                Adicione os produtos ou serviços que este agente irá vender
              </p>

              {/* Mostrar erro de produtos se houver */}
              {form.formState.errors.products_or_services_knowledge_base && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 text-sm font-medium">
                    {
                      form.formState.errors.products_or_services_knowledge_base
                        .message
                    }
                  </p>
                </div>
              )}

              {/* Formulário para adicionar produto/serviço */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Adicionar Produto/Serviço
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nome do Produto/Serviço *
                    </label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      placeholder="Ex: Consultoria em Marketing Digital"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Valor (opcional)
                    </label>
                    <Input
                      value={newProduct.value}
                      onChange={(e) => handleValueChange(e.target.value)}
                      placeholder="R$ 0,00"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Descrição *
                  </label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    placeholder="Descreva detalhadamente o produto ou serviço..."
                    className="bg-white min-h-[100px]"
                  />
                </div>

                {/* CTA para cada produto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Call-to-Action (CTA)
                    </label>
                    <Select
                      value={newProduct.ctaType}
                      onValueChange={(value) =>
                        setNewProduct({
                          ...newProduct,
                          ctaType: value,
                          ctaLink: "",
                        })
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione o tipo de CTA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="link">
                          🔗 Link personalizado
                        </SelectItem>
                        <SelectItem value="calendar" disabled>
                          📅 Agendamento Google Calendar (em breve)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newProduct.ctaType === "link" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Link de redirecionamento
                      </label>
                      <Input
                        value={newProduct.ctaLink}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            ctaLink: e.target.value,
                          })
                        }
                        placeholder="https://exemplo.com/checkout"
                        className="bg-white"
                      />
                    </div>
                  )}
                </div>

                {newProduct.ctaType === "calendar" && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ A integração com Google Calendar estará disponível em
                      breve.
                    </p>
                  </div>
                )}

                <Button onClick={addProduct} className="w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto/Serviço
                </Button>
              </div>

              {/* Lista de produtos/serviços adicionados */}
              {products.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Produtos/Serviços Cadastrados ({products.length})
                  </h3>

                  <div className="space-y-4">
                    {products.map((product, index) => (
                      <div
                        key={index}
                        className="bg-white border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">
                                {product.name}
                              </h4>
                              {product.value && (
                                <Badge variant="secondary">
                                  {product.value}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">
                              {product.description}
                            </p>

                            {/* Mostrar CTA do produto */}
                            {product.ctaType && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-medium text-blue-600">
                                  CTA:
                                </span>
                                {product.ctaType === "link" &&
                                product.ctaLink ? (
                                  <a
                                    href={product.ctaLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline truncate max-w-xs"
                                  >
                                    🔗 {product.ctaLink}
                                  </a>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    📅 Google Calendar
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {products.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum produto/serviço cadastrado ainda.</p>
                  <p className="text-sm">
                    Adicione pelo menos um produto ou serviço para continuar.
                  </p>
                </div>
              )}
            </div>
          );
        } else if (currentObjective === "support") {
          return (
            <div className="">
              <h2 className="text-2xl font-bold mb-2 text-center">
                Exemplos de Interação
              </h2>
              <p className="text-muted-foreground mb-6 text-center">
                Ensine ao agente como se comportar através de exemplos práticos
              </p>

              {/* Explicação sobre exemplos de interação */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  🎯 Como funcionam os Exemplos de Interação?
                </h3>
                <p className="text-green-800 text-sm mb-4">
                  Os exemplos que você criar servem como treinamento para o
                  agente entender como deve se comportar, raciocinar e responder
                  em diferentes situações. Quanto mais específicos e variados os
                  exemplos, melhor será o desempenho do agente.
                </p>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">
                    💡 Dicas para criar bons exemplos:
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>
                      • <strong>Seja específico:</strong> Use situações reais
                      que acontecem no seu negócio
                    </li>
                    <li>
                      • <strong>Varie os cenários:</strong> Inclua casos
                      simples, complexos e edge cases
                    </li>
                    <li>
                      • <strong>Mostre o raciocínio:</strong> Explique o
                      &quot;porquê&quot; da resposta
                    </li>
                    <li>
                      • <strong>Mantenha o tom:</strong> Use a linguagem e
                      estilo da sua marca
                    </li>
                    <li>
                      • <strong>Seja completo:</strong> Inclua saudação inicial
                      e exemplos variados
                    </li>
                  </ul>
                </div>
              </div>

              {/* Exemplo de início de interação */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  👋 Como o agente deve se apresentar?
                </h3>
                <label className="block text-sm font-medium mb-2">
                  Exemplo de apresentação inicial
                </label>
                <Textarea
                  value={greetingExample}
                  onChange={(e) => setGreetingExample(e.target.value)}
                  placeholder="Ex: Olá! Sou o assistente virtual da [Empresa]. Como posso ajudá-lo hoje? Se você tiver dúvidas sobre nossos produtos ou precisar de suporte técnico, estou aqui para ajudar!"
                  className="bg-white min-h-[80px]"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Esta será a primeira mensagem que o agente enviará ao iniciar
                  uma conversa
                </p>
              </div>

              {/* Formulário para adicionar exemplo de interação */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Adicionar Exemplo de Interação
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pergunta do Cliente *
                    </label>
                    <Input
                      value={newExample.question}
                      onChange={(e) =>
                        setNewExample({
                          ...newExample,
                          question: e.target.value,
                        })
                      }
                      placeholder="Ex: Como faço para resetar minha senha?"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Raciocínio do Agente *
                    </label>
                    <Textarea
                      value={newExample.reasoning}
                      onChange={(e) =>
                        setNewExample({
                          ...newExample,
                          reasoning: e.target.value,
                        })
                      }
                      placeholder="Ex: O cliente quer resetar a senha. Preciso orientá-lo sobre o processo passo a passo e verificar se ele tem acesso ao email cadastrado."
                      className="bg-white min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Resposta do Agente *
                    </label>
                    <Textarea
                      value={newExample.response}
                      onChange={(e) =>
                        setNewExample({
                          ...newExample,
                          response: e.target.value,
                        })
                      }
                      placeholder="Ex: Para resetar sua senha, siga estes passos: 1) Acesse a página de login 2) Clique em 'Esqueci minha senha' 3) Digite seu email cadastrado 4) Verifique sua caixa de entrada..."
                      className="bg-white min-h-[100px]"
                    />
                  </div>
                </div>

                <Button
                  onClick={addInteractionExample}
                  className="w-full md:w-auto mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Exemplo
                </Button>
              </div>

              {/* Lista de exemplos adicionados */}
              {interactionExamples.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Exemplos Criados ({interactionExamples.length})
                  </h3>

                  <div className="space-y-4">
                    {interactionExamples.map((example, index) => (
                      <div
                        key={index}
                        className="bg-white border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-lg text-blue-700">
                            Exemplo {index + 1}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInteractionExample(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              👤 Cliente:
                            </span>
                            <p className="text-sm mt-1 p-2 bg-blue-50 rounded">
                              {example.question}
                            </p>
                          </div>

                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              🧠 Raciocínio:
                            </span>
                            <p className="text-sm mt-1 p-2 bg-yellow-50 rounded">
                              {example.reasoning}
                            </p>
                          </div>

                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              🤖 Agente:
                            </span>
                            <p className="text-sm mt-1 p-2 bg-green-50 rounded">
                              {example.response}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {interactionExamples.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum exemplo de interação criado ainda.</p>
                  <p className="text-sm">
                    Adicione exemplos para ensinar ao agente como se comportar.
                  </p>
                </div>
              )}
            </div>
          );
        } else {
          return (
            <div className="">
              <h2 className="text-2xl font-bold">
                Selecione um objetivo principal
              </h2>
              <p className="text-muted-foreground mt-2">
                Volte ao passo anterior e selecione um objetivo principal para
                continuar
              </p>
            </div>
          );
        }
      case 3:
        return (
          <div className="">
            <h2 className="text-2xl font-bold mb-2 text-center">
              Base de Conhecimento
            </h2>
            <p className="text-muted-foreground mb-6 text-center">
              Faça upload de arquivos PDF para criar a base de conhecimento do
              agente
            </p>

            {/* Explicação sobre a base de conhecimento */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                📚 Como funciona a Base de Conhecimento?
              </h3>
              <p className="text-blue-800 text-sm mb-4">
                Os arquivos PDF que você enviar serão processados e utilizados
                pelo agente de IA para responder perguntas dos clientes. Quanto
                melhor organizados os PDFs, mais precisas serão as respostas.
              </p>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">
                  💡 Dicas para preparar seus PDFs:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • <strong>Organize por tópicos:</strong> Crie um PDF para
                    cada assunto (ex: &quot;FAQ Produto X&quot;, &quot;Manual de
                    Instalação&quot;)
                  </li>
                  <li>
                    • <strong>Use títulos claros:</strong> Estruture com títulos
                    e subtítulos bem definidos
                  </li>
                  <li>
                    • <strong>Seja específico:</strong> Inclua procedimentos
                    passo a passo e respostas completas
                  </li>
                  <li>
                    • <strong>Atualize regularmente:</strong> Mantenha as
                    informações sempre atualizadas
                  </li>
                  <li>
                    • <strong>Texto pesquisável:</strong> Certifique-se que o
                    PDF não é apenas imagem
                  </li>
                </ul>
              </div>
            </div>

            {/* Área de upload */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Arraste e solte seus PDFs aqui
              </h3>
              <p className="text-gray-600 mb-4">
                ou clique para selecionar arquivos
              </p>

              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={(e) => handlePdfUpload(e.target.files)}
                className="hidden"
                id="pdf-upload-step3"
              />
              <label htmlFor="pdf-upload-step3">
                <Button variant="outline" className="cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Selecionar PDFs
                </Button>
              </label>

              <p className="text-xs text-gray-500 mt-3">
                Formatos aceitos: PDF • Tamanho máximo: 10MB por arquivo
              </p>
            </div>

            {/* Lista de arquivos enviados */}
            {uploadedPdfs.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Arquivos Enviados ({uploadedPdfs.length})
                </h3>

                <div className="space-y-3">
                  {uploadedPdfs.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-red-600" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePdf(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadedPdfs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground mt-6">
                <p>Nenhum arquivo PDF enviado ainda.</p>
                <p className="text-sm">
                  Adicione pelo menos um PDF para criar a base de conhecimento.
                </p>
              </div>
            )}
          </div>
        );
      case 4:
        const currentObjectiveStep4 = form.watch("objective");

        if (
          currentObjectiveStep4 === "screening" ||
          currentObjectiveStep4 === "sales"
        ) {
          return (
            <div className="">
              <h2 className="text-2xl font-bold mb-2 text-center">
                Exemplos de Interação
              </h2>
              <p className="text-muted-foreground mb-6 text-center">
                Ensine ao agente como se comportar através de exemplos práticos
              </p>

              {/* Explicação sobre exemplos de interação */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  🎯 Como funcionam os Exemplos de Interação?
                </h3>
                <p className="text-green-800 text-sm mb-4">
                  Os exemplos que você criar servem como treinamento para o
                  agente entender como deve se comportar, raciocinar e responder
                  em diferentes situações. Quanto mais específicos e variados os
                  exemplos, melhor será o desempenho do agente.
                </p>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">
                    💡 Dicas para criar bons exemplos:
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>
                      • <strong>Seja específico:</strong> Use situações reais
                      que acontecem no seu negócio
                    </li>
                    <li>
                      • <strong>Varie os cenários:</strong> Inclua casos
                      simples, complexos e edge cases
                    </li>
                    <li>
                      • <strong>Mostre o raciocínio:</strong> Explique o
                      &quot;porquê&quot; da resposta
                    </li>
                    <li>
                      • <strong>Mantenha o tom:</strong> Use a linguagem e
                      estilo da sua marca
                    </li>
                    <li>
                      • <strong>Seja completo:</strong> Inclua saudação inicial
                      e exemplos variados
                    </li>
                  </ul>
                </div>
              </div>

              {/* Exemplo de início de interação */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  👋 Como o agente deve se apresentar?
                </h3>
                <label className="block text-sm font-medium mb-2">
                  Exemplo de apresentação inicial
                </label>
                <Textarea
                  value={greetingExample}
                  onChange={(e) => setGreetingExample(e.target.value)}
                  placeholder="Ex: Olá! Sou o assistente virtual da [Empresa]. Como posso ajudá-lo hoje? Se você tiver dúvidas sobre nossos produtos ou precisar de suporte técnico, estou aqui para ajudar!"
                  className="bg-white min-h-[80px]"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Esta será a primeira mensagem que o agente enviará ao iniciar
                  uma conversa
                </p>
              </div>

              {/* Formulário para adicionar exemplo de interação */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  Adicionar Exemplo de Interação
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Pergunta do Cliente *
                    </label>
                    <Input
                      value={newExample.question}
                      onChange={(e) =>
                        setNewExample({
                          ...newExample,
                          question: e.target.value,
                        })
                      }
                      placeholder="Ex: Como faço para resetar minha senha?"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Raciocínio do Agente *
                    </label>
                    <Textarea
                      value={newExample.reasoning}
                      onChange={(e) =>
                        setNewExample({
                          ...newExample,
                          reasoning: e.target.value,
                        })
                      }
                      placeholder="Ex: O cliente quer resetar a senha. Preciso orientá-lo sobre o processo passo a passo e verificar se ele tem acesso ao email cadastrado."
                      className="bg-white min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Resposta do Agente *
                    </label>
                    <Textarea
                      value={newExample.response}
                      onChange={(e) =>
                        setNewExample({
                          ...newExample,
                          response: e.target.value,
                        })
                      }
                      placeholder="Ex: Para resetar sua senha, siga estes passos: 1) Acesse a página de login 2) Clique em 'Esqueci minha senha' 3) Digite seu email cadastrado 4) Verifique sua caixa de entrada..."
                      className="bg-white min-h-[100px]"
                    />
                  </div>
                </div>

                <Button
                  onClick={addInteractionExample}
                  className="w-full md:w-auto mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Exemplo
                </Button>
              </div>

              {/* Lista de exemplos adicionados */}
              {interactionExamples.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Exemplos Criados ({interactionExamples.length})
                  </h3>

                  <div className="space-y-4">
                    {interactionExamples.map((example, index) => (
                      <div
                        key={index}
                        className="bg-white border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-lg text-blue-700">
                            Exemplo {index + 1}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInteractionExample(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              👤 Cliente:
                            </span>
                            <p className="text-sm mt-1 p-2 bg-blue-50 rounded">
                              {example.question}
                            </p>
                          </div>

                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              🧠 Raciocínio:
                            </span>
                            <p className="text-sm mt-1 p-2 bg-yellow-50 rounded">
                              {example.reasoning}
                            </p>
                          </div>

                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              🤖 Agente:
                            </span>
                            <p className="text-sm mt-1 p-2 bg-green-50 rounded">
                              {example.response}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {interactionExamples.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum exemplo de interação criado ainda.</p>
                  <p className="text-sm">
                    Adicione exemplos para ensinar ao agente como se comportar.
                  </p>
                </div>
              )}
            </div>
          );
        } else {
          return null;
        }
      default:
        setStep(1);
    }
  };

  const uploadTeamImage = async (teamId: number) => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetchApi(`/api/agents/${teamId}/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao fazer upload da imagem");
      }
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao fazer upload da imagem"
      );
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione apenas arquivos de imagem");
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      setSelectedImage(file);

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    form.setValue("description", prompt);
    setPromptDialogOpen(false);
    toast.success("Prompt inserido com sucesso!");
  };

  const handleCopyPrompt = async (prompt: string, title: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedPrompt(title);
      setTimeout(() => setCopiedPrompt(null), 2000);
      toast.success("Prompt copiado!");
    } catch {
      toast.error("Erro ao copiar prompt");
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetchApi("/api/teams");
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error("Erro ao buscar equipes:", error);
      toast.error("Erro ao buscar equipes");
    }
  };

  // Funções para gerenciar produtos/serviços
  const addProduct = () => {
    // Validar se os campos obrigatórios estão preenchidos
    if (!newProduct.name.trim() || !newProduct.description.trim()) {
      toast.error("Nome e descrição são obrigatórios");
      return;
    }

    setProducts([...products, { ...newProduct }]);
    setNewProduct({
      name: "",
      description: "",
      value: "",
      ctaType: "",
      ctaLink: "",
    });

    // Limpar erro de products_or_services_knowledge_base se houver
    if (form.formState.errors.products_or_services_knowledge_base) {
      form.clearErrors("products_or_services_knowledge_base");
    }

    toast.success("Produto/serviço adicionado com sucesso!");
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
    toast.success("Produto/serviço removido!");
  };

  // Função para formatar valor como moeda brasileira
  const formatCurrency = (value: string) => {
    // Remove tudo que não é dígito
    const numericValue = value.replace(/\D/g, "");

    // Se não há valor, retorna vazio
    if (!numericValue) return "";

    // Converte para número e divide por 100 para ter os centavos
    const numberValue = parseInt(numericValue) / 100;

    // Formata como moeda brasileira
    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Função para manipular mudança no valor
  const handleValueChange = (rawValue: string) => {
    const formattedValue = formatCurrency(rawValue);
    setNewProduct({ ...newProduct, value: formattedValue });
  };

  // Funções para upload de PDFs
  const handlePdfUpload = (files: FileList | null) => {
    if (!files) return;

    const pdfFiles = Array.from(files).filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length !== files.length) {
      toast.error("Apenas arquivos PDF são permitidos");
      return;
    }

    // Verificar se algum arquivo é muito grande (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = pdfFiles.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error("Arquivos devem ter no máximo 10MB");
      return;
    }

    setUploadedPdfs((prev) => [...prev, ...pdfFiles]);
    toast.success(`${pdfFiles.length} arquivo(s) PDF adicionado(s)`);
  };

  const removePdf = (index: number) => {
    setUploadedPdfs((prev) => prev.filter((_, i) => i !== index));
    toast.success("Arquivo removido");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handlePdfUpload(e.dataTransfer.files);
  };

  // Funções para gerenciar exemplos de interação
  const addInteractionExample = () => {
    if (
      !newExample.question.trim() ||
      !newExample.reasoning.trim() ||
      !newExample.response.trim()
    ) {
      toast.error("Todos os campos do exemplo são obrigatórios");
      return;
    }

    setInteractionExamples([...interactionExamples, { ...newExample }]);
    setNewExample({ question: "", reasoning: "", response: "" });

    // Limpar erro de interaction_example se houver
    if (form.formState.errors.interaction_example) {
      form.clearErrors("interaction_example");
    }

    toast.success("Exemplo de interação adicionado!");
  };

  const removeInteractionExample = (index: number) => {
    setInteractionExamples(interactionExamples.filter((_, i) => i !== index));
    toast.success("Exemplo removido!");
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    const formData = form.getValues();

    switch (step) {
      case 1:
        // Disparar validação dos campos do step 1
        const step1Valid = await form.trigger([
          "name",
          "tone",
          "objective",
          "segment",
          "description",
        ]);
        return step1Valid;

      case 2:
        // Validações específicas por objetivo
        if (formData.objective === "screening") {
          // Para triagem, verificar se tem equipes selecionadas
          if (
            !formData.teams_to_redirect ||
            formData.teams_to_redirect.length === 0
          ) {
            // Definir erro customizado para teams_to_redirect
            form.setError("teams_to_redirect", {
              type: "required",
              message: "Selecione pelo menos uma equipe para redirecionamento",
            });
            return false;
          }
        } else if (formData.objective === "sales") {
          // Para vendas, verificar se tem produtos
          if (products.length === 0) {
            // Definir erro customizado para produtos
            form.setError("products_or_services_knowledge_base", {
              type: "required",
              message: "Adicione pelo menos um produto ou serviço",
            });
            return false;
          }
        }
        return true;

      case 3:
        // Step 3 (Base de conhecimento) não tem campos obrigatórios
        return true;

      case 4:
        // Para triagem e vendas, validar exemplos de interação
        if (
          formData.objective === "screening" ||
          formData.objective === "sales"
        ) {
          let hasErrors = false;

          if (interactionExamples.length === 0) {
            form.setError("interaction_example", {
              type: "required",
              message: "Adicione pelo menos um exemplo de interação",
            });
            hasErrors = true;
          }

          if (!greetingExample.trim()) {
            form.setError("presentation_example", {
              type: "required",
              message: "Exemplo de apresentação inicial é obrigatório",
            });
            hasErrors = true;
          }

          return !hasErrors;
        }
        return true;

      default:
        return true;
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-8 ml-16">
      <div className="w-full">
        <div className="w-fit">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Criar Agente de IA
          </h1>
          <p className="text-muted-foreground">
            Crie um novo agente de IA para o seu negócio
          </p>
        </div>
      </div>

      <div className="h-full w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 h-full flex flex-col justify-between"
          >
            <div className="h-full">{handleStep()}</div>
            <div className="flex gap-4 justify-end">
              {step < 3 ||
              (step === 3 && form.watch("objective") !== "support") ? (
                <Button
                  type="button"
                  onClick={async () => {
                    const isValid = await validateCurrentStep();
                    if (isValid) {
                      setStep((prev) => prev + 1);
                    }
                  }}
                >
                  {"Próximo"}
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={() => onSubmit(form.getValues())}
                >
                  {"Finalizar Criação"}
                </Button>
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
