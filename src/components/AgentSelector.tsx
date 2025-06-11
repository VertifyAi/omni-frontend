"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AgentCard } from "@/components/AgentCard";
import { Agent } from "@/types/agent";
import { Check } from "lucide-react";

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent?: Agent;
  onSelectAgent: (agent: Agent) => void;
  triggerText?: string;
}

export function AgentSelector({
  agents,
  selectedAgent,
  onSelectAgent,
  triggerText = "Selecionar Agente"
}: AgentSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleAgentSelect = (agent: Agent) => {
    onSelectAgent(agent);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {selectedAgent ? selectedAgent.name : triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar Agente</DialogTitle>
          <DialogDescription>
            Escolha um agente para esta integração
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.id} className="relative">
              <div 
                className={`cursor-pointer transition-all ${
                  selectedAgent?.id === agent.id
                    ? 'ring-2 ring-primary border-primary rounded-lg'
                    : 'hover:opacity-80'
                }`}
                onClick={() => handleAgentSelect(agent)}
              >
                <AgentCard agent={agent} />
              </div>
              {selectedAgent?.id === agent.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 