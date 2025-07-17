"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  User, 
  Bot, 
  Loader2, 
  Check,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { fetchApi } from "@/lib/fetchApi";
import { toast } from "sonner";
import { TicketPriorityLevel } from "@/types/ticket";
import { Team } from "@/types/team";
import { User as UserType } from "@/types/users";
import { Agent } from "@/types/agent";
import { Skeleton } from "@/components/ui/skeleton";

interface TransferTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: number;
  onTransferSuccess?: () => void;
}

interface TransferOption {
  type: 'team' | 'user' | 'agent';
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  teamName?: string;
}

interface TransferTicketDto {
  userId?: number;
  priorityLevel?: TicketPriorityLevel;
  teamId?: number;
  agentId?: number;
}

export function TransferTicketModal({
  isOpen,
  onClose,
  ticketId,
  onTransferSuccess
}: TransferTicketModalProps) {
  const [activeTab, setActiveTab] = useState<'teams' | 'users' | 'agents'>('teams');
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedOption, setSelectedOption] = useState<TransferOption | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<TicketPriorityLevel>(TicketPriorityLevel.MEDIUM);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Reset priority when switching to agents tab
  useEffect(() => {
    if (activeTab === 'agents') {
      setSelectedPriority(TicketPriorityLevel.MEDIUM);
    }
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [teamsRes, usersRes, agentsRes] = await Promise.all([
        fetchApi('/api/teams'),
        fetchApi('/api/users'),
        fetchApi('/api/agents')
      ]);

      if (!teamsRes.ok || !usersRes.ok || !agentsRes.ok) {
        throw new Error('Erro ao carregar dados para transferência');
      }

      const [teamsData, usersData, agentsData] = await Promise.all([
        teamsRes.json(),
        usersRes.json(),
        agentsRes.json()
      ]);

      // Validar e extrair arrays dos dados recebidos
      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setUsers(Array.isArray(usersData?.users) ? usersData.users : []);
      setAgents(Array.isArray(agentsData) ? agentsData : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedOption) {
      toast.error('Selecione uma opção para transferir');
      return;
    }

    setIsTransferring(true);
    setError(null);

    try {
      const transferData: TransferTicketDto = {};

      // Para agentes IA, não enviamos a prioridade
      if (activeTab !== 'agents') {
        transferData.priorityLevel = selectedPriority;
      }

      switch (selectedOption.type) {
        case 'team':
          transferData.teamId = selectedOption.id;
          break;
        case 'user':
          transferData.userId = selectedOption.id;
          break;
        case 'agent':
          transferData.agentId = selectedOption.id;
          break;
      }

      const response = await fetchApi(`/api/tickets/${ticketId}/transfer`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao transferir atendimento');
      }

      toast.success(`Atendimento transferido para ${selectedOption.name} com sucesso!`);
      onTransferSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao transferir:', error);
      setError(error instanceof Error ? error.message : 'Erro ao transferir atendimento');
    } finally {
      setIsTransferring(false);
    }
  };

  const getOptionsList = (): TransferOption[] => {
    switch (activeTab) {
      case 'teams':
        return Array.isArray(teams) ? teams.map(team => ({
          type: 'team',
          id: team.id,
          name: team.name,
          description: team.description,
          imageUrl: team.imageUrl
        })) : [];
      case 'users':
        return Array.isArray(users) ? users.map(user => ({
          type: 'user',
          id: user.id,
          name: user.name,
          description: user.email,
          teamName: 'Usuário Individual'
        })) : [];
      case 'agents':
        return Array.isArray(agents) ? agents.map(agent => ({
          type: 'agent',
          id: agent.id,
          name: agent.name,
          description: agent.description,
          imageUrl: agent.imageUrl
        })) : [];
      default:
        return [];
    }
  };

  const getPriorityColor = (priority: TicketPriorityLevel) => {
    switch (priority) {
      case TicketPriorityLevel.CRITICAL:
        return 'bg-red-500 hover:bg-red-600';
      case TicketPriorityLevel.HIGH:
        return 'bg-orange-500 hover:bg-orange-600';
      case TicketPriorityLevel.MEDIUM:
        return 'bg-yellow-500 hover:bg-yellow-600';
      case TicketPriorityLevel.LOW:
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getPriorityLabel = (priority: TicketPriorityLevel) => {
    switch (priority) {
      case TicketPriorityLevel.CRITICAL:
        return 'Crítica';
      case TicketPriorityLevel.HIGH:
        return 'Alta';
      case TicketPriorityLevel.MEDIUM:
        return 'Média';
      case TicketPriorityLevel.LOW:
        return 'Baixa';
      default:
        return 'Média';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white-pure border border-white-warm shadow-white-elevated">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Transferir Atendimento
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Selecione para quem deseja transferir este atendimento
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 elevated-1 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          {activeTab !== 'agents' && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Prioridade do Atendimento</h4>
              <div className="flex gap-2 flex-wrap">
                {Object.values(TicketPriorityLevel).map((priority) => (
                  <Button
                    key={priority}
                    variant={selectedPriority === priority ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPriority(priority)}
                    className={selectedPriority === priority ? getPriorityColor(priority) : ""}
                  >
                    {getPriorityLabel(priority)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Transferir Para</h4>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'teams' | 'users' | 'agents')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="teams" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Equipes
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Usuários
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Agentes IA
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-0">
                {isLoading ? (
                  <div className="h-64 w-full rounded-md border border-white-warm">
                    <div className="p-4 space-y-2">
                      {[...Array(3)].map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg border border-white-warm"
                        >
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-64 w-full rounded-md border border-white-warm">
                    <div className="p-4 space-y-2">
                      {getOptionsList().map((option) => (
                        <div
                          key={`${option.type}-${option.id}`}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedOption?.id === option.id && selectedOption?.type === option.type
                              ? 'border-primary bg-primary/5'
                              : 'border-white-warm hover:border-primary/50 hover:bg-white-soft'
                          }`}
                          onClick={() => setSelectedOption(option)}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={option.imageUrl} />
                            <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white font-semibold">
                              {option.type === 'agent' ? (
                                <Bot className="h-5 w-5" />
                              ) : (
                                option.name.charAt(0).toUpperCase()
                              )}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{option.name}</p>
                              {option.teamName && (
                                <span className="text-xs text-muted-foreground">
                                  • {option.teamName}
                                </span>
                              )}
                            </div>
                            {option.description && (
                              <p className="text-sm text-muted-foreground">
                                {option.description.length > 60
                                  ? `${option.description.substring(0, 60)}...`
                                  : option.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {selectedOption?.id === option.id && selectedOption?.type === option.type && (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}

                      {getOptionsList().length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Nenhum {activeTab === 'teams' ? 'equipe' : activeTab === 'users' ? 'usuário' : 'agente'} disponível</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* {false && (
            <div className="bg-white-soft border border-white-warm rounded-lg p-4 elevated-1">
              <h5 className="font-medium text-foreground mb-2">Transferindo Para:</h5>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedOption.imageUrl} />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white font-semibold text-sm">
                    {selectedOption.type === 'agent' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      selectedOption.name.charAt(0).toUpperCase()
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{selectedOption.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedOption.type === 'team' ? 'Equipe' : 
                     selectedOption.type === 'user' ? 'Usuário' : 'Agente IA'} • 
                    Prioridade: {getPriorityLabel(selectedPriority)}
                  </p>
                </div>
              </div>
            </div>
          )} */}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white-warm">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isTransferring}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={!selectedOption || isTransferring}
            className="bg-primary hover:bg-primary/90"
          >
            {isTransferring ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Transferindo...
              </>
            ) : (
              'Transferir Atendimento'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 