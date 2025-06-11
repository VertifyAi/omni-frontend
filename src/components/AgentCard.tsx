"use client";

import { Eye, Pencil, Trash, Users, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AgentCardProps } from "@/types/agent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AgentDetailsPanel } from "./AgentDetailsPanel";
import { DeleteAgentDialog } from "./DeleteAgentDialog";

export function AgentCard({ agent, onDeleteSuccess }: AgentCardProps) {
  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openAgentPanel = () => {
    setIsPanelOpen(true);
  };

  const closeAgentPanel = () => {
    setIsPanelOpen(false);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <Card
        key={agent.id}
        className="hover:border-primary/50 transition-colors w-[420px]"
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            {agent.imageUrl ? (
              <AvatarImage src={agent.imageUrl} alt={agent.name} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-r from-[#E97939] to-[#8A39DB] text-white">
              {getInitials(agent.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{agent.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Agente IA
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              onClick={() => openAgentPanel()}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer"
              onClick={() => router.push(`/dashboard/teams/2`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => openDeleteDialog()}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {agent.description || "Nenhuma descrição disponível."}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            WhatsApp: {agent.whatsappNumber}
          </div>
        </CardContent>
      </Card>

      {/* Agent Details Panel */}
      <AgentDetailsPanel
        agent={agent}
        isOpen={isPanelOpen}
        onClose={closeAgentPanel}
      />

      {/* Delete Agent Dialog */}
      <DeleteAgentDialog
        agent={agent}
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onSuccess={onDeleteSuccess}
      />
    </>
  );
}
