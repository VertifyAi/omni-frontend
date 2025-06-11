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
import { Camera, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/fetchApi";
import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const createTeamSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  members: z.array(z.number()).min(1, "Selecione pelo menos um usuário"),
  ownerId: z.number().min(1, "Selecione o proprietário da equipe"),
});

type CreateTeamFormData = z.infer<typeof createTeamSchema>;

interface User {
  id: number;
  name: string;
  email: string;
}

export default function EditTeamPage() {
  const params = useParams();
  const teamId = params.id as string;

  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      ownerId: 0,
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
      }
    };

    const fetchTeam = async () => {
      const response = await fetchApi(`/api/teams/${teamId}`);
      const data = await response.json();

      form.setValue("name", data.name);
      form.setValue("description", data.description);
      form.setValue(
        "members",
        data.members.map((member: User) => member.id)
      );
      form.setValue("ownerId", data.owner.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSelectedUsers(data.members.map((member: User) => member.id));

      // Carregar imagem da equipe se existir
      if (data.imageUrl) {
        setImagePreview(data.imageUrl);
      }
    };

    Promise.all([fetchUsers(), fetchTeam()]).finally(() => {
      setIsLoading(false);
    });
  }, [teamId, form]);

  const onSubmit = async (data: CreateTeamFormData) => {
    try {
      const response = await fetchApi(`/api/teams/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Erro ao atualizar equipe");
      }

      if (selectedImage && responseData.id) {
        await uploadTeamImage(responseData.id);
      }

      toast.success("Equipe atualizada com sucesso!");
      router.push("/dashboard/teams");
    } catch (error) {
      console.error("Erro ao atualizar equipe:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

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
      const response = await fetchApi(`/api/teams/${teamId}/upload-image`, {
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

  return (
    <div className="flex flex-col justify-center items-center p-8 ml-16">
      <div className="mb-8 w-full">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Editar Equipe
        </h1>
        <p className="text-muted-foreground mt-2">
          Atualize os dados da equipe abaixo.
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
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <FormControl>
                      <Input
                        placeholder="Ex: Equipe de Desenvolvimento"
                        {...field}
                      />
                    </FormControl>
                  )}
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
                  {isLoading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-28 w-full" />
                    </div>
                  ) : (
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o propósito desta equipe..."
                        className="min-h-28"
                        {...field}
                      />
                    </FormControl>
                  )}
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
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                        }}
                        value={field.value.toString()}
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
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="size-4">
                                  <AvatarImage src="https://github.com/shadcn.png" />
                                </Avatar>
                                {user.name}
                              </div>
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

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                </div>
              </div>
            ) : (
              selectedUsers.length > 0 && (
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
              )
            )}

            <div className="flex gap-4">
              <Button type="submit">Salvar Alterações</Button>
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
