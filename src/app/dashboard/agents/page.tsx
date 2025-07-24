"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Plus,
  Phone,
  Pencil,
  Trash,
  Eye,
  MapPin,
  Calendar,
  Search,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPhoneNumber } from "@/lib/utils";
import { Agent } from "@/types/agent";
import { DeleteAgentDialog } from "@/components/DeleteAgentDialog";
import { AgentDetailsPanel } from "@/components/AgentDetailsPanel";

type SortField =
  | "name"
  | "description"
  | "whatsappNumber"
  | "createdAt"
  | "systemMessage";
type SortDirection = "asc" | "desc";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchAgents = useCallback(async () => {
    try {
      setIsLoading(true);

      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      if (debouncedSearchTerm) {
        queryParams.append("search", debouncedSearchTerm);
      }

      const response = await fetchApi(`/api/agents?${queryParams.toString()}`);
      const data: { agents: Agent[]; total: number } = await response.json();

      if (!response.ok) {
        throw new Error("Erro ao carregar agentes de IA");
      }

      if (Array.isArray(data)) {
        setAgents(data.agents);
        setTotalItems(data.total);
        setTotalPages(Math.ceil(data.length / limit));
      } else {
        setAgents(data.agents || []);
        setTotalItems(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / limit));
      }
    } catch (error) {
      console.error("Erro ao carregar agentes de IA:", error);
      toast.error("Erro ao carregar agentes de IA");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearchTerm]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const sortedAgents = [...agents].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "name":
        aValue = a.name ? a.name.toLowerCase() : "";
        bValue = b.name ? b.name.toLowerCase() : "";
        break;
      case "description":
        aValue = a.description ? a.description.toLowerCase() : "";
        bValue = b.description ? b.description.toLowerCase() : "";
        break;
      case "systemMessage":
        aValue = a.systemMessage ? a.systemMessage.toLowerCase() : "";
        bValue = b.systemMessage ? b.systemMessage.toLowerCase() : "";
        break;
      case "whatsappNumber":
        aValue = a.whatsappNumber ? a.whatsappNumber.toLowerCase() : "";
        bValue = b.whatsappNumber ? b.whatsappNumber.toLowerCase() : "";
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleDeleteSuccess = (deletedAgentsId: number) => {
    setAgents(agents.filter((agent) => agent.id !== deletedAgentsId));
    setTotalItems((prev) => prev - 1);
  };

  const openAgentPanel = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsPanelOpen(true);
  };

  const closeAgentPanel = () => {
    setIsPanelOpen(false);
    setSelectedAgent(null);
  };

  const openDeleteDialog = (agent: Agent) => {
    setAgentToDelete(agent);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setAgentToDelete(null);
  };

  const handleDeleteAgent = (agent: Agent) => {
    openDeleteDialog(agent);
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
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 opacity-40" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 opacity-100" />
    ) : (
      <ChevronDown className="h-4 w-4 opacity-100" />
    );
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
            Agentes de IA
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus agentes de IA e informações
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/agents/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agente de IA
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar contato por nome"
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
                    <span>Nome</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-1">
                    <span>Descrição</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <span>Instrução</span>
                    <ChevronUp className="h-4 w-4 opacity-40" />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1">
                    <span>Canal de Comunicação</span>
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
                    {/* Agente */}
                    <div className="col-span-3 flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>

                    {/* Descrição */}
                    <div className="col-span-3 flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded flex-shrink-0" />
                      <Skeleton className="h-4 w-40" />
                    </div>

                    {/* Instrução */}
                    <div className="col-span-2 flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded flex-shrink-0" />
                      <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Canal de Comunicação */}
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
          ) : sortedAgents.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">
                  Nenhum agente de IA encontrado
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm
                    ? "Tente ajustar a busca ou crie um novo agente de IA."
                    : "Comece criando seu primeiro agente de IA para automatizar o atendimento."}
                </p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/agents/create">
                    <Plus className="mr-2 h-4 w-4" />
                    {searchTerm ? "Novo Agente de IA" : "Criar Primeiro Agente de IA"}
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
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Agente</span>
                      {getSortIcon("name")}
                    </div>
                  </Button>
                </div>
                <div className="col-span-3">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("description")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Descrição</span>
                      {getSortIcon("description")}
                    </div>
                  </Button>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("systemMessage")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Instrução</span>
                      {getSortIcon("systemMessage")}
                    </div>
                  </Button>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("whatsappNumber")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Canal de Comunicação</span>
                      {getSortIcon("whatsappNumber")}
                    </div>
                  </Button>
                </div>
                <div className="col-span-1">
                  <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Criado</span>
                      {getSortIcon("createdAt")}
                    </div>
                  </Button>
                </div>
                <div className="col-span-1 text-center">
                  <span>Ações</span>
                </div>
              </div>

              {/* Table Body */}
              <div className="flex flex-col">
                {sortedAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="group grid grid-cols-12 gap-4 px-4 py-4 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-b-0"
                  >
                    {/* Agente */}
                    <div className="col-span-3 flex items-center gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={
                            agent.imageUrl ||
                            `https://avatar.vercel.sh/${
                              agent.name || "User"
                            }.png`
                          }
                          alt={agent.name || "Usuário"}
                        />
                        <AvatarFallback className="text-xs">
                          {agent.name
                            ? agent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                            : "N/A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">
                          {agent.name || "Nome não informado"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          ID: {agent.id}
                        </p>
                      </div>
                    </div>

                    {/* Descrição */}
                    <div className="col-span-3 flex items-center">
                      {agent.description ? (
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-sm text-muted-foreground truncate">
                            {agent.description}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground/50">
                          Não informado
                        </span>
                      )}
                    </div>

                    {/* Canal de Comunicação */}
                    <div className="col-span-2 flex items-center">
                      {agent.whatsappNumber ? (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {formatPhoneNumber(agent.whatsappNumber)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground/50">
                          Não informado
                        </span>
                      )}
                    </div>

                    {/* Instrução */}
                    <div className="col-span-2 flex items-center">
                      {agent.systemMessage ? (
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground truncate">
                            {agent.systemMessage}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground/50">
                          Não informado
                        </span>
                      )}
                    </div>

                    {/* Data de Criação */}
                    <div className="col-span-1 flex items-center">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(agent.createdAt)}
                        </span>
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
                            <DropdownMenuItem
                              onClick={() => openAgentPanel(agent)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/dashboard/agents/${agent.id}`)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteAgent(agent)}
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
                Mostrando {agents.length} de {totalItems} agentes de IA
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

      {/* Agents Details Panel */}
      <AgentDetailsPanel
        agent={selectedAgent}
        isOpen={isPanelOpen}
        onClose={closeAgentPanel}
      />

      {/* Delete Agents Dialog */}
      <DeleteAgentDialog
        agent={agentToDelete}
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
