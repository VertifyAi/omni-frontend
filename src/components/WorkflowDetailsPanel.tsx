"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Workflow, Bot, Calendar, GitBranch, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface WorkflowChannel {
  id: number;
  workflowId: number;
  integrationId: number;
  channelIdentifier: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface WorkflowAgent {
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
}

interface FlowData {
  nodes: Array<{
    id: string;
    type: string;
    data: Record<string, unknown>;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
  }>;
}

interface WorkflowData {
  id: number;
  name: string;
  description?: string;
  flowData: FlowData;
  companyId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  workflowChannels: WorkflowChannel[];
  workflowUser: Record<string, unknown> | null;
  workflowAgent: WorkflowAgent | null;
  workflowTeam: Record<string, unknown> | null;
}

interface WorkflowDetailsPanelProps {
  workflow: WorkflowData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkflowDetailsPanel({ workflow, isOpen, onClose }: WorkflowDetailsPanelProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!shouldRender) return null;

  const isActive = workflow && workflow.deletedAt === null && workflow.workflowChannels.length > 0;
  const nodesCount = workflow?.flowData?.nodes?.length || 0;
  const connectionsCount = workflow?.flowData?.edges?.length || 0;
  const channelsCount = workflow?.workflowChannels?.length || 0;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isAnimating ? 'opacity-40' : 'opacity-0'
        }`}
        onClick={handleOverlayClick}
      />
      
      {/* Side Panel */}
      <div className={`fixed right-4 top-4 bottom-4 w-[500px] bg-white-pure border border-white-warm shadow-white-elevated z-50 overflow-y-auto transition-transform duration-300 ease-out rounded-2xl ${
        isAnimating ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white-warm">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Detalhes do Workflow
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-white-soft transition-colors rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {workflow && (
            <div className="space-y-6">
              {/* Workflow Info */}
              <div className="flex items-center gap-4 p-4 bg-white-soft rounded-xl border border-white-warm elevated-1">
                <Avatar className="h-16 w-16 border-2 border-white-warm">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg bg-gradient-brand text-foreground font-semibold">
                    <Workflow className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{workflow.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={isActive ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {isActive ? '🟢 Ativo' : '🔴 Inativo'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                  Descrição
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {workflow.description || "Nenhuma descrição disponível."}
                </p>
              </div>

              {/* Flow Statistics */}
              <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                  Estatísticas do Fluxo
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white-pure rounded-lg border border-white-warm">
                    <GitBranch className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{nodesCount}</p>
                    <p className="text-xs text-muted-foreground">Nós</p>
                  </div>
                  <div className="text-center p-3 bg-white-pure rounded-lg border border-white-warm">
                    <LinkIcon className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{connectionsCount}</p>
                    <p className="text-xs text-muted-foreground">Conexões</p>
                  </div>
                  <div className="text-center p-3 bg-white-pure rounded-lg border border-white-warm">
                    <Workflow className="h-5 w-5 text-primary mx-auto mb-1" />
                    <p className="text-2xl font-bold text-foreground">{channelsCount}</p>
                    <p className="text-xs text-muted-foreground">Canais</p>
                  </div>
                </div>
              </div>

              {/* Associated Agent */}
              {workflow.workflowAgent && (
                <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                  <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                    Agente Associado
                  </h4>
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <Bot className="h-5 w-5 text-emerald-600" />
                    <div className="flex-1">
                      <p className="font-medium text-emerald-700">{workflow.workflowAgent.name}</p>
                      <p className="text-sm text-emerald-600">
                        {workflow.workflowAgent.objective === 'screening' ? 'Triagem' : 
                         workflow.workflowAgent.objective === 'sales' ? 'Vendas' :
                         workflow.workflowAgent.objective === 'support' ? 'Suporte' : 
                         workflow.workflowAgent.objective}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Channels */}
              <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                  Canais Conectados
                </h4>
                {workflow.workflowChannels.length > 0 ? (
                  <div className="space-y-2">
                    {workflow.workflowChannels.map((channel) => (
                      <div key={channel.id} className="flex items-center gap-3 p-3 bg-white-pure rounded-lg border border-white-warm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">Canal #{channel.id}</p>
                          <p className="text-sm text-muted-foreground">{channel.channelIdentifier}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum canal conectado</p>
                )}
              </div>

              {/* Creation Date */}
              <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                  Data de Criação
                </h4>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p>
                    {new Date(workflow.createdAt).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 