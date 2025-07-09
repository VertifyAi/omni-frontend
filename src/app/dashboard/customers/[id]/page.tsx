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
import { fetchApi } from "@/lib/fetchApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Camera, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const createCustomerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  street_name: z.string().optional().or(z.literal("")),
  street_number: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;

export default function EditCustomerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();

  const form = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      email: "",
      street_name: "",
      street_number: "",
      city: "",
      state: "",
      phone: "",
    },
  });

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

  const uploadCustomerImage = async (customerId: number) => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetchApi(`/api/customers/${customerId}/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao fazer upload da imagem");
      }

      toast.success("Imagem do contato carregada com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao fazer upload da imagem"
      );
    }
  };

  const onSubmit = async (data: CreateCustomerFormData) => {
    try {
      setIsLoading(true);
      const response = await fetchApi(`/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Erro ao editar contato");
      }

      toast.success("Contato atualizado com sucesso!");

      // Fazer upload da imagem se uma foi selecionada
      if (selectedImage && responseData.id) {
        await uploadCustomerImage(responseData.id);
      }

      router.push("/dashboard/customers");
    } catch (error) {
      console.error("Erro ao editar contato:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function loadCustomer() {
      try {
        const response = await fetchApi(`/api/customers/${id}`);
        const data = await response.json();
        
        form.reset({
          ...data,
          street_name: data.streetName,
          street_number: data.streetNumber,
        });

        // Carregar imagem do contato se existir
        if (data.profilePicture) {
          setImagePreview(data.profilePicture);
        }
      } catch (error) {
        console.error("Erro ao carregar contato:", error);
        toast.error("Erro ao carregar dados do contato");
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomer();
  }, [id, form]);

  return (
    <div className="flex flex-col justify-center items-center p-8 ml-16">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Editar Contato
          </h1>
          <p className="text-muted-foreground">
            Atualize os dados do contato abaixo.
          </p>
        </div>
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
                  alt="Preview do contato"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <User className="w-8 h-8 mb-2" />
                  <span className="text-xs text-center">
                    Foto do
                    <br />
                    Contato
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
            Clique para adicionar uma foto do contato
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
                  <FormLabel>Nome*</FormLabel>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <FormControl>
                      <Input placeholder="João Silva" {...field} />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="joao.silva@email.com"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="street_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    {isLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <FormControl>
                        <Input placeholder="Rua das Flores" {...field} />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    {isLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    {isLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    {isLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <FormControl>
                        <Input placeholder="SP" {...field} />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Editando..." : "Salvar Alterações"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/customers")}
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
