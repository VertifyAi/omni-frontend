"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchApi } from "@/lib/fetchApi";
import { Plus, Users, Pencil, Trash, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
<<<<<<< HEAD
import { TeamDetailsPanel } from "@/components/TeamDetailsPanel";
import { DeleteTeamDialog } from "@/components/DeleteTeamDialog";
=======
import { TeamCard } from "@/components/TeamCard";
>>>>>>> 61d60be (feat: :rocket:)

export interface Team {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  members: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  owner: {
    id: number;
    name: string;
    email: string;
  };
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
=======

>>>>>>> 61d60be (feat: :rocket:)
  const router = useRouter();

  const handleDeleteSuccess = (deletedTeamId: number) => {
    setTeams(teams.filter((team) => team.id !== deletedTeamId));
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetchApi("/api/teams");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar equipes");
        }

        setTeams(data);
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Erro ao carregar equipes"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const openTeamPanel = (team: Team) => {
    setSelectedTeam(team);
    setIsPanelOpen(true);
  };

  const closeTeamPanel = () => {
    setIsPanelOpen(false);
    setSelectedTeam(null);
  };

  const openDeleteDialog = (team: Team) => {
    setTeamToDelete(team);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setTeamToDelete(null);
  };

  const handleDeleteSuccess = (deletedTeamId: number) => {
    setTeams(teams.filter(team => team.id !== deletedTeamId));
  };

  return (
    <div className="flex flex-col gap-8 p-8 ml-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Minhas Equipes
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas equipes e membros
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/teams/create">
            <Plus className="mr-2 h-4 w-4" />
            Nova Equipe
          </Link>
        </Button>
      </div>

      {isLoading ? (
<<<<<<< HEAD
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:border-primary/50 transition-colors">
=======
        <div className="flex gap-4 flex-wrap">
          <Card className="hover:border-primary/50 transition-colors w-[420px]">
>>>>>>> 61d60be (feat: :rocket:)
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <Skeleton className="h-12 w-12" />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      <Skeleton className="h-4 w-24" />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <Skeleton className="h-4 w-4" />
                      membros
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => {
                        console.log("view");
                      }}
                      disabled
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/teams/2`)}
                      disabled
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-red-500"
                      onClick={() => {
                        console.log("delete");
                      }}
                      disabled
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
<<<<<<< HEAD
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <span className="font-bold">Responsável: </span>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </p>
              <p className="text-sm text-muted-foreground mb-2 min-h-24 flex flex-col gap-2">
                <span className="font-bold">Descrição: </span>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </p>
              <div className="text-sm text-muted-foreground text-center flex justify-start">
                <span className="inline-flex items-start -space-x-4">
                  {true ? (
                    <div className="flex flex-col gap-2 items-start">
                      <p className="text-sm text-muted-foreground font-bold">
                        Membros:
                      </p>

                      <span className="inline-flex items-center -space-x-4 ">
                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum membro encontrado
                    </p>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <Skeleton className="h-12 w-12" />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      <Skeleton className="h-4 w-24" />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <Skeleton className="h-4 w-4" />
                      membros
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => {
                        console.log("view");
                      }}
                      disabled
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/teams/2`)}
                      disabled
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-red-500"
                      onClick={() => {
                        console.log("delete");
                      }}
                      disabled
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <span className="font-bold">Responsável: </span>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </p>
              <p className="text-sm text-muted-foreground mb-2 min-h-24 flex flex-col gap-2">
                <span className="font-bold">Descrição: </span>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-48" />
              </p>
              <div className="text-sm text-muted-foreground text-center flex justify-start">
                <span className="inline-flex items-start -space-x-4">
                  {true ? (
                    <div className="flex flex-col gap-2 items-start">
                      <p className="text-sm text-muted-foreground font-bold">
                        Membros:
                      </p>

                      <span className="inline-flex items-center -space-x-4 ">
                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum membro encontrado
                    </p>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <Skeleton className="h-12 w-12" />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      <Skeleton className="h-4 w-24" />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <Skeleton className="h-4 w-4" />
                      membros
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => {
                        console.log("view");
                      }}
                      disabled
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/teams/2`)}
                      disabled
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-red-500"
                      onClick={() => {
                        console.log("delete");
                      }}
                      disabled
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <span className="font-bold">Responsável: </span>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </p>
              <p className="text-sm text-muted-foreground mb-2 min-h-24 flex flex-col gap-2">
                <span className="font-bold">Descrição: </span>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </p>
              <div className="text-sm text-muted-foreground text-center flex justify-start">
                <span className="inline-flex items-start -space-x-4">
                  {true ? (
                    <div className="flex flex-col gap-2 items-start">
                      <p className="text-sm text-muted-foreground font-bold">
                        Membros:
                      </p>

                      <span className="inline-flex items-center -space-x-4 ">
                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum membro encontrado
                    </p>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Nenhuma equipe encontrada.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={team.imageUrl} />
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
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => openTeamPanel(team)}
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
                        onClick={() => openDeleteDialog(team)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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
                            <Avatar key={index} className="size-12 border">
                              <AvatarImage
                                src={"https://github.com/shadcn.png"}
                                alt={member.name}
                              />
                            </Avatar>
                          ))}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nenhum membro encontrado
=======
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <span className="font-bold">Responsável: </span>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </p>
              <p className="text-sm text-muted-foreground mb-2 min-h-24 flex flex-col gap-2">
                <span className="font-bold">Descrição: </span>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </p>
              <div className="text-sm text-muted-foreground text-center flex justify-start">
                <span className="inline-flex items-start -space-x-4">
                  {true ? (
                    <div className="flex flex-col gap-2 items-start">
                      <p className="text-sm text-muted-foreground font-bold">
                        Membros:
>>>>>>> 61d60be (feat: :rocket:)
                      </p>

                      <span className="inline-flex items-center -space-x-4 ">
                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum membro encontrado
                    </p>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors w-[420px]">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <Skeleton className="h-12 w-12" />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      <Skeleton className="h-4 w-24" />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <Skeleton className="h-4 w-4" />
                      membros
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => {
                        console.log("view");
                      }}
                      disabled
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/teams/2`)}
                      disabled
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-red-500"
                      onClick={() => {
                        console.log("delete");
                      }}
                      disabled
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <span className="font-bold">Responsável: </span>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </p>
              <p className="text-sm text-muted-foreground mb-2 min-h-24 flex flex-col gap-2">
                <span className="font-bold">Descrição: </span>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-48" />
              </p>
              <div className="text-sm text-muted-foreground text-center flex justify-start">
                <span className="inline-flex items-start -space-x-4">
                  {true ? (
                    <div className="flex flex-col gap-2 items-start">
                      <p className="text-sm text-muted-foreground font-bold">
                        Membros:
                      </p>

                      <span className="inline-flex items-center -space-x-4 ">
                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum membro encontrado
                    </p>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors w-[420px]">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <Skeleton className="h-12 w-12" />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      <Skeleton className="h-4 w-24" />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <Skeleton className="h-4 w-4" />
                      membros
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => {
                        console.log("view");
                      }}
                      disabled
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/teams/2`)}
                      disabled
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-red-500"
                      onClick={() => {
                        console.log("delete");
                      }}
                      disabled
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <span className="font-bold">Responsável: </span>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </p>
              <p className="text-sm text-muted-foreground mb-2 min-h-24 flex flex-col gap-2">
                <span className="font-bold">Descrição: </span>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </p>
              <div className="text-sm text-muted-foreground text-center flex justify-start">
                <span className="inline-flex items-start -space-x-4">
                  {true ? (
                    <div className="flex flex-col gap-2 items-start">
                      <p className="text-sm text-muted-foreground font-bold">
                        Membros:
                      </p>

                      <span className="inline-flex items-center -space-x-4 ">
                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>

                        <Avatar className="size-12 border">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </Avatar>
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum membro encontrado
                    </p>
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Nenhuma equipe encontrada.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onDeleteSuccess={handleDeleteSuccess}
              toSelectTeam={false}
            />
          ))}
        </div>
      )}

      {/* Team Details Panel */}
      <TeamDetailsPanel
        team={selectedTeam}
        isOpen={isPanelOpen}
        onClose={closeTeamPanel}
      />

      {/* Delete Team Dialog */}
      <DeleteTeamDialog
        team={teamToDelete}
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
