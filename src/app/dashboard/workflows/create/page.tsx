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

  // Carregar dados
  const loadData = useCallback(async () => {
    try {
      // Simular canais (por enquanto só WhatsApp)
      setChannels([
        { 
          id: '1', 
          name: 'WhatsApp Business', 
          type: 'whatsapp', 
          status: 'connected',
          phoneNumbers: ['+55 11 99999-9999', '+55 11 88888-8888', '+55 21 77777-7777']
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
      if (isEditing) {
        // Implementar carregamento do workflow quando a API estiver disponível
        setWorkflowName('Workflow Exemplo');
        setWorkflowDescription('Descrição do workflow exemplo');
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

    try {
      const workflow = {
        name: workflowName,
        description: workflowDescription,
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

      // Implementar quando a API estiver disponível
      console.log('Salvando workflow:', workflow);
      toast.success('Workflow salvo com sucesso!');
      router.push('/dashboard/workflows');
    } catch (error) {
      console.error('Erro ao salvar workflow:', error);
      toast.error('Erro ao salvar workflow');
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