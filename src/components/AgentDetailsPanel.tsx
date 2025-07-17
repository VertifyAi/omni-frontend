"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Agent } from "@/types/agent";

interface AgentDetailsPanelProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AgentDetailsPanel({
  agent,
  isOpen,
  onClose,
}: AgentDetailsPanelProps) {
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

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isAnimating ? "opacity-40" : "opacity-0"
        }`}
        onClick={handleOverlayClick}
      />

      {/* Side Panel */}
      <div
        className={`fixed right-4 top-4 bottom-4 w-[500px] bg-white-pure border border-white-warm shadow-white-elevated z-50 overflow-y-auto transition-transform duration-300 ease-out rounded-2xl ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white-warm">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Detalhes do Agente
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

          {agent && (
            <div className="space-y-6">
              {/* Agent Info */}
              <div className="flex items-center gap-4 p-4 bg-white-soft rounded-xl border border-white-warm elevated-1">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage
                    src={
                      agent.imageUrl ||
                      `https://avatar.vercel.sh/${agent.name || "User"}.png`
                    }
                    alt={agent.name || "Usuário"}
                  />
                  <AvatarFallback className="text-xs">
                    {agent.name
                      ? agent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "N/A"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {agent.name}
                  </h3>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-primary" />
                    Agente Virtual
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                  Descrição
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {agent.description}
                </p>
              </div>

              {/* System Message */}
              {agent.systemMessage && (
                <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                  <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                    Mensagem do Sistema
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {agent.systemMessage}
                  </p>
                </div>
              )}

              {/* Creation Date */}
              {agent.createdAt && (
                <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                  <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                    Data de Criação
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {new Date(agent.createdAt).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
