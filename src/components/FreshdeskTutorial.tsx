"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MessageCircle,
  Settings,
  Key,
  ExternalLink,
  Copy,
  Clock,
  Bot,
  ArrowLeftRight,
  Users,
  Shield,
  Globe,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/fetchApi";
import { useRouter } from "next/navigation";

interface ConfigToggle {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

interface FreshdeskTutorialProps {
  onBack?: () => void;
}

export default function FreshdeskTutorial({ onBack }: FreshdeskTutorialProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "api-key" | "configuration" | "testing"
  >("api-key");
  const [apiKey, setApiKey] = useState("");
  const [domain, setDomain] = useState("");
  const [configurations, setConfigurations] = useState<ConfigToggle[]>([
    {
      id: "priority_analysis",
      title: "Análise de Prioridade",
      description: "Analisar prioridade dos tickets automaticamente",
      enabled: true,
      icon: <AlertCircle className="w-4 h-4" />,
    },
    {
      id: "ticket_creation",
      title: "Criação de Tickets",
      description: "Criar tickets automaticamente",
      enabled: true,
      icon: <Plus className="w-4 h-4" />,
    },
    {
      id: "ticket_close",
      title: "Fechamento de Tickets",
      description: "Fechar tickets automaticamente",
      enabled: true,
      icon: <X className="w-4 h-4" />,
    },
    {
      id: "contact_sync",
      title: "Sincronização de Contatos",
      description: "Sincronizar contatos entre FreshDesk e Verify",
      enabled: true,
      icon: <Users className="w-4 h-4" />,
    },
  ]);

  const handleToggleConfiguration = (configId: string) => {
    setConfigurations((prev) =>
      prev.map((config) =>
        config.id === configId
          ? { ...config, enabled: !config.enabled }
          : config
      )
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para a área de transferência!");
  };

  const handleSaveConfiguration = async () => {
    try {
      const payload = {
        domain,
        api_key: apiKey,
        priority_analysis: configurations.find(
          (config) => config.id === "priority_analysis"
        )?.enabled,
        ticket_creation: configurations.find(
          (config) => config.id === "ticket_creation"
        )?.enabled,
        ticket_close: configurations.find(
          (config) => config.id === "ticket_close"
        )?.enabled,
        contact_sync: configurations.find(
          (config) => config.id === "contact_sync"
        )?.enabled,
      };

      const response = await fetchApi("/api/integrations/freshdesk", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        toast.success("Configuração salva com sucesso!");
        router.push("/dashboard/settings/integrations");
      } else {
        toast.error("Erro ao salvar configuração");
      }
    } catch (error) {
      toast.error("Erro ao salvar configuração");
      console.error(error);
    }
  };

  if (currentStep === "api-key") {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Conectar FreshDesk
              </h1>
              <p className="text-gray-600 mt-2">
                Configure sua integração com FreshDesk para gerenciar tickets e
                atendimentos
              </p>
            </div>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Voltar
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Key className="w-4 h-4 mr-1" />
              Passo 1/3
            </Badge>
            <Badge variant="outline">
              <Clock className="w-4 h-4 mr-1" />
              3-5 min
            </Badge>
            <Badge variant="outline">
              <Shield className="w-4 h-4 mr-1" />
              Nível: Iniciante
            </Badge>
          </div>
        </Card>

        {/* Como Obter API Key */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Key className="w-6 h-6 mr-2 text-blue-600" />
            Como Obter sua API Key do FreshDesk
          </h2>

          <div className="space-y-6">
            {/* Passo 1 */}
            <div className="border-l-4 border-blue-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold">Acessar o FreshDesk</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <p>
                  Faça login no seu painel administrativo do FreshDesk e navegue
                  até as configurações.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        "http://developer.freshdesk.com/api/v1/#authentication",
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Documentação Oficial
                  </Button>
                </div>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="border-l-4 border-green-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold">Localizar API Key</h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <p>Siga estes passos no seu FreshDesk:</p>
                <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Clique no seu perfil no canto superior direito</li>
                  <li>
                    Selecione{" "}
                    <strong className="text-foreground">
                      &quot;Profile settings&quot;
                    </strong>
                  </li>
                  <li>
                    Na aba{" "}
                    <strong className="text-foreground">
                      &quot;Profile&quot;
                    </strong>
                    , role até o final da página
                  </li>
                  <li>
                    Localize a seção{" "}
                    <strong className="text-foreground">
                      &quot;Your API Key&quot;
                    </strong>
                  </li>
                  <li>
                    Clique em{" "}
                    <strong className="text-foreground">
                      &quot;View API Key&quot;
                    </strong>
                  </li>
                </ol>

                <Alert className="border-orange-200 bg-orange-50">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Importante:</strong> Mantenha sua API Key segura e
                    não a compartilhe publicamente.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="border-l-4 border-purple-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold">Inserir Credenciais</h3>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>Insira suas credenciais do FreshDesk abaixo:</p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domínio do FreshDesk</Label>
                    <div className="flex gap-2">
                      <Input
                        id="domain"
                        placeholder="exemplo"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="flex-1"
                      />
                      <span className="flex items-center text-sm text-gray-500">
                        .freshdesk.com
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apikey">API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        id="apikey"
                        type="password"
                        placeholder="Sua API Key do FreshDesk"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(apiKey)}
                        disabled={!apiKey}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Seguro:</strong> Suas credenciais são armazenadas de
                    forma criptografada e usadas apenas para conectar com sua
                    conta FreshDesk.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </Card>

        {/* Botão Continuar */}
        <Card className="p-6 text-center w-full justify-center items-center">
          <Button
            onClick={() => setCurrentStep("configuration")}
            disabled={!domain || !apiKey}
            size="lg"
            className="w-full"
          >
            Continuar para Configuração
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  if (currentStep === "configuration") {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Configurações da Integração
              </h1>
              <p className="text-gray-600 mt-2">
                Personalize as funcionalidades conforme suas necessidades de
                atendimento
              </p>
            </div>
            <Button variant="outline" onClick={() => setCurrentStep("api-key")}>
              Voltar
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-800"
            >
              <Settings className="w-4 h-4 mr-1" />
              Passo 2/3
            </Badge>
            <Badge variant="outline">
              <Clock className="w-4 h-4 mr-1" />
              2-3 min
            </Badge>
          </div>
        </Card>

        {/* Configurações */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Settings className="w-6 h-6 mr-2 text-blue-600" />
            Funcionalidades Disponíveis
          </h2>

          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Globe className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Dica:</strong> Você pode alterar essas configurações a
              qualquer momento após a integração estar ativa.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {configurations.map((config) => (
              <div key={config.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        config.enabled
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{config.title}</h3>
                      <p className="text-sm text-gray-600">
                        {config.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={config.enabled}
                    onCheckedChange={() => handleToggleConfiguration(config.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Resumo */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
            Resumo da Configuração
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Funcionalidades Ativas</h3>
              <div className="space-y-2">
                {configurations
                  .filter((c) => c.enabled)
                  .map((config) => (
                    <div
                      key={config.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {config.title}
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Domínio:</span>
                  <span className="font-medium">{domain}.freshdesk.com</span>
                </div>
                <div className="flex justify-between">
                  <span>API Key:</span>
                  <span className="font-medium">Configurada ✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Funcionalidades:</span>
                  <span className="font-medium">
                    {configurations.filter((c) => c.enabled).length}/
                    {configurations.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Botão Finalizar */}
        <Card className="p-6 text-center">
          <Button
            onClick={() => setCurrentStep("testing")}
            size="lg"
            className="w-full"
          >
            Finalizar Configuração
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  // Passo final
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Integração Configurada!
            </h1>
            <p className="text-gray-600 mt-4">
              Sua integração com FreshDesk está ativa e funcionando
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Concluído
          </Badge>
          <Badge variant="outline">
            <Shield className="w-4 h-4 mr-1" />
            Integração Ativa
          </Badge>
        </div>
      </Card>

      {/* Como Funciona */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-blue-600" />
          Como os Fluxos Funcionarão
        </h2>

        <div className="space-y-6">
          {/* Fluxo 1 */}
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-semibold">Mensagens dos Clientes</h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>• Cliente envia mensagem</p>
              <p>• Sistema salva contato no Verify (se não existir)</p>
              <p>• Contato é sincronizado com FreshDesk</p>
              <p>• Ticket é criado automaticamente</p>
            </div>
          </div>

          {/* Fluxo 2 */}
          <div className="border-l-4 border-orange-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <ArrowLeftRight className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-semibold">
                Transferência de Tickets
              </h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p>
                • Status <strong>CLOSED</strong> = Mensagem de avaliação
              </p>
              <p>
                • Status <strong>IN_PROGRESS</strong> = Mensagem de
                transferência
              </p>
              <p>• Sincronização automática entre plataformas</p>
            </div>
          </div>

          {/* Fluxo 3 */}
          {configurations.find((c) => c.id === "ai-integration")?.enabled && (
            <div className="border-l-4 border-purple-500 pl-6">
              <div className="flex items-center gap-3 mb-3">
                <Bot className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-semibold">
                  Respostas Automáticas com IA
                </h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p>• IA analisa mensagens recebidas</p>
                <p>• Respostas automáticas baseadas no contexto</p>
                <p>• Transferência para humanos quando necessário</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Próximos Passos */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-green-600" />
          Próximos Passos
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Agora Você Pode:</h3>
            <ul className="text-sm space-y-2">
              <li>• Gerenciar tickets no FreshDesk</li>
              <li>• Receber mensagens automaticamente</li>
              <li>• Configurar templates de resposta</li>
              <li>• Visualizar métricas de atendimento</li>
              <li>• Definir regras de automação</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Configurações Avançadas:</h3>
            <ul className="text-sm space-y-2">
              <li>• Horários de atendimento personalizados</li>
              <li>• Mensagens automáticas por prioridade</li>
              <li>• Integração com equipes específicas</li>
              <li>• Relatórios de performance</li>
              <li>• Webhooks personalizados</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Finalizar */}
      <Card className="p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Integração Concluída!</h3>
        <p className="text-gray-600 mb-6">
          Sua integração FreshDesk está ativa e pronta para usar.
        </p>

        <Button
          onClick={() => {
            handleSaveConfiguration();
          }}
          size="lg"
          className="w-full"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Concluir e Voltar
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          Você pode gerenciar esta integração na página de configurações
        </p>
      </Card>
    </div>
  );
}
