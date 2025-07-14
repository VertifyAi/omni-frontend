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
import { 
  ArrowLeft, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  MoreHorizontal,
  Eye,
  Calendar,
  MessageCircle,
  User
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Ticket, TicketStatus, TicketPriorityLevel } from "@/types/ticket";
import { formatPhoneNumber } from "@/lib/utils";
import "../../../globals.css";

type SortField = 'customer' | 'status' | 'priority' | 'channel' | 'createdAt' | 'lastMessage';
type SortDirection = 'asc' | 'desc';

export default function AllTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true);

      // Construir query params para o backend
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      if (debouncedSearchTerm) {
        queryParams.append("search", debouncedSearchTerm);
      }

      const response = await fetchApi(`/api/tickets?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao carregar atendimentos");
      }

      // Assumindo que o backend retorna um array ou objeto com paginação
      if (Array.isArray(data)) {
        // Fallback para caso o backend ainda não implemente paginação
        setTickets(data);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / limit));
      } else {
        setTickets(data.tickets || data.data || []);
        setTotalItems(data.total || 0);
        setTotalPages(data.totalPages || Math.ceil((data.total || 0) / limit));
      }
    } catch (error) {
      console.error("Erro ao carregar atendimentos:", error);
      toast.error("Erro ao carregar atendimentos");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearchTerm]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Ordenação client-side dos resultados da página atual
  const sortedTickets = [...tickets].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;
    
    switch (sortField) {
      case 'customer':
        aValue = a.customer.name ? a.customer.name.toLowerCase() : '';
        bValue = b.customer.name ? b.customer.name.toLowerCase() : '';
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      case 'priority':
        const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        aValue = priorityOrder[a.priorityLevel] || 0;
        bValue = priorityOrder[b.priorityLevel] || 0;
        break;
      case 'channel':
        aValue = a.channel || '';
        bValue = b.channel || '';
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'lastMessage':
        const lastMessageA = a.ticketMessages?.at(-1)?.createdAt || a.createdAt;
        const lastMessageB = b.ticketMessages?.at(-1)?.createdAt || b.createdAt;
        aValue = new Date(lastMessageA).getTime();
        bValue = new Date(lastMessageB).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
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

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.AI:
        return { label: "IA", color: "bg-purple-100 text-purple-700" };
      case TicketStatus.IN_PROGRESS:
        return { label: "Em Andamento", color: "bg-blue-100 text-blue-700" };
      case TicketStatus.CLOSED:
        return { label: "Fechado", color: "bg-green-100 text-green-700" };
      default:
        return { label: "Desconhecido", color: "bg-gray-100 text-gray-700" };
    }
  };

  const getPriorityLabel = (priority: TicketPriorityLevel) => {
    switch (priority) {
      case TicketPriorityLevel.CRITICAL:
        return { label: "Crítica", color: "bg-red-100 text-red-700", icon: "🔴" };
      case TicketPriorityLevel.HIGH:
        return { label: "Alta", color: "bg-orange-100 text-orange-700", icon: "🟠" };
      case TicketPriorityLevel.MEDIUM:
        return { label: "Média", color: "bg-yellow-100 text-yellow-700", icon: "🟡" };
      case TicketPriorityLevel.LOW:
        return { label: "Baixa", color: "bg-green-100 text-green-700", icon: "🟢" };
      default:
        return { label: "Média", color: "bg-gray-100 text-gray-700", icon: "⚪" };
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'whatsapp':
        return "💬";
      case 'email':
        return "📧";
      case 'sms':
        return "📱";
      default:
        return "💬";
    }
  };

  const getLastMessageTime = (ticket: Ticket) => {
    const lastMessage = ticket.ticketMessages?.at(-1);
    if (lastMessage) {
      return new Date(lastMessage.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return formatDate(ticket.createdAt);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxDisplayed = 5;

    if (totalPages <= maxDisplayed) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 2) {
        end = Math.min(4, totalPages - 1);
      } else if (page >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }

      if (start > 2) {
        pages.push(-1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push(-2);
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col gap-8 p-8 ml-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/tickets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Todos os Atendimentos
            </h1>
            <p className="text-muted-foreground">
              Visualize e gerencie todos os tickets do sistema
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por cliente, canal, status ou prioridade"
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
                    <span>Cliente</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="flex items-center gap-1">
                    <span>Canal</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <span>Prioridade</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <span>Última Atividade</span>
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
                    {/* Cliente */}
                    <div className="col-span-3 flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>

                    {/* Canal */}
                    <div className="col-span-1 flex items-center">
                      <Skeleton className="h-4 w-16" />
                    </div>

                    {/* Prioridade */}
                    <div className="col-span-2 flex items-center">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>

                    {/* Última Atividade */}
                    <div className="col-span-2 flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded flex-shrink-0" />
                      <Skeleton className="h-4 w-20" />
                    </div>

                    {/* Data de Criação */}
                    <div className="col-span-1 flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded flex-shrink-0" />
                      <Skeleton className="h-4 w-12" />
                    </div>

                    {/* Ações */}
                    <div className="col-span-1 flex items-center justify-center">
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : sortedTickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Nenhum atendimento encontrado</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm 
                    ? "Tente ajustar a busca para encontrar atendimentos."
                    : "Não há atendimentos no sistema."
                  }
                </p>
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
                    onClick={() => handleSort('customer')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Cliente</span>
                      {getSortIcon('customer')}
                    </div>
                  </Button>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      {getSortIcon('status')}
                    </div>
                  </Button>
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('channel')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Canal</span>
                      {getSortIcon('channel')}
                    </div>
                  </Button>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Prioridade</span>
                      {getSortIcon('priority')}
                    </div>
                  </Button>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('lastMessage')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Última Atividade</span>
                      {getSortIcon('lastMessage')}
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
                {sortedTickets.map((ticket) => {
                  const status = getStatusLabel(ticket.status);
                  const priority = getPriorityLabel(ticket.priorityLevel);

                  return (
                    <div
                      key={ticket.id}
                      className="group grid grid-cols-12 gap-4 px-4 py-4 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-b-0"
                    >
                      {/* Cliente */}
                      <div className="col-span-3 flex items-center gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage
                            src={ticket.customer.profilePicture || `https://avatar.vercel.sh/${ticket.customer.name || 'User'}.png`}
                            alt={ticket.customer.name || 'Cliente'}
                          />
                          <AvatarFallback className="text-xs">
                            {ticket.customer.name
                              ? ticket.customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{ticket.customer.name || 'Nome não informado'}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {ticket.customer.phone ? formatPhoneNumber(ticket.customer.phone) : `ID: ${ticket.id}`}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      {/* Canal */}
                      <div className="col-span-1 flex items-center">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{getChannelIcon(ticket.channel)}</span>
                          <span className="text-sm text-muted-foreground truncate capitalize">{ticket.channel}</span>
                        </div>
                      </div>

                      {/* Prioridade */}
                      <div className="col-span-2 flex items-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priority.color}`}>
                          <span className="mr-1">{priority.icon}</span>
                          {priority.label}
                        </span>
                      </div>

                      {/* Última Atividade */}
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{getLastMessageTime(ticket)}</span>
                        </div>
                      </div>

                      {/* Data de Criação */}
                      <div className="col-span-1 flex items-center">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{formatDate(ticket.createdAt)}</span>
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
                               <DropdownMenuItem onClick={() => router.push(`/dashboard/tickets?selectedTicket=${ticket.id}`)}>
                                 <Eye className="mr-2 h-4 w-4" />
                                 Visualizar
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => router.push(`/dashboard/tickets?selectedTicket=${ticket.id}`)}>
                                 <MessageCircle className="mr-2 h-4 w-4" />
                                 Abrir Chat
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Mostrando {tickets.length} de {totalItems} atendimentos
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