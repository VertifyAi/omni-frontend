import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  MessageSquare,
  Smartphone,
  Globe,
  Settings,
  Trash2,
} from "lucide-react";

/**
 * Componente WhatsAppTutorial
 * 
 * Exemplo de uso com desativação:
 * 
 * import { fetchApi } from "@/lib/fetchApi";
 * import { toast } from "sonner";
 * 
 * const handleDeactivate = async () => {
 *   try {
 *     setIsDeactivating(true);
 *     const response = await fetchApi('/WHATSAPP/desactivate', {
 *       method: 'POST',
 *     });
 *     
 *     if (!response.ok) {
 *       const data = await response.json();
 *       throw new Error(data.message || 'Erro ao desativar integração');
 *     }
 *     
 *     toast.success('Integração desativada com sucesso!');
 *     // Atualizar estado da aplicação conforme necessário
 *   } catch (error) {
 *     console.error('Erro ao desativar integração:', error);
 *     toast.error(error instanceof Error ? error.message : 'Erro ao desativar integração');
 *   } finally {
 *     setIsDeactivating(false);
 *   }
 * };
 * 
 * <WhatsAppTutorial
 *   onBack={() => router.back()}
 *   onConnect={handleConnect}
 *   onDeactivate={handleDeactivate}
 *   isConnecting={isConnecting}
 *   isDeactivating={isDeactivating}
 * />
 */

interface WhatsAppTutorialProps {
  onBack: () => void;
  onConnect: () => void;
  onDeactivate?: () => void;
  isConnecting?: boolean;
  isDeactivating?: boolean;
}

export function WhatsAppTutorial({ onBack, onConnect, onDeactivate, isConnecting, isDeactivating }: WhatsAppTutorialProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Conectar WhatsApp Business API
            </h1>
            <p className="text-gray-600 mt-2">
              Autorize sua conta Meta para conectar o WhatsApp Business API de forma simples e segura
            </p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Atualizado
          </Badge>
          <Badge variant="outline">
            <Clock className="w-4 h-4 mr-1" />
            5-10 min
          </Badge>
          <Badge variant="outline">
            <Shield className="w-4 h-4 mr-1" />
            Nível: Iniciante
          </Badge>
        </div>
      </Card>

      {/* Pré-requisitos */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-blue-600" />
          Pré-requisitos Essenciais
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Conta Meta/Facebook</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Conta Meta/Facebook pessoal ativa
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Acesso a uma conta Meta Business
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Permissões de administrador no negócio
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">WhatsApp Business</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Conta WhatsApp Business API (WABA) configurada
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Número de telefone verificado no WABA
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                Templates de mensagem aprovados (opcional)
              </li>
            </ul>
          </div>
        </div>

        <Alert className="mt-4 border-blue-200 bg-blue-50">
          <MessageSquare className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Facilitado:</strong> Nossa integração usa o Facebook Login for Business, 
            que permite conectar sua conta WABA de forma automática e segura, sem necessidade 
            de configurações manuais complexas.
          </AlertDescription>
        </Alert>
      </Card>

      {/* Como Funciona */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-blue-600" />
          Como Funciona a Integração
        </h2>

        <div className="space-y-6">
          {/* Passo 1 */}
          <div className="border-l-4 border-blue-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">
                Autorização via Facebook Login
              </h3>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Ao clicar em &quot;Conectar WhatsApp Business API&quot;, você será redirecionado 
                para o Facebook para autorizar nossa aplicação.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Seguro:</strong> Utilizamos o Facebook Login for Business oficial, 
                  garantindo que suas credenciais permaneçam seguras e que você tenha 
                  controle total sobre as permissões concedidas.
                </p>
              </div>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="border-l-4 border-green-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">
                Seleção de Conta e Recursos
              </h3>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Durante o processo de autorização, você poderá:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Selecionar qual conta Meta Business usar</li>
                <li>Escolher qual conta WABA conectar</li>
                <li>Revisar as permissões solicitadas</li>
                <li>Autorizar o acesso aos recursos necessários</li>
              </ul>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Permissões Solicitadas:</h4>
                <ul className="text-sm space-y-1">
                  <li>• <strong>whatsapp_business_messaging:</strong> Enviar e receber mensagens</li>
                  <li>• <strong>whatsapp_business_management:</strong> Gerenciar configurações da conta</li>
                  <li>• <strong>business_management:</strong> Acessar informações da conta comercial</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">
                Configuração Automática
              </h3>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Após a autorização, nossa plataforma configurará automaticamente:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Webhook para recebimento de mensagens</li>
                <li>Tokens de acesso seguros</li>
                <li>Configurações de conta</li>
                <li>Sincronização de dados</li>
              </ul>

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Automático:</strong> Todo o processo técnico é realizado 
                  automaticamente. Você não precisa configurar webhooks, copiar tokens 
                  ou fazer ajustes manuais.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Passo 4 */}
          <div className="border-l-4 border-orange-500 pl-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold">
                Teste e Confirmação
              </h3>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                Após a configuração automática, realizamos testes para garantir que tudo funciona:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Teste de conectividade com o WhatsApp</li>
                <li>Verificação de recebimento de webhooks</li>
                <li>Validação de permissões</li>
                <li>Sincronização de templates (se disponíveis)</li>
              </ul>
              <p>
                Você receberá uma confirmação quando a integração estiver completa e funcionando.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* O que Acontece Durante a Autorização */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-blue-600" />
          O que Acontece Durante a Autorização
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Você Verá:</h3>
            <ul className="text-sm space-y-2">
              <li>• Tela de login do Facebook</li>
              <li>• Lista de contas Meta Business disponíveis</li>
              <li>• Seleção de contas WABA</li>
              <li>• Revisão de permissões solicitadas</li>
              <li>• Confirmação de autorização</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Nossa Plataforma Fará:</h3>
            <ul className="text-sm space-y-2">
              <li>• Configuração automática de webhooks</li>
              <li>• Armazenamento seguro de tokens</li>
              <li>• Sincronização de dados da conta</li>
              <li>• Teste de conectividade</li>
              <li>• Ativação dos recursos</li>
            </ul>
          </div>
        </div>

        <Alert className="mt-4 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Privacidade:</strong> Nunca armazenamos suas credenciais do Facebook. 
            Utilizamos apenas os tokens de acesso fornecidos pelo Facebook para acessar 
            os recursos autorizados do WhatsApp Business API.
          </AlertDescription>
        </Alert>
      </Card>

      {/* Configurações Avançadas */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-blue-600" />
          Após a Conexão
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Recursos Disponíveis</h3>
            <p className="text-sm text-gray-600">
              Com a integração via Facebook Login for Business, você terá acesso a:
            </p>
            <ul className="text-sm space-y-2">
              <li>• Envio e recebimento de mensagens</li>
              <li>• Templates de mensagem aprovados</li>
              <li>• Métricas e relatórios</li>
              <li>• Webhooks automáticos</li>
              <li>• Gestão de conversas</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Configurações Adicionais</h3>
            <p className="text-sm text-gray-600">
              Você poderá configurar diretamente na plataforma:
            </p>
            <ul className="text-sm space-y-2">
              <li>• Respostas automáticas</li>
              <li>• Horários de atendimento</li>
              <li>• Fluxos de conversa</li>
              <li>• Integrações com CRM</li>
              <li>• Relatórios personalizados</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Problemas Comuns */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
          Possíveis Situações Durante a Conexão
        </h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-orange-600 mb-2">
              Múltiplas Contas Meta Business
            </h4>
            <p className="text-sm mb-2">
              Se você tiver acesso a várias contas Meta Business.
            </p>
            <p className="text-sm">
              <strong>Solução:</strong> Selecione cuidadosamente a conta que contém 
              a WABA que você deseja conectar.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-orange-600 mb-2">
              Permissões Insuficientes
            </h4>
            <p className="text-sm mb-2">
              Sua conta não tem permissões de administrador na conta Meta Business.
            </p>
            <p className="text-sm">
              <strong>Solução:</strong> Solicite ao administrador da conta Meta Business 
              que conceda as permissões necessárias.
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-orange-600 mb-2">
              WABA não encontrada
            </h4>
            <p className="text-sm mb-2">
              Nenhuma conta WABA foi encontrada na conta Meta Business selecionada.
            </p>
            <p className="text-sm">
              <strong>Solução:</strong> Verifique se você possui uma conta WABA 
              configurada ou entre em contato com o suporte.
            </p>
          </div>
        </div>
      </Card>

      {/* Limites e Boas Práticas */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-green-600" />
          Limites e Boas Práticas
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Limites de Envio</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Nível 1 (Novo):</span>
                <span className="font-semibold">1.000 msgs/24h</span>
              </div>
              <div className="flex justify-between">
                <span>Nível 2:</span>
                <span className="font-semibold">10.000 msgs/24h</span>
              </div>
              <div className="flex justify-between">
                <span>Nível 3:</span>
                <span className="font-semibold">100.000 msgs/24h</span>
              </div>
              <div className="flex justify-between">
                <span>Nível 4:</span>
                <span className="font-semibold">Ilimitado</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Boas Práticas</h3>
            <ul className="text-sm space-y-2">
              <li>• Sempre obtenha consentimento antes de enviar mensagens</li>
              <li>• Use templates aprovados para mensagens proativas</li>
              <li>• Responda rapidamente às mensagens recebidas</li>
              <li>• Mantenha o perfil comercial sempre atualizado</li>
              <li>• Monitore métricas de qualidade regularmente</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Botão de Conexão */}
      <Card className="p-6 text-center items-center">
        <h3 className="text-xl font-semibold mb-4">Pronto para Conectar?</h3>
        <p className="text-gray-600 mb-6">
          Certifique-se de que completou todos os passos acima antes de
          prosseguir com a conexão.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={onConnect} 
            size="lg" 
            className="w-full max-w-md" 
            disabled={isConnecting || isDeactivating || !!onDeactivate}
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Conectando...
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 mr-2" />
                Conectar WhatsApp Business API
              </>
            )}
          </Button>

          {onDeactivate && (
            <Button
              onClick={onDeactivate}
              variant="destructive"
              size="lg"
              className=""
              disabled={isConnecting || isDeactivating}
            >
              {isDeactivating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                </>
              ) : (
                <>
                  <Trash2 className="" />
                </>
              )}
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Ao conectar, você concorda com os termos de uso do WhatsApp Business
          API
        </p>
      </Card>
    </div>
  );
}
