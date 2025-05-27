"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { fetchApi } from "@/lib/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const EditProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().optional(),
  role: z.string().optional(),
  street_name: z.string().optional(),
  street_number: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().optional(),
  areaId: z.number().optional(),
});

type EditProfileFormData = z.infer<typeof EditProfileSchema>;

export default function SettingsProfilePage() {
  const { user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "",
      street_name: user?.streetName || "",
      street_number: user?.streetNumber || "",
      city: user?.city || "",
      state: user?.state || "",
      phone: user?.phone || "",
      areaId: user?.areaId || undefined,
    },
  });

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      setIsSubmitting(true);
      await fetchApi(`/api/users/${user?.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setIsSubmitting(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    form.reset({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "",
      street_name: user?.streetName || "",
      street_number: user?.streetNumber || "",
      city: user?.city || "",
      state: user?.state || "",
      phone: user?.phone || "",
      areaId: user?.areaId || undefined,
    });
  }, [user, form]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-8 p-8">
          <div>
            <h1 className="text-3xl font-bold">Configurações do Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie as configurações básicas do seu perfil
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Seu nome completo"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="Seu email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    {...form.register("password")}
                    placeholder="Deixe em branco para manter a senha atual"
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Função</Label>
                  <Input
                    id="role"
                    {...form.register("role")}
                    placeholder="Sua função"
                  />
                  {form.formState.errors.role && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.role.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="street_name">Rua</Label>
                    <Input
                      id="street_name"
                      {...form.register("street_name")}
                      placeholder="Nome da rua"
                    />
                    {form.formState.errors.street_name && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.street_name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="street_number">Número</Label>
                    <Input
                      id="street_number"
                      {...form.register("street_number")}
                      placeholder="Número"
                    />
                    {form.formState.errors.street_number && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.street_number.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      {...form.register("city")}
                      placeholder="Cidade"
                    />
                    {form.formState.errors.city && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      {...form.register("state")}
                      placeholder="Estado"
                    />
                    {form.formState.errors.state && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.state.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    placeholder="Seu telefone"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="areaId">ID da Área</Label>
                  <Input
                    id="areaId"
                    type="number"
                    {...form.register("areaId", { valueAsNumber: true })}
                    placeholder="ID da sua área"
                  />
                  {form.formState.errors.areaId && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.areaId.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Separator />

            <div className="flex justify-end">
              <Button
                disabled={isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
