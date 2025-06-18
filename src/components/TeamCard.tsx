import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Eye, Pencil, Trash, Users } from "lucide-react";
import { Team } from "@/app/dashboard/teams/page";
import { useRouter } from "next/navigation";
import { TeamDetailsPanel } from "./TeamDetailsPanel";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { useState } from "react";

export function TeamCard({
  team,
  onDeleteSuccess,
  toSelectTeam,
  isSelected,
  onToggleSelection,
}: {
  team: Team;
  toSelectTeam: boolean;
  onDeleteSuccess?: (teamId: number) => void | undefined;
  isSelected?: boolean;
  onToggleSelection?: (teamId: number) => void;
}) {
  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const openTeamPanel = () => {
    setIsPanelOpen(true);
  };

  const closeTeamPanel = () => {
    setIsPanelOpen(false);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleSelectTeam = (teamId: number) => {
    if (onToggleSelection) {
      onToggleSelection(teamId);
    } else {
      // Fallback para o comportamento local
      if (selectedTeams.includes(teamId)) {
        setSelectedTeams(selectedTeams.filter((id) => id !== teamId));
      } else {
        setSelectedTeams([...selectedTeams, teamId]);
      }
    }
  };

  return (
    <>
      <Card
        key={team.id}
        className="hover:border-primary/50 transition-colors w-[420px]"
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12 ">
            <AvatarImage
              src={team.imageUrl}
              alt={team.name}
              className="rounded-full"
            />
            <AvatarFallback>
              {team.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {team.members.length} membros
                </CardDescription>
              </div>
              {!toSelectTeam && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => openTeamPanel()}
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
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
            <span className="font-bold">Responsável: </span>
            {team.owner.name}
          </p>
          <p className="text-sm text-muted-foreground mb-2 min-h-24 flex flex-col gap-2">
            <span className="font-bold">Descrição: </span>
            {team.description.length > 80
              ? `${team.description.substring(0, 80)}...`
              : team.description}
          </p>
          <div className="text-sm text-muted-foreground text-center flex justify-start">
            <span className="inline-flex items-start -space-x-4">
              {team.members.length > 0 ? (
                <div className="flex flex-col gap-2 items-start">
                  <p className="text-sm text-muted-foreground font-bold">
                    Membros:
                  </p>
                  <span className="inline-flex items-center -space-x-4 ">
                    {team.members.map((member, index) => (
                      <Avatar key={index} className="size-12">
                        <AvatarImage
                          src={"https://github.com/shadcn.png"}
                          alt={member.name}
                          className="rounded-full"
                        />
                      </Avatar>
                    ))}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum membro encontrado
                </p>
              )}
            </span>
          </div>

          {toSelectTeam && (
            <Button 
              variant={(isSelected ?? selectedTeams.includes(team.id)) ? "outline" : "default"} 
              className="w-full mt-4" 
              onClick={() => handleSelectTeam(team.id)}
            >
              {(isSelected ?? selectedTeams.includes(team.id)) ? "Remover" : "Selecionar"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Team Details Panel */}
      <TeamDetailsPanel
        team={team}
        isOpen={isPanelOpen}
        onClose={closeTeamPanel}
      />

      {/* Delete Team Dialog */}
      <DeleteTeamDialog
        team={team}
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onSuccess={onDeleteSuccess ?? (() => {})}
      />
    </>
  );
}
