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
import { Plus, Mail, Phone, Pencil } from "lucide-react";
import Link from "next/link";
import { fetchApi } from "@/lib/fetchApi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  companyId: number;
  streetName?: string;
  streetNumber?: string;
  city?: string;
  state?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    async function loadCustomers() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchApi("/api/customers");

        if (!response.ok) {
          throw new Error("Falha ao carregar os contatos");
        }

        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Erro ao carregar contatos:", error);
        setError(
          "Não foi possível carregar os contatos. Tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomers();
  }, []);

  return (
    <div className="flex flex-col gap-8 p-8 ml-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Meus Contatos
          </h1>
          <p className="text-muted-foreground">Gerencie seus contatos</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/customers/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Contato
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <p>Carregando contatos...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Nenhum contato criado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Comece criando seu primeiro contato para automatizar o
              atendimento.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/customers/create">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Contato
              </Link>
            </Button>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <Card
              key={customer.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${customer.name}.png`}
                    alt={customer.name}
                  />
                  <AvatarFallback>
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{customer.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/customers/${customer.id}`)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    {customer.companyId ? `Empresa #${customer.companyId}` : ""}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2">
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
