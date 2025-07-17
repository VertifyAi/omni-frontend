"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { fetchApi } from "@/lib/fetchApi";
import { Plus, Mail, Phone, Pencil, Trash, Eye, MapPin, Calendar, Search, ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CustomerDetailsPanel } from "@/components/CustomerDetailsPanel";
import { DeleteCustomerDialog } from "@/components/DeleteCustomerDialog";
import { Customer } from "@/types/customer";
import { formatPhoneNumber } from "@/lib/utils";

type SortField = 'name' | 'email' | 'phone' | 'createdAt' | 'city';
type SortDirection = 'asc' | 'desc';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);

      // Construir query params para o backend
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      if (debouncedSearchTerm) {
        queryParams.append("search", debouncedSearchTerm);
      }

      const response = await fetchApi(`/api/customers?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar contatos");
      }

      // Assumindo que o backend retorna: { customers: Customer[], total: number, totalPages: number }
      if (Array.isArray(data)) {
        // Fallback para caso o backend ainda não implemente paginação
        setCustomers(data);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / limit));
      } else {
        setCustomers(data.customers || data.data || []);
        setTotalItems(data.total || 0);
        setTotalPages(data.totalPages || Math.ceil((data.total || 0) / limit));
      }
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      toast.error("Erro ao carregar contatos");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Ordenação client-side dos resultados da página atual
  const sortedCustomers = [...customers].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;
    
    switch (sortField) {
      case 'name':
        aValue = a.name ? a.name.toLowerCase() : '';
        bValue = b.name ? b.name.toLowerCase() : '';
        break;
      case 'email':
        aValue = a.email ? a.email.toLowerCase() : '';
        bValue = b.email ? b.email.toLowerCase() : '';
        break;
      case 'phone':
        aValue = a.phone || '';
        bValue = b.phone || '';
        break;
      case 'city':
        aValue = a.city ? a.city.toLowerCase() : '';
        bValue = b.city ? b.city.toLowerCase() : '';
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDeleteSuccess = (deletedCustomerId: number) => {
    setCustomers(customers.filter((customer) => customer.id !== deletedCustomerId));
    setTotalItems(prev => prev - 1);
  };

  const openCustomerPanel = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsPanelOpen(true);
  };

  const closeCustomerPanel = () => {
    setIsPanelOpen(false);
    setSelectedCustomer(null);
  };

  const openDeleteDialog = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    openDeleteDialog(customer);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search change
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 opacity-40" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 opacity-100" /> : 
      <ChevronDown className="h-4 w-4 opacity-100" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxDisplayed = 5; // Maximum number of page links to display

    if (totalPages <= maxDisplayed) {
      // If total pages are less than max displayed, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);

      // Calculate start and end of the middle section
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      // Adjust if we're at the beginning or end
      if (page <= 2) {
        end = Math.min(4, totalPages - 1);
      } else if (page >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis (using different value to have unique keys)
      }

      // Always include last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-8 p-8 ml-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Contatos
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar contato por nome, email, telefone ou cidade"
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b bg-muted/20 text-sm font-medium text-muted-foreground">
                <div className="col-span-3">
                  <div className="flex items-center gap-1">
                    <span>Contato</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-1">
                    <span>Email</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <span>Telefone</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <span>Cidade</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1">
                    <span>Criado</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  <span>Ações</span>
                </div>
              </div>

              {/* Table Body Skeleton */}
              <div className="flex flex-col">
                {[...Array(limit)].map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-border/40 last:border-b-0"
                  >
                    {/* Contato */}
                    <div className="col-span-3 flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-3 flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded flex-shrink-0" />
                      <Skeleton className="h-4 w-40" />
                    </div>

                    {/* Telefone */}
                    <div className="col-span-2 flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded flex-shrink-0" />
                      <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Cidade */}
                    <div className="col-span-2 flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded flex-shrink-0" />
                      <Skeleton className="h-4 w-20" />
                    </div>

                    {/* Data de Criação */}
                    <div className="col-span-1 flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded flex-shrink-0" />
                      <Skeleton className="h-4 w-16" />
                    </div>

                    {/* Ações */}
                    <div className="col-span-1 flex items-center justify-center">
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : sortedCustomers.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Nenhum contato encontrado</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm 
                    ? "Tente ajustar a busca ou crie um novo contato."
                    : "Comece criando seu primeiro contato para automatizar o atendimento."
                  }
                </p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/customers/create">
                    <Plus className="mr-2 h-4 w-4" />
                    {searchTerm ? "Novo Contato" : "Criar Primeiro Contato"}
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b bg-muted/20 text-sm font-medium text-muted-foreground">
                <div className="col-span-3">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Contato</span>
                      {getSortIcon('name')}
                    </div>
                  </Button>
                </div>
                <div className="col-span-3">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Email</span>
                      {getSortIcon('email')}
                    </div>
                  </Button>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Telefone</span>
                      {getSortIcon('phone')}
                    </div>
                  </Button>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('city')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Cidade</span>
                      {getSortIcon('city')}
                    </div>
                  </Button>
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Criado</span>
                      {getSortIcon('createdAt')}
                    </div>
                  </Button>
                </div>
                <div className="col-span-1 text-center">
                  <span>Ações</span>
                </div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col">
                {sortedCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="group grid grid-cols-12 gap-4 px-4 py-4 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-b-0"
                  >
                    {/* Contato */}
                    <div className="col-span-3 flex items-center gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={customer.profilePicture || `https://avatar.vercel.sh/${customer.name || 'User'}.png`}
                          alt={customer.name || 'Usuário'}
                        />
                        <AvatarFallback className="text-xs">
                          {customer.name
                            ? customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : 'N/A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{customer.name || 'Nome não informado'}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          ID: {customer.id}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-3 flex items-center">
                      {customer.email ? (
                        <div className="flex items-center gap-1 min-w-0">
                          <Mail className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground truncate">{customer.email}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground/50">Não informado</span>
                      )}
                    </div>

                    {/* Telefone */}
                    <div className="col-span-2 flex items-center">
                      {customer.phone ? (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{formatPhoneNumber(customer.phone)}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground/50">Não informado</span>
                      )}
                    </div>

                    {/* Cidade */}
                    <div className="col-span-2 flex items-center">
                      {customer.city ? (
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground truncate">{customer.city}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground/50">Não informado</span>
                      )}
                    </div>

                    {/* Data de Criação */}
                    <div className="col-span-1 flex items-center">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{formatDate(customer.createdAt)}</span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-muted transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openCustomerPanel(customer)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/customers/${customer.id}`)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCustomer(customer)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Mostrando {customers.length} de {totalItems} contatos
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">
                Itens por página:
              </span>
              <Select
                value={limit.toString()}
                onValueChange={(value) => handleLimitChange(Number(value))}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && handlePageChange(page - 1)}
                      className={
                        page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers().map((pageNum, i) => (
                    <PaginationItem key={`page-${pageNum}-${i}`}>
                      {pageNum === -1 || pageNum === -2 ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={page === pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        page < totalPages && handlePageChange(page + 1)
                      }
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Panel */}
      <CustomerDetailsPanel
        customerId={selectedCustomer?.id || null}
        isOpen={isPanelOpen}
        onClose={closeCustomerPanel}
      />

      {/* Delete Customer Dialog */}
      <DeleteCustomerDialog
        customer={customerToDelete}
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}

// Custom Ellipsis component
function PaginationEllipsis() {
  return (
    <span className="flex h-9 w-9 items-center justify-center">
      <span className="h-4 w-4">...</span>
      <span className="sr-only">More pages</span>
    </span>
  );
}
