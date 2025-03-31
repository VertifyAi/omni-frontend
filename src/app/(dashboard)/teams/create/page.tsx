"use client"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { toast } from "sonner";

const createTeamSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  users: z.array(z.number()).min(1, "Selecione pelo menos um usuário"),
});

type CreateTeamFormData = z.infer<typeof createTeamSchema>;

interface User {
  id: number;
  name: string;
  email: string;
}

export default function CreateTeamPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const form = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      description: "",
      users: [],
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const companyId = Cookies.get('company_id');
      if (!companyId) return;

      try {
        const response = await fetch(`/api/users/companies/${companyId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao carregar usuários');
        }

        setUsers(data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        toast.error(error instanceof Error ? error.message : 'Erro ao carregar usuários')
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const onSubmit = async (data: CreateTeamFormData) => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          users: selectedUsers,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Erro ao criar equipe');
      }

      toast.success('Equipe criada com sucesso!')
      router.push('/teams');
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  };

  return (
    <div className="container p-8 ml-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar Nova Equipe</h1>
        <p className="text-muted-foreground mt-2">
          Preencha os dados abaixo para criar uma nova equipe.
        </p>
      </div>

      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Equipe</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Equipe de Desenvolvimento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o propósito desta equipe..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Membros da Equipe</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const userId = parseInt(value);
                      if (!selectedUsers.includes(userId)) {
                        setSelectedUsers([...selectedUsers, userId]);
                        field.onChange([...selectedUsers, userId]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione os membros" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem 
                          key={user.id} 
                          value={user.id.toString()}
                          disabled={selectedUsers.includes(user.id)}
                        >
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Membros selecionados:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((userId) => {
                    const user = users.find(u => u.id === userId);
                    return (
                      <div
                        key={userId}
                        className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm"
                      >
                        <span>{user?.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUsers(selectedUsers.filter(id => id !== userId));
                            form.setValue('users', selectedUsers.filter(id => id !== userId));
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Equipe"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/teams')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
