"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Plus, Users, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export interface Team {
  id: number;
  name: string;
  description: string;
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
  const router = useRouter();

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

  return (
    <div className="flex flex-col gap-8 p-8 ml-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Equipes</h1>
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
        <div className="text-center flex justify-between gap-4">
          <Skeleton className="h-60 w-1/3" />
          <Skeleton className="h-60 w-1/3" />
          <Skeleton className="h-60 w-1/3" />
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-8">Nenhuma equipe encontrada.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/teams/${team.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-bold">Responsável: </span>
                  {team.owner.name}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-bold">Descrição: </span>
                  {team.description.length > 80
                    ? `${team.description.substring(0, 80)}...`
                    : team.description}
                </p>
                <div className="text-sm text-muted-foreground text-center flex justify-start">
                  <span className="inline-flex items-start -space-x-4">
                    {team.members.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground font-bold">
                          Membros:
                        </p>
                        {team.members.map((member, index) => (
                          <Avatar key={index} className="size-12 border">
                            <AvatarImage
                              src={"https://github.com/shadcn.png"}
                              alt={member.name}
                            />
                          </Avatar>
                        ))}
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
          ))}
        </div>
      )}
    </div>
  );
}
