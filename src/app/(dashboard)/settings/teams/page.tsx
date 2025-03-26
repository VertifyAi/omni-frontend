"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateUserForm } from "@/components/users/CreateUserForm";
import { UserRole } from "@/types/user-role.enum";
import Cookies from 'js-cookie';
import { useToast } from "@/components/ui/use-toast";

// Tipo para usuário
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export default function TeamsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const companyIdFromCookie = Cookies.get('company_id') || null;
    setCompanyId(companyIdFromCookie);
  }, []);

  const fetchUsers = async () => {
    if (!companyId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/companies/${companyId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar usuários');
      }

      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : 'Erro ao carregar usuários',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchUsers();
    }
  }, [companyId]);

  const handleUserCreated = () => {
    fetchUsers();
  };

  const handleEditUser = (userId: string) => {
    // Implementar lógica de edição de usuário
    console.log("Editar usuário:", userId);
  };

  const handleDeleteUser = (userId: string) => {
    // Implementar lógica de exclusão de usuário
    console.log("Excluir usuário:", userId);
  };

  return (
    <div className="container p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Equipe</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os membros da sua equipe e suas permissões.
          </p>
        </div>
        <CreateUserForm onUserCreated={handleUserCreated} companyId={companyId || ""} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membros da Equipe</CardTitle>
          <CardDescription>
            Lista de todos os membros que têm acesso ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Carregando usuários...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4">Nenhum usuário encontrado.</div>
          ) : (
            <div className="divide-y">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="group flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground mr-4">{user.role}</p>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
