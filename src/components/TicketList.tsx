"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Ticket,
  TicketStatus,
  TicketPriorityLevel,
  TicketMessage,
} from "@/types/ticket";
import { Button } from "@/components/ui/button";
import { Filter, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/fetchApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chatService } from "@/services/chat";
import { TicketCard, TicketCardSkeleton } from "./TicketCard";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import "../app/globals.css";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TicketListProps {
  onTicketSelect: (ticket: Ticket) => void;
  selectedTicket: Ticket | null;
  setSelectedTab: (tab: TicketStatus) => void;
  selectedTab: TicketStatus;
  refreshTrigger?: number;
}

const ITEMS_PER_PAGE = 10;

export function TicketList({
  onTicketSelect,
  selectedTicket,
  setSelectedTab,
  selectedTab,
  refreshTrigger,
}: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedTicketId, setHighlightedTicketId] = useState<number | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [teamFilter, setTeamFilter] = useState<number | null>(null);
  const [userFilter, setUserFilter] = useState<number | null>(null);

  const priorities = [
    { value: "CRITICAL", label: "🔴 Crítica" },
    { value: "HIGH", label: "🟠 Alta" },
    { value: "MEDIUM", label: "🟡 Média" },
    { value: "LOW", label: "🟢 Baixa" },
  ];
  const teams = Array.from(
    new Map(
      tickets
        .filter((t) => t.areaId && t.areaId !== null)
        .map((t) => [t.areaId, t])
    ).values()
  ).map((t) => ({
    id: t.areaId,
    name: t.areaId ? `${t.area.name}` : `Equipe desconhecida`
  }));
  const users = Array.from(
    new Map(
      tickets
        .filter((t) => t.userId && t.userId !== null)
        .map((t) => [t.userId, t])
    ).values()
  ).map((t) => ({
    id: t.userId,
    name: t.userId ? `${t.user.name}` : `Usuário desconhecido`
  }));

  const clearFilters = () => {
    setPriorityFilter(null);
    setTeamFilter(null);
    setUserFilter(null);
  };

  const filterTickets = (
    tickets: Ticket[],
    status: TicketStatus,
    search: string
  ) => {
    return tickets.filter((ticket) => {
      if (ticket.status !== status) return false;
      if (priorityFilter && ticket.priorityLevel !== priorityFilter) return false;
      if (teamFilter && ticket.areaId !== teamFilter) return false;
      if (userFilter && ticket.userId !== userFilter) return false;
      if (!search) return true;
      const lowerSearch = search.toLowerCase();
      return (
        ticket.customer?.name?.toLowerCase().includes(lowerSearch) ||
        ticket.ticketMessages.some((msg) =>
          msg.message?.toLowerCase().includes(lowerSearch)
        )
      );
    });
  };

  const groupTicketsByPriority = (tickets: Ticket[]) => {
    const groups: Record<TicketPriorityLevel, Ticket[]> = {
      [TicketPriorityLevel.CRITICAL]: [],
      [TicketPriorityLevel.HIGH]: [],
      [TicketPriorityLevel.MEDIUM]: [],
      [TicketPriorityLevel.LOW]: [],
    };

    tickets.forEach((ticket) => {
      // If the ticket does not have a priorityLevel defined, place it in the LOW group
      const priority = ticket.priorityLevel || TicketPriorityLevel.MEDIUM;
      groups[priority]?.push(ticket);
    });

    return groups;
  };

  const getPriorityLabel = (priority: TicketPriorityLevel): string => {
    switch (priority) {
      case TicketPriorityLevel.CRITICAL:
        return "🔴 Crítica";
      case TicketPriorityLevel.HIGH:
        return "🟠 Alta";
      case TicketPriorityLevel.MEDIUM:
        return "🟡 Média";
      case TicketPriorityLevel.LOW:
        return "🟢 Baixa";
      default:
        return "Média";
    }
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms
  const observer = useRef<IntersectionObserver | undefined>(undefined);

  const lastTicketElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const getPriorityOrder = (priority: TicketPriorityLevel): number => {
    switch (priority) {
      case TicketPriorityLevel.CRITICAL:
        return 1;
      case TicketPriorityLevel.HIGH:
        return 2;
      case TicketPriorityLevel.MEDIUM:
        return 3;
      case TicketPriorityLevel.LOW:
        return 4;
      default:
        return 3; // Default to MEDIUM
    }
  };

  const sortTicketsByPriority = (tickets: Ticket[]): Ticket[] => {
    return tickets.sort((a: Ticket, b: Ticket) => {
      const priorityDiff =
        getPriorityOrder(a.priorityLevel) - getPriorityOrder(b.priorityLevel);
      if (priorityDiff !== 0) return priorityDiff;

      const dateA = new Date(a.ticketMessages.at(-1)?.createdAt || 0).getTime();
      const dateB = new Date(b.ticketMessages.at(-1)?.createdAt || 0).getTime();
      return dateB - dateA;
    });
  };

  const sortTicketsByLastMessage = (tickets: Ticket[]): Ticket[] => {
    return tickets.sort((a: Ticket, b: Ticket) => {
      const lastMessageDateA =
        a.ticketMessages.length > 0
          ? new Date(
              a.ticketMessages[a.ticketMessages.length - 1].createdAt
            ).getTime()
          : new Date(a.createdAt).getTime();

      const lastMessageDateB =
        b.ticketMessages.length > 0
          ? new Date(
              b.ticketMessages[b.ticketMessages.length - 1].createdAt
            ).getTime()
          : new Date(b.createdAt).getTime();

      return lastMessageDateB - lastMessageDateA;
    });
  };

  const loadTickets = useCallback(
    async (
      currentPage: number,
      currentSearchTerm: string,
      append: boolean = false
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
        });

        if (currentSearchTerm) {
          queryParams.append("search", currentSearchTerm);
        }

        const result = await fetchApi(`/api/tickets?${queryParams.toString()}`);
        const newTickets = await result.json();

        if (append) {
          setTickets((prevTickets) => {
            const combinedTickets = [...prevTickets, ...newTickets];
            const uniqueTickets = Array.from(
              new Map(combinedTickets.map((t) => [t.id, t])).values()
            );
            return sortTicketsByPriority(uniqueTickets);
          });
        } else {
          setTickets(sortTicketsByPriority(newTickets));
        }

        setHasMore(newTickets.length === ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Erro ao carregar tickets:", error);
        setError("Não foi possível carregar os tickets.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    setTickets([]); // Clears tickets to ensure new search starts from scratch
    setHasMore(true); // Reset hasMore
    loadTickets(1, "", false); // Loads the first page, sem searchTerm
  }, [selectedTab, loadTickets]);

  useEffect(() => {
    if (page > 1) {
      loadTickets(page, searchTerm, true);
    }
  }, [page, loadTickets, searchTerm]);

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      setPage(1); // Resets pagination on refresh
      setTickets([]); // Clear tickets
      setHasMore(true); // Reseta hasMore
      loadTickets(1, searchTerm, false); // Recharge from the beginning
    }
  }, [refreshTrigger, loadTickets, searchTerm]);

  useEffect(() => {
    const unsubscribe = chatService.onNewMessage((message: TicketMessage) => {
      setTickets((prevTickets) => {
        const updatedTickets = [...prevTickets];
        const index = updatedTickets.findIndex(
          (t) => t.id === message.ticketId
        );

        if (index === -1) return prevTickets;

        const ticketToUpdate = { ...updatedTickets[index] };

        ticketToUpdate.ticketMessages = [
          ...ticketToUpdate.ticketMessages,
          message,
        ];

        updatedTickets.splice(index, 1);
        const reordered = [ticketToUpdate, ...updatedTickets]; // put on top

        setHighlightedTicketId(message.ticketId);
        setTimeout(() => setHighlightedTicketId(null), 3000); // 3s highlight

        return reordered;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [selectedTicket?.id, onTicketSelect]);

  useEffect(() => {
    const unsubscribe = chatService.onNewTicket((newTicket: Ticket) => {
      setTickets((prevTickets) => {
        const ticketExists = prevTickets.some(
          (ticket) => ticket.id === newTicket.id
        );
        if (ticketExists) {
          return prevTickets;
        }

        const updatedTickets = [newTicket, ...prevTickets];
        const sortedTickets = sortTicketsByPriority(updatedTickets);
        return sortedTickets;
      });

      setHighlightedTicketId(newTicket.id);
      setTimeout(() => {
        setHighlightedTicketId(null);
      }, 3000); // 3s highlight
    });

    console.log("TicketList: Listener configurado, função de cleanup criada");

    return () => {
      console.log("TicketList: Removendo listener de novos tickets");
      unsubscribe();
    };
  }, []);

  const ticketsToDisplay = filterTickets(tickets, selectedTab, debouncedSearchTerm);

  return (
    <div className="flex flex-col h-full bg-white-soft">
      {/* Nível 1: Header with main elements */}
      <div className="p-4 border-b border-white-warm bg-white-pure shadow-white-soft">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Atendimentos
          </h1>
        </div>

        <div className="flex justify-between items-center gap-2">
          <Input
            placeholder="Buscar mensagem ou contato"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-white-soft border-white-warm focus:border-primary w-full"
          />
          <DropdownMenu open={filterOpen} onOpenChange={setFilterOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isLoading}
                      className="hover-brand-purple elevated-1"
                      aria-label="Abrir filtros"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="center">
                  Filtrar atendimentos
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-lg bg-white-soft border-white-warm">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-sm text-muted-foreground">Filtros</span>
                <Button variant="ghost" size="sm" className="text-xs px-2 py-1" onClick={clearFilters}>Limpar</Button>
              </div>
              <Separator className="my-2" />
              <div className="mb-2">
                <div className="font-medium text-xs text-muted-foreground mb-1">Prioridade</div>
                <div className="flex flex-wrap gap-2">
                  {priorities.map((p) => (
                    <Button
                      key={p.value}
                      variant={priorityFilter === p.value ? "default" : "outline"}
                      size="sm"
                      className="rounded-full text-xs px-3 py-1"
                      onClick={() => setPriorityFilter(priorityFilter === p.value ? null : p.value)}
                    >
                      {p.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator className="my-2" />
              <div className="mb-2">
                <div className="font-medium text-xs text-muted-foreground mb-1">Equipe</div>
                <div className="flex flex-col gap-1 max-h-28 overflow-y-auto">
                  {teams.length === 0 && <span className="text-xs text-muted-foreground">Nenhuma equipe</span>}
                  {teams.map((team) => (
                    <Button
                      key={team.id}
                      variant={teamFilter === team.id ? "default" : "outline"}
                      size="sm"
                      className="rounded-lg text-xs justify-start"
                      onClick={() => setTeamFilter(teamFilter === team.id ? null : Number(team.id))}
                    >
                      {team.name}
                    </Button>
                  ))}
                </div>
              </div>
              <Separator className="my-2" />
              <div>
                <div className="font-medium text-xs text-muted-foreground mb-1">Usuário</div>
                <div className="flex flex-col gap-1 max-h-28 overflow-y-auto">
                  {users.length === 0 && <span className="text-xs text-muted-foreground">Nenhum usuário</span>}
                  {users.map((user) => (
                    <Button
                      key={user.id}
                      variant={userFilter === user.id ? "default" : "outline"}
                      size="sm"
                      className="rounded-lg text-xs justify-start"
                      onClick={() => setUserFilter(userFilter === user.id ? null : Number(user.id))}
                    >
                      {user.name}
                    </Button>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-white-soft">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg elevated-1">
            {error}
            <Button
              variant="link"
              className="ml-2 text-red-700 hover:text-red-800"
              onClick={() => setError(null)}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}

      {/* Nível 1: Tabs */}
      <div className="bg-white-soft flex-1 flex flex-col">
        <Tabs
          value={selectedTab}
          defaultValue="ai"
          className="w-full p-2 flex-1 flex flex-col"
        >
          <TabsList className="w-full bg-white-pure border border-white-warm shadow-white-soft">
            <TabsTrigger
              value={TicketStatus.IN_PROGRESS}
              onClick={() => setSelectedTab(TicketStatus.IN_PROGRESS)}
              className="data-[state=active]:bg-white-soft data-[state=active]:text-primary data-[state=active]:shadow-white-soft hover-brand-purple"
            >
              Abertos
            </TabsTrigger>
            <TabsTrigger
              value={TicketStatus.CLOSED}
              onClick={() => setSelectedTab(TicketStatus.CLOSED)}
              className="data-[state=active]:bg-white-soft data-[state=active]:text-primary data-[state=active]:shadow-white-soft hover-brand-purple"
            >
              Fechados
            </TabsTrigger>
            <TabsTrigger
              value={TicketStatus.AI}
              onClick={() => setSelectedTab(TicketStatus.AI)}
              className="data-[state=active]:bg-white-soft data-[state=active]:text-primary data-[state=active]:shadow-white-soft hover-brand-purple"
            >
              IA <Sparkles className="h-4 w-4 ml-1" />
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value={TicketStatus.AI}
            className="mt-4 flex-1 overflow-y-auto"
          >
            <div className="flex flex-col gap-3 w-full px-2">
              {isLoading && ticketsToDisplay.length === 0 ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TicketCardSkeleton key={`ai-skeleton-${index}`} />
                ))
              ) : ticketsToDisplay.length > 0 ? (
                (() => {
                  const aiTickets = ticketsToDisplay.filter(
                    (ticket) => ticket.status === TicketStatus.AI
                  );
                  const sortedTickets = sortTicketsByLastMessage(aiTickets);

                  return (
                    <div className="space-y-3">
                      {sortedTickets.map((ticket, index) => {
                        // Aplica a ref ao último elemento para o Intersection Observer
                        if (sortedTickets.length === index + 1) {
                          return (
                            <div ref={lastTicketElementRef} key={ticket.id}>
                              <TicketCard
                                ticket={ticket}
                                selected={selectedTicket?.id === ticket.id}
                                highlighted={highlightedTicketId === ticket.id}
                                onSelect={onTicketSelect}
                              />
                            </div>
                          );
                        }
                        return (
                          <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            selected={selectedTicket?.id === ticket.id}
                            highlighted={highlightedTicketId === ticket.id}
                            onSelect={onTicketSelect}
                          />
                        );
                      })}
                      {isLoading &&
                        hasMore && // Mostrar skeletons enquanto carrega mais tickets
                        Array.from({ length: 3 }).map((_, index) => (
                          <TicketCardSkeleton key={`loading-ai-${index}`} />
                        ))}
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum ticket IA</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value={TicketStatus.IN_PROGRESS}
            className="mt-4 flex-1 overflow-y-auto"
          >
            <div className="flex flex-col gap-3 w-full px-2">
              {isLoading && ticketsToDisplay.length === 0 ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TicketCardSkeleton key={`progress-skeleton-${index}`} />
                ))
              ) : ticketsToDisplay.length > 0 ? (
                (() => {
                  const progressTickets = ticketsToDisplay.filter(
                    (ticket) => ticket.status === TicketStatus.IN_PROGRESS
                  );
                  const groupedTickets =
                    groupTicketsByPriority(progressTickets);

                  return (
                    <div className="space-y-6">
                      {Object.entries(groupedTickets).map(
                        ([priority, tickets]) => {
                          if (tickets.length === 0) return null;

                          return (
                            <div key={priority} className="space-y-3">
                              <div className="flex items-center gap-2 px-2">
                                <h3 className="text-sm font-semibold text-muted-foreground">
                                  {getPriorityLabel(
                                    priority as TicketPriorityLevel
                                  )}
                                </h3>
                                <div className="flex-1 h-px bg-white-warm"></div>
                                <span className="text-xs text-muted-foreground">
                                  {tickets.length} ticket
                                  {tickets.length > 1 ? "s" : ""}
                                </span>
                              </div>
                              {tickets.map((ticket, index) => {
                                // Aplica a ref ao último elemento do último grupo
                                const isLastGroup =
                                  Object.keys(groupedTickets).indexOf(
                                    priority
                                  ) ===
                                  Object.keys(groupedTickets).length - 1;
                                if (
                                  isLastGroup &&
                                  tickets.length === index + 1
                                ) {
                                  return (
                                    <div
                                      ref={lastTicketElementRef}
                                      key={ticket.id}
                                    >
                                      <TicketCard
                                        ticket={ticket}
                                        selected={
                                          selectedTicket?.id === ticket.id
                                        }
                                        highlighted={
                                          highlightedTicketId === ticket.id
                                        }
                                        onSelect={onTicketSelect}
                                      />
                                    </div>
                                  );
                                }
                                return (
                                  <TicketCard
                                    key={ticket.id}
                                    ticket={ticket}
                                    selected={selectedTicket?.id === ticket.id}
                                    highlighted={
                                      highlightedTicketId === ticket.id
                                    }
                                    onSelect={onTicketSelect}
                                  />
                                );
                              })}
                            </div>
                          );
                        }
                      )}
                      {isLoading &&
                        hasMore &&
                        Array.from({ length: 3 }).map((_, index) => (
                          <TicketCardSkeleton
                            key={`loading-progress-${index}`}
                          />
                        ))}
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhum ticket em andamento
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value={TicketStatus.CLOSED}
            className="mt-4 flex-1 overflow-y-auto"
          >
            <div className="flex flex-col gap-3 w-full px-2">
              {isLoading && ticketsToDisplay.length === 0 ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TicketCardSkeleton key={`closed-skeleton-${index}`} />
                ))
              ) : ticketsToDisplay.length > 0 ? (
                (() => {
                  const closedTickets = ticketsToDisplay.filter(
                    (ticket) => ticket.status === TicketStatus.CLOSED
                  );
                  const sortedTickets = sortTicketsByLastMessage(closedTickets);

                  return (
                    <div className="space-y-3">
                      {sortedTickets.map((ticket, index) => {
                        // Aplica a ref ao último elemento para o Intersection Observer
                        if (sortedTickets.length === index + 1) {
                          return (
                            <div ref={lastTicketElementRef} key={ticket.id}>
                              <TicketCard
                                ticket={ticket}
                                selected={selectedTicket?.id === ticket.id}
                                highlighted={highlightedTicketId === ticket.id}
                                onSelect={onTicketSelect}
                              />
                            </div>
                          );
                        }
                        return (
                          <TicketCard
                            key={ticket.id}
                            ticket={ticket}
                            selected={selectedTicket?.id === ticket.id}
                            highlighted={highlightedTicketId === ticket.id}
                            onSelect={onTicketSelect}
                          />
                        );
                      })}
                      {isLoading &&
                        hasMore &&
                        Array.from({ length: 3 }).map((_, index) => (
                          <TicketCardSkeleton key={`loading-closed-${index}`} />
                        ))}
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum ticket fechado</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="h-[73px] border-t border-white-warm bg-white-pure shadow-white-soft min-h-[57px] flex items-center justify-center">
        <Link href="/dashboard/tickets/list">
          <Button variant="link" className="text-primary hover:text-primary/80">
            Ver todos os atendimentos
          </Button>
        </Link>
      </div>
    </div>
  );
}
