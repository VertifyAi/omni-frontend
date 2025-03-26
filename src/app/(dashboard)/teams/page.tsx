"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Team {
  id: number;
  name: string;
  description: string;
  users: Array<{
    id: number;
    name: string;
    email: string;
  }>;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('/api/teams');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao carregar equipes');
        }

        setTeams(data);
      } catch (error) {
        console.error('Erro ao carregar equipes:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: error instanceof Error ? error.message : 'Erro ao carregar equipes',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [toast]);

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
          <Link href="/teams/create">
            <Plus className="mr-2 h-4 w-4" />
            Nova Equipe
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando equipes...</div>
      ) : teams.length === 0 ? (
        <div className="text-center py-8">Nenhuma equipe encontrada.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id} className="hover:border-primary/50 transition-colors">
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
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {team.users.length} membros
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {team.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
