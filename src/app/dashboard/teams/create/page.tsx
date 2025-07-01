"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/fetchApi";
import { User } from "@/types/users";
import { Camera, Users } from "lucide-react";
import { setMixpanelTrack } from "@/lib/mixpanelClient";

const createTeamSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  ownerId: z.string().min(1, "Selecione um usuário"),
  members: z.array(z.number()).min(1, "Selecione pelo menos um usuário"),
});

type CreateTeamFormData = z.infer<typeof createTeamSchema>;

export default function CreateTeamPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      description: "",
      members: [],
      ownerId: "",
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetchApi(`/api/users`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar usuários");
        }

        setUsers(data.users);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast.error(
          error instanceof Error ? error.message : "Erro ao carregar usuários"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione apenas arquivos de imagem");
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      setSelectedImage(file);

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadTeamImage = async (teamId: number) => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch(`/api/teams/${teamId}/upload-picture`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao fazer upload da imagem");
      }

      toast.success("Imagem da equipe carregada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao fazer upload da imagem"
      );
    }
  };

  const onSubmit = async (data: CreateTeamFormData) => {
    try {
      const response = await fetchApi("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          ownerId: Number(data.ownerId),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Erro ao criar equipe");
      }

      setMixpanelTrack("team_created", {
        event_id: "team_created",
        properties: {
          team: responseData.team,
          timestamp: new Date().toISOString(),
        },
      });

      toast.success("Equipe criada com sucesso!");

      // Fazer upload da imagem se uma foi selecionada
      if (selectedImage && responseData.team?.id) {
        await uploadTeamImage(responseData.team.id);
      }

      router.push("/dashboard/teams");
    } catch (error) {
      console.error("Erro ao criar equipe:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-8 ml-16">
      <div className="mb-8 w-full">
        <h1 className="text-3xl font-bold">Criar Nova Equipe</h1>
        <p className="text-muted-foreground mt-2">
          Preencha os dados abaixo para criar uma nova equipe.
        </p>
      </div>

      <div className="max-w-4xl w-full">
        {/* Input de Imagem */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div
              className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview da equipe"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Users className="w-8 h-8 mb-2" />
                  <span className="text-xs text-center">
                    Foto da
                    <br />
                    Equipe
                  </span>
                </div>
              )}
            </div>

            {/* Botão de câmera */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <p className="text-sm text-muted-foreground mt-2 text-center">
            Clique para adicionar uma foto da equipe
            <br />
            <span className="text-xs">Máximo 5MB • JPG, PNG, GIF</span>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Equipe</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Equipe de Desenvolvimento"
                      {...field}
                    />
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
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário Responsável</FormLabel>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione os membros" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => {
                            if (user.role === "USER") return;
                            return (
                              <SelectItem
                                key={user.id}
                                value={user.id.toString()}
                                disabled={selectedUsers.includes(user.id)}
                              >
                                {user.name} ({user.email})
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuários da Equipe</FormLabel>
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Membros selecionados:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((userId) => {
                    const user = users.find((u) => u.id === userId);
                    return (
                      <div
                        key={userId}
                        className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-sm"
                      >
                        <span>{user?.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUsers(
                              selectedUsers.filter((id) => id !== userId)
                            );
                            form.setValue(
                              "members",
                              selectedUsers.filter((id) => id !== userId)
                            );
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
              <Button type="submit">Criar Equipe</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/teams")}
                disabled={isLoading}
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
