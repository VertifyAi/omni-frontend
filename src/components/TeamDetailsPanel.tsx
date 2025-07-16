"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Team } from "@/types/team";
import { X, Mail, User as UserIcon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@/types/users";

interface TeamDetailsPanelProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TeamDetailsPanel({ team, isOpen, onClose }: TeamDetailsPanelProps) {
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
              Detalhes da Equipe
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

          {team && (
            <div className="space-y-6">
              {/* Team Info */}
              <div className="flex items-center gap-4 p-4 bg-white-soft rounded-xl border border-white-warm elevated-1">
                <Avatar className="h-16 w-16 border-2 border-white-warm">
                  <AvatarImage src={team.imageUrl} />
                  <AvatarFallback className="text-lg bg-gradient-brand text-foreground font-semibold">
                    {team.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{team.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Users className="h-4 w-4 text-primary" />
                    {team.members.length} {team.members.length === 1 ? 'membro' : 'membros'}
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
                  {team.description}
                </p>
              </div>

              {/* Owner */}
              <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                  Responsável
                </h4>
                <div className="flex items-center gap-3 p-3 bg-white-pure rounded-lg border border-white-warm hover-white-soft transition-all duration-200">
                  <Avatar className="h-12 w-12 border border-white-warm">
                    <AvatarImage 
                      src="https://github.com/shadcn.png" 
                      alt={team.owner.name} 
                    />
                    <AvatarFallback className="bg-gradient-cool text-white font-semibold">
                      {team.owner.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium flex items-center gap-2 text-foreground">
                      <UserIcon className="h-4 w-4 text-primary" />
                      {team.owner.name}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-primary" />
                      {team.owner.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div className="bg-white-soft rounded-xl p-4 border border-white-warm elevated-1">
                <h4 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-brand rounded-full"></div>
                  Membros ({team.members.length})
                </h4>
                {team.members.length > 0 ? (
                  <div className="space-y-3">
                    {team.members.map((member: User, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white-pure rounded-lg border border-white-warm hover-white-soft transition-all duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Avatar className="h-10 w-10 border border-white-warm">
                          <AvatarImage 
                            src="https://github.com/shadcn.png" 
                            alt={member.name} 
                          />
                          <AvatarFallback className="bg-gradient-cool text-white text-sm font-semibold">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium flex items-center gap-2 text-foreground">
                            <UserIcon className="h-4 w-4 text-primary" />
                            {member.name}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Mail className="h-4 w-4 text-primary" />
                            {member.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Nenhum membro encontrado
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 