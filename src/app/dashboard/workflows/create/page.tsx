"use client";

import React, { useCallback, useState, useEffect, Suspense } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
  Panel,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Bot, User, Plus, Save, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { fetchApi } from '@/lib/fetchApi';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Tipos para os dados
interface Channel {
  id: string;
  name: string;
  type: 'whatsapp';
  status: 'connected' | 'disconnected';
  phoneNumbers: string[];
}

// Interface para a resposta da Meta API
interface MetaPhoneNumber {
  verified_name: string;
  code_verification_status: string;
  display_phone_number: string;
  quality_rating: string;
  platform_type: string;
  id: string;
}

interface MetaPhoneNumbersResponse {
  data: MetaPhoneNumber[];
}

interface Agent {
  id: number;
  name: string;
  objective: string;
}

interface TeamMember {
  id: number;
  name: string;
  email: string;
}

// Tipos para dados dos nós
interface ChannelNodeData {
  label: string;
  status: 'connected' | 'disconnected';
  channelId: string;
  phoneNumbers: string[];
  selectedPhone?: string;
}

interface AgentNodeData {
  label: string;
  objective: string;
  agentId: number;
}

interface UserNodeData {
  label: string;
  email: string;
  userId: number;
}

// Interface para o DTO
interface CreateWorkflowDto {
  name: string;
  description: string;
  flowData: string;
  companyId: number;
  workflowUserId?: number;
  workflowAgentId?: number;
  workflowTeamId?: number;
  workflowChannels: {
    channelId: number;
    channelIdentifier: string;
  }[];
}

// Interface para dados do workflow carregado da API
interface WorkflowData {
  id: number;
  name: string;
  description: string;
  flowData: {
    nodes: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      data: Record<string, unknown>;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  } | string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  workflowChannels: Array<{
    id: number;
    workflowId: number;
    integrationId: number;
    channelIdentifier: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }>;
  workflowUser: {
    id: number;
    name: string;
    email: string;
  } | null;
  workflowAgent: {
    id: number;
    name: string;
    tone: string;
    objective: string;
    segment: string;
    description: string;
    presentationExample: string;
    llmAssistantId: string;
    companyId: number;
    workflowId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  } | null;
  workflowTeam: {
    id: number;
    name: string;
  } | null;
}

// Componente customizado para nó de canal
const ChannelNode = ({ data }: { data: ChannelNodeData }) => {
  const [selectedPhone, setSelectedPhone] = useState(data.selectedPhone || data.phoneNumbers[0]);
  
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      <Card className="min-w-[250px] border-2 border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <div className="p-1 bg-green-500 rounded-full">
              <MessageCircle className="w-3 h-3 text-white" />
            </div>
            {data.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <Badge 
            variant={data.status === 'connected' ? 'default' : 'secondary'} 
            className="text-xs"
          >
            {data.status === 'connected' ? '🟢 Conectado' : '🔴 Desconectado'}
          </Badge>
          
          {data.phoneNumbers.length > 0 && (
            <div>
              <label className="text-xs font-medium text-gray-600">Número:</label>
              <select 
                className="w-full mt-1 px-2 py-1 text-xs border rounded-md bg-white"
                value={selectedPhone}
                onChange={(e) => setSelectedPhone(e.target.value)}
              >
                {data.phoneNumbers.map((phone) => (
                  <option key={phone} value={phone}>
                    {phone}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Componente customizado para nó de agente
const AgentNode = ({ data }: { data: AgentNodeData }) => (
  <div className="relative">
    <Handle
      type="source"
      position={Position.Left}
      className="w-3 h-3 bg-blue-500 border-2 border-white"
    />
    <Card className="min-w-[220px] border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1 bg-blue-500 rounded-full">
            <Bot className="w-3 h-3 text-white" />
          </div>
          {data.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
          🤖 {data.objective}
        </Badge>
      </CardContent>
    </Card>
  </div>
);

// Componente customizado para nó de usuário
const UserNode = ({ data }: { data: UserNodeData }) => (
  <div className="relative">
    <Handle
      type="source"
      position={Position.Left}
      className="w-3 h-3 bg-purple-500 border-2 border-white"
    />
    <Card className="min-w-[220px] border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <div className="p-1 bg-purple-500 rounded-full">
            <User className="w-3 h-3 text-white" />
          </div>
          {data.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-purple-700 bg-purple-50 px-2 py-1 rounded">
          👤 {data.email}
        </p>
      </CardContent>
    </Card>
  </div>
);

// Tipos de nós customizados
const nodeTypes = {
  channel: ChannelNode,
  agent: AgentNode,
  user: UserNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function CreateWorkflowContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;
  const { user } = useAuth();

  // Conectar nós (só permite conexão de agentes/usuários PARA canais)
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      
      // Verificar se a conexão é válida (agente/usuário -> canal)
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);
      
      if (!sourceNode || !targetNode) return;
      
      // Só permite conexão de agentes/usuários PARA canais
      const isValidConnection = 
        (sourceNode.type === 'agent' || sourceNode.type === 'user') && 
        targetNode.type === 'channel';
      
      if (!isValidConnection) {
        toast.error('Conecte apenas agentes ou usuários AOS canais de atendimento');
        return;
      }
      
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, nodes]
  );

  // Função para buscar números de telefone da Meta API
  const fetchWhatsAppNumbers = async (): Promise<string[]> => {
    try {
      // Fazer chamada para sua API backend que irá chamar a Meta API
      const response = await fetchApi('/api/whatsapp/phone-numbers');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar números do WhatsApp');
      }
      
      const data: MetaPhoneNumbersResponse = await response.json();
      
      // Extrair os números do response da Meta API
      return data.data?.map((phone: MetaPhoneNumber) => phone.display_phone_number) || [];
    } catch (error) {
      console.error('Erro ao buscar números do WhatsApp:', error);
      // Fallback para números de exemplo em caso de erro
      return ['+55 11 99999-9999'];
    }
  };

  // Carregar dados
  const loadData = useCallback(async () => {
    try {
      // Buscar números reais do WhatsApp da Meta API
      const phoneNumbers = await fetchWhatsAppNumbers();
      
      setChannels([
        { 
          id: '1', 
          name: 'WhatsApp Business', 
          type: 'whatsapp', 
          status: phoneNumbers.length > 0 ? 'connected' : 'disconnected',
          phoneNumbers: phoneNumbers
        }
      ]);

      // Carregar agentes
      const agentsResponse = await fetchApi('/api/agents');
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        setAgents(agentsData);
      }

      // Carregar membros da equipe
      const teamsResponse = await fetchApi('/api/teams');
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        const allMembers = teamsData.flatMap((team: { members: TeamMember[] }) => team.members);
        setTeamMembers(allMembers);
      }

      // Se estiver editando, carregar dados do workflow
      if (isEditing && editId) {
        try {
          const workflowResponse = await fetchApi(`/api/workflows/${editId}`);
          if (workflowResponse.ok) {
            const workflowData: WorkflowData = await workflowResponse.json();
            
            // Definir nome e descrição
            setWorkflowName(workflowData.name || '');
            setWorkflowDescription(workflowData.description || '');
            
            // Carregar dados do fluxo se existirem
            if (workflowData.flowData) {
              try {
                // flowData já vem como objeto, não precisa fazer parse
                const flowData = typeof workflowData.flowData === 'string' 
                  ? JSON.parse(workflowData.flowData) 
                  : workflowData.flowData;
                
                // Recriar nodes
                if (flowData.nodes && Array.isArray(flowData.nodes)) {
                  setNodes(flowData.nodes.map((node: { id: string; type: string; position?: { x: number; y: number }; data?: Record<string, unknown> }) => ({
                    id: node.id,
                    type: node.type,
                    position: node.position || { x: 0, y: 0 },
                    data: node.data || {}
                  })));
                }
                
                // Recriar edges
                if (flowData.edges && Array.isArray(flowData.edges)) {
                  setEdges(flowData.edges.map((edge: { id?: string; source: string; target: string; type?: string }) => ({
                    id: edge.id || `${edge.source}-${edge.target}`,
                    source: edge.source,
                    target: edge.target,
                    type: edge.type || 'default'
                  })));
                }
              } catch (parseError) {
                console.error('Erro ao processar dados do fluxo:', parseError);
                toast.error('Erro ao carregar estrutura do workflow');
              }
            }
          } else {
            throw new Error('Workflow não encontrado');
          }
        } catch (error) {
          console.error('Erro ao carregar workflow:', error);
          toast.error('Erro ao carregar workflow para edição');
          router.push('/dashboard/workflows');
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    }
  }, [isEditing]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Adicionar nó de canal (lado direito - destino)
  const addChannelNode = (channel: Channel) => {
    const channelNodes = nodes.filter(n => n.type === 'channel');
    const newNode: Node = {
      id: `channel-${channel.id}`,
      type: 'channel',
      position: { x: 600, y: 100 + channelNodes.length * 200 },
      data: { 
        label: channel.name, 
        status: channel.status,
        channelId: channel.id,
        phoneNumbers: channel.phoneNumbers,
        selectedPhone: channel.phoneNumbers[0]
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Adicionar nó de agente (lado esquerdo - origem)
  const addAgentNode = (agent: Agent) => {
    const agentNodes = nodes.filter(n => n.type === 'agent');
    const newNode: Node = {
      id: `agent-${agent.id}`,
      type: 'agent',
      position: { x: 100, y: 100 + agentNodes.length * 200 },
      data: { 
        label: agent.name, 
        objective: agent.objective,
        agentId: agent.id 
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Adicionar nó de usuário (lado esquerdo - origem)
  const addUserNode = (user: TeamMember) => {
    const userNodes = nodes.filter(n => n.type === 'user');
    const newNode: Node = {
      id: `user-${user.id}`,
      type: 'user',
      position: { x: 100, y: 400 + userNodes.length * 200 },
      data: { 
        label: user.name, 
        email: user.email,
        userId: user.id 
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  // Remover nó selecionado
  const removeSelectedNodes = () => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  };

  // Salvar workflow
  const saveWorkflow = async () => {
    if (!workflowName.trim()) {
      toast.error('Nome do workflow é obrigatório');
      return;
    }

    // Identificar tipos de nós conectados (deve ser apenas um tipo: team OU user OU agent)
    const connectedAgents = nodes.filter(node => 
      node.type === 'agent' && 
      edges.some(edge => edge.source === node.id)
    );

    const connectedUsers = nodes.filter(node => 
      node.type === 'user' && 
      edges.some(edge => edge.source === node.id)
    );

    // Por enquanto não temos nós de team no ReactFlow, mas deixando preparado
    const connectedTeams = nodes.filter(node => 
      node.type === 'team' && 
      edges.some(edge => edge.source === node.id)
    );

    const connectedChannels = edges
      .map(edge => {
        const targetNode = nodes.find(n => n.id === edge.target && n.type === 'channel');
        if (targetNode) {
          return {
            channelId: parseInt(targetNode.data.channelId),
            channelIdentifier: targetNode.data.selectedPhone || targetNode.data.phoneNumbers[0]
          };
        }
        return null;
      })
      .filter((channel): channel is { channelId: number; channelIdentifier: string } => channel !== null);

    // Validações: deve ter pelo menos um canal e apenas um tipo de fonte (team OU user OU agent)
    if (connectedChannels.length === 0) {
      toast.error('É necessário conectar pelo menos um canal');
      return;
    }

    const totalConnections = connectedAgents.length + connectedUsers.length + connectedTeams.length;
    
    if (totalConnections === 0) {
      toast.error('É necessário conectar pelo menos um agente, usuário ou equipe aos canais');
      return;
    }

    if (totalConnections > 1) {
      toast.error('Conecte os canais a apenas UM agente OU usuário OU equipe por workflow');
      return;
    }

    // Verificar se há múltiplos tipos conectados
    const typesConnected = [
      connectedAgents.length > 0,
      connectedUsers.length > 0,
      connectedTeams.length > 0
    ].filter(Boolean).length;

    if (typesConnected > 1) {
      toast.error('Conecte os canais a apenas um tipo: agente OU usuário OU equipe');
      return;
    }

    try {
      // Preparar dados do fluxo para serialização
      const flowData = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target
        }))
      };

      // Montar DTO conforme a nova especificação (campos opcionais)
      const createWorkflowDto: CreateWorkflowDto = {
        name: workflowName.trim(),
        description: workflowDescription.trim() || workflowName.trim(),
        flowData: JSON.stringify(flowData),
        companyId: user?.companyId || 1,
        workflowChannels: connectedChannels
      };

      // Adicionar apenas o campo correspondente ao tipo conectado
      if (connectedAgents.length > 0) {
        createWorkflowDto.workflowAgentId = connectedAgents[0].data.agentId;
      } else if (connectedUsers.length > 0) {
        createWorkflowDto.workflowUserId = connectedUsers[0].data.userId;
      } else if (connectedTeams.length > 0) {
        createWorkflowDto.workflowTeamId = connectedTeams[0].data.teamId;
      }

      console.log('Enviando workflow:', createWorkflowDto);

      const response = await fetchApi(
        isEditing ? `/api/workflows/${editId}` : '/api/workflows',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createWorkflowDto),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar workflow');
      }

      const result = await response.json();
      console.log('Workflow salvo:', result);
      
      toast.success(isEditing ? 'Workflow atualizado com sucesso!' : 'Workflow criado com sucesso!');
      router.push('/dashboard/workflows');
      
    } catch (error) {
      console.error('Erro ao salvar workflow:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar workflow');
    }
  };

  return (
    <div className="h-screen flex flex-col ml-16">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/workflows">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {isEditing ? 'Editar Workflow' : 'Criar Novo Fluxo'}
              </h1>
              <p className="text-muted-foreground">
                Configure quais agentes e usuários irão atender cada canal
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddPanel(!showAddPanel)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
            <Button
              variant="outline"
              onClick={removeSelectedNodes}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remover
            </Button>
            <Button onClick={saveWorkflow}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Workflow
            </Button>
          </div>
        </div>
        
        {/* Campos de nome e descrição */}
        <div className="mt-4 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nome do workflow"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Descrição (opcional)"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
          
          {/* Panel para adicionar elementos */}
          {showAddPanel && (
            <Panel position="top-right" className="bg-white border rounded-lg shadow-lg p-4 w-80">
              <h3 className="font-semibold mb-4">Adicionar ao Fluxo</h3>
              
              {/* Canais */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  Canais de Atendimento
                </h4>
                <div className="space-y-2">
                  {channels.map((channel) => (
                    <Button
                      key={channel.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addChannelNode(channel)}
                    >
                      {channel.name}
                      <Badge 
                        variant={channel.status === 'connected' ? 'default' : 'secondary'}
                        className="ml-auto text-xs"
                      >
                        {channel.status === 'connected' ? 'Conectado' : 'Desconectado'}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Agentes */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  Agentes de IA
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {agents.map((agent) => (
                    <Button
                      key={agent.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addAgentNode(agent)}
                    >
                      {agent.name}
                      <Badge variant="outline" className="ml-auto text-xs">
                        {agent.objective}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Usuários */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  Usuários
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <Button
                      key={member.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addUserNode(member)}
                    >
                      {member.name}
                      <span className="ml-auto text-xs text-muted-foreground truncate">
                        {member.email}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            </Panel>
          )}

          {/* Instruções */}
          <Panel position="bottom-left" className="bg-white/90 border rounded-lg p-3">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Arraste os elementos do painel para o canvas</p>
              <p>• Conecte agentes/usuários AOS canais arrastando das bordas</p>
              <p>• Um agente pode atender múltiplos canais</p>
              <p>• Selecione elementos e clique em &quot;Remover&quot; para excluir</p>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export default function CreateWorkflowPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CreateWorkflowContent />
    </Suspense>
  );
}