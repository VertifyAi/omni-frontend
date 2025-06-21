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
import { Plus, Mail, Phone, Pencil, Trash, Eye, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CustomerDetailsPanel } from "@/components/CustomerDetailsPanel";

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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const router = useRouter();

  const handleDeleteSuccess = (deletedCustomerId: number) => {
    setCustomers(customers.filter((customer) => customer.id !== deletedCustomerId));
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetchApi("/api/customers");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar contatos");
        }

        setCustomers(data);
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Erro ao carregar contatos"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const openCustomerPanel = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsPanelOpen(true);
  };

  const closeCustomerPanel = () => {
    setIsPanelOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = async (customerId: number) => {
    if (!confirm("Tem certeza que deseja excluir este contato?")) {
      return;
    }

    try {
      const response = await fetchApi(`/api/customers/${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir contato");
      }

      toast.success("Contato excluído com sucesso!");
      handleDeleteSuccess(customerId);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir contato");
    }
  };

  const formatAddress = (customer: Customer) => {
    const parts = [];
    if (customer.streetName) parts.push(customer.streetName);
    if (customer.streetNumber) parts.push(customer.streetNumber);
    if (customer.city) parts.push(customer.city);
    if (customer.state) parts.push(customer.state);
    return parts.join(", ") || "Endereço não informado";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-8 p-8 ml-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Meus Contatos
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus contatos e informações
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/customers/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Contato
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle>
                        <Skeleton className="h-4 w-24" />
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <Skeleton className="h-3 w-16" />
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        disabled
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                    <div className="flex-1">
                      <CardTitle className="text-base">{customer.name}</CardTitle>
                      <CardDescription>
                        {customer.companyId
                          ? `Empresa #${customer.companyId}`
                          : "Pessoa física"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => openCustomerPanel(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{formatAddress(customer)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Cliente desde {formatDate(customer.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Customer Details Panel */}
      <CustomerDetailsPanel
        customerId={selectedCustomer?.id || null}
        isOpen={isPanelOpen}
        onClose={closeCustomerPanel}
      />
    </div>
  );
}
