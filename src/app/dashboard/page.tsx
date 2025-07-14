"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as TooltipChart,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  MessageSquare,
  Clock,
  TrendingUp,
  Bot,
  Star,
  Calendar,
  Download,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import "../globals.css";
import { fetchApi } from "@/lib/fetchApi";
import { useEffect, useState } from "react";
import { Ticket } from "@/types/ticket";
import { TicketCard } from "@/components/TicketCard";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/contexts/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const platformColors = [
  "#E97939", // Laranja principal
  "#8A39DB", // Roxo principal
  "#3B82F6", // Azul
  "#10B981", // Verde
  "#EF4444", // Vermelho
  "#F59E0B", // Amarelo
  "#8B5CF6", // Púrpura
  "#06B6D4", // Ciano
  "#84CC16", // Lima
  "#F97316", // Laranja
  "#EC4899", // Rosa
  "#6366F1", // Índigo
];

interface AnalyticsData {
  totalTickets: {
    total: number;
    previousPeriod: number;
    percentage: number | null;
  };
  resolutionWithAI: {
    totalPercentage: number;
    previousPeriodPercentage: number;
  };
  averageHumanResolutionTime: {
    total: number;
    previousPeriod: number | null;
    difference: number | null;
  };
  totalScore: {
    averageScore: number;
    previousPeriod: number;
    ratingDistribution: {
      [key: string]: number;
    };
    satisfactionPercentage: number | null;
  };
  quantityOfTicketByChannel: {
    channel: string;
    quantity: number;
  }[];
  quantityOfTicketByTeams: {
    areaName: string;
    quantity: number;
  }[];
  scoreAverageByMonth: {
    month: string;
    score: number;
    count: number;
  }[];
  rankingUsersByScore: {
    userId: number;
    name: string;
    email: string;
    averageScore: number;
    totalTickets: number;
  }[];
  tickets: { tickets: Ticket[]; previousTickets: Ticket[] };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [appliedDateRange, setAppliedDateRange] = useState<
    DateRange | undefined
  >({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [showAllAgents, setShowAllAgents] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("all");
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>("all");

  const fetchData = async (dateFilter?: DateRange, teamId?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      const filterToUse = dateFilter || appliedDateRange;
      const teamIdToUse = teamId || selectedTeamId;

      // Para usuários MANAGER, só carregar dados se tiver uma equipe selecionada
      if (user?.role === "MANAGER" && (!teamIdToUse || teamIdToUse === "all")) {
        setData(null);
        setLoading(false);
        return;
      }

      if (filterToUse?.from) {
        // Sempre usar o início do dia (00:00:00) para a data inicial
        const startDate = startOfDay(filterToUse.from);
        params.append("startDate", startDate.toISOString());
      }
      if (filterToUse?.to) {
        // Sempre usar o final do dia (23:59:59) para a data final
        const endDate = endOfDay(filterToUse.to);
        params.append("endDate", endDate.toISOString());
      }
      if (teamIdToUse && teamIdToUse !== "all") {
        params.append("teamId", teamIdToUse);
      }

      const response = await fetchApi(`/api/analytics?${params.toString()}`);
      const data = await response.json();
      setData(data as AnalyticsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetchApi("/api/teams");
      const teamsData = await response.json();

      // Filtrar equipes baseado na role do usuário
      let filteredTeams = teamsData;

      if (user?.role === "MANAGER") {
        // Para MANAGER, mostrar apenas equipes onde ele é owner
        filteredTeams = teamsData.filter(
          (team: { id: number; name: string; owner: { id: number } }) =>
            team.owner?.id === user.id
        );

        // Se não tem equipes, limpar dados e parar loading
        if (filteredTeams.length === 0) {
          setSelectedTeamId("");
          setData(null);
          setLoading(false);
        }
      } else {
        // Para outros usuários (ADMIN, USER), carregar dados normalmente
        fetchData();
      }

      setTeams(filteredTeams);
    } catch (error) {
      console.error("Erro ao carregar equipes:", error);
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    setAppliedDateRange(dateRange);
    fetchData(dateRange, selectedTeamId);
  };

  const handleTeamChange = (teamId: string) => {
    setSelectedTeamId(teamId);
    fetchData(appliedDateRange, teamId);
  };

  const handleExportPDF = async () => {
    try {
      setDownloadingPDF(true);
      const params = new URLSearchParams();
      const filterToUse = appliedDateRange;

      if (filterToUse?.from) {
        // Sempre usar o início do dia (00:00:00) para a data inicial
        const startDate = startOfDay(filterToUse.from);
        params.append("startDate", startDate.toISOString());
      }
      if (filterToUse?.to) {
        // Sempre usar o final do dia (23:59:59) para a data final
        const endDate = endOfDay(filterToUse.to);
        params.append("endDate", endDate.toISOString());
      }
      if (selectedTeamId && selectedTeamId !== "all") {
        params.append("teamId", selectedTeamId);
      }

      const response = await fetchApi(
        `/api/analytics/export-pdf?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao gerar relatório PDF");
      }

      // Converter resposta para blob
      const blob = await response.blob();

      // Criar URL do blob
      const url = window.URL.createObjectURL(blob);

      // Criar link para download
      const link = document.createElement("a");
      link.href = url;

      // Gerar nome do arquivo com data atual
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0];
      link.download = `relatorio-dashboard-${dateStr}.pdf`;

      // Adicionar ao DOM, clicar e remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpar URL do blob
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      // Aqui você pode adicionar um toast de erro se tiver configurado
    } finally {
      setDownloadingPDF(false);
    }
  };

  // Função para capitalizar a primeira letra
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Função para filtrar tickets por status
  const getFilteredTickets = () => {
    if (!data?.tickets?.tickets) return [];

    let filteredTickets = data.tickets.tickets;

    if (ticketStatusFilter !== "all") {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.status === ticketStatusFilter
      );
    }

    return filteredTickets
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  };

  // Componentes de Skeleton
  const KPISkeleton = () => (
    <Card className="elevated-2 hover:elevated-3 transition-all duration-300 w-1/4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col h-full justify-between">
        <Skeleton className="h-8 w-16 mb-4" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-2 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  const ChartSkeleton = ({ className }: { className?: string }) => (
    <Card className={`elevated-1 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div>
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[400px] w-full" />
      </CardContent>
    </Card>
  );

  const RankingSkeleton = () => (
    <Card className="elevated-1">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div>
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl border bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-12 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const TicketsSkeleton = () => (
    <Card className="elevated-1">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <Skeleton className="w-[140px] h-8" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-3 w-full mb-2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({
    icon,
    title,
    description,
  }: {
    icon: string;
    title: string;
    description: string;
  }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md">{description}</p>
    </div>
  );

  useEffect(() => {
    if (user) {
      setLoading(true);
      // Ajustar selectedTeamId inicial baseado na role
      if (user.role === "MANAGER") {
        setSelectedTeamId("");
      }
      fetchTeams();
    }
  }, [user]);

  // UseEffect para monitorar mudanças nas equipes para usuários MANAGER
  useEffect(() => {
    if (
      user?.role === "MANAGER" &&
      teams.length > 0 &&
      (!selectedTeamId || selectedTeamId === "")
    ) {
      const firstTeamId = teams[0].id.toString();
      setSelectedTeamId(firstTeamId);
      // Carregar dados para a equipe selecionada
      setTimeout(() => {
        fetchData(appliedDateRange, firstTeamId);
      }, 100);
    }
  }, [teams, user]);

  return (
    <div className="p-8 ml-16 bg-gradient-to-br from-background to-white-soft min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Visão Geral
          </h1>
          <p className="text-muted-foreground mt-2">
            Visão geral do desempenho do atendimento com IA
          </p>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className="w-[260px] h-[40px] elevated-1 justify-center text-center font-normal"
              >
                <Calendar className="w-4 h-4 mr-2" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                  )
                ) : (
                  <span>Selecione o período</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Select
            value={selectedTeamId}
            onValueChange={handleTeamChange}
            disabled={user?.role === "MANAGER" && teams.length === 0}
          >
            <SelectTrigger className="w-[180px] elevated-1">
              <SelectValue
                placeholder={
                  user?.role === "MANAGER"
                    ? teams.length === 0
                      ? "Nenhuma equipe"
                      : "Selecione uma equipe"
                    : "Todas as equipes"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {/* Mostrar "Todas as equipes" apenas se o usuário não for MANAGER */}
              {user?.role !== "MANAGER" && (
                <SelectItem value="all">Todas as equipes</SelectItem>
              )}
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleApplyFilter}
            className="bg-primary hover:bg-primary/90 h-[40px]"
            disabled={
              !dateRange?.from ||
              !dateRange?.to ||
              (user?.role === "MANAGER" && teams.length === 0)
            }
          >
            Aplicar
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleExportPDF}
                  disabled={
                    downloadingPDF || (user?.role === "MANAGER" && teams.length === 0)
                  }
                  className="bg-primary flex items-center justify-center text-center h-[40px]"
                >
                  {downloadingPDF ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                Exportar relatório em PDF
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Mensagem para usuários MANAGER sem equipes */}
      {user?.role === "MANAGER" && teams.length === 0 && !loading && (
        <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-lg">⚠️</span>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800">
                Acesso Restrito às Métricas
              </h3>
              <p className="text-yellow-700 mt-1">
                Para visualizar as métricas do dashboard, você precisa ser o
                responsável por pelo menos uma equipe. Entre em contato com o
                administrador do sistema para ser definido como responsável de
                uma equipe.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPIs Principais */}
      <div className="flex gap-4 mb-8">
        {loading && !(user?.role === "MANAGER" && teams.length === 0) ? (
          <>
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
          </>
        ) : user?.role === "MANAGER" && teams.length === 0 ? (
          // Não mostrar nada para usuários MANAGER sem equipes
          <></>
        ) : (
          <>
            <Card className="elevated-2 hover:elevated-3 transition-all duration-300 w-1/4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-900">
                    Satisfação Geral
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full justify-between">
                <div className="text-3xl font-bold text-primary">
                  {data?.totalScore?.averageScore || "0.0"}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <p
                      className={`text-xs ${
                        !data?.totalScore?.previousPeriod ||
                        data?.totalScore?.previousPeriod > 0
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium flex items-center gap-1`}
                    >
                      {data?.totalScore?.previousPeriod
                        ? `${data.totalScore?.previousPeriod}% em relação ao período anterior`
                        : "Primeiros atendimentos do período!"}
                    </p>
                  </div>
                  <div className="flex gap-1 h-4 mt-2 items-center">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const satisfactionPercentage =
                        data?.totalScore?.satisfactionPercentage || 0;
                      const starProgress = (satisfactionPercentage / 100) * 5; // Converte para escala de 5 estrelas
                      const starFill = Math.min(
                        Math.max(starProgress - (star - 1), 0),
                        1
                      ); // Calcula o preenchimento desta estrela

                      return (
                        <div key={star} className="relative">
                          {/* Estrela de fundo (cinza) */}
                          <Star className="h-4 w-4 text-gray-300" />
                          {/* Estrela amarela sobreposta com clip */}
                          <Star
                            className="h-4 w-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0"
                            style={{
                              clipPath: `polygon(0 0, ${starFill * 100}% 0, ${
                                starFill * 100
                              }% 100%, 0 100%)`,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="elevated-2 hover:elevated-3 transition-all duration-300 w-1/4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-900">
                    Total de Atendimentos
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full justify-between">
                <div className="text-3xl font-bold text-primary">
                  {data?.totalTickets?.total || "0"}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    {!data?.totalTickets?.percentage ||
                    data?.totalTickets?.percentage > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <p
                      className={`text-xs ${
                        !data?.totalTickets?.percentage ||
                        data?.totalTickets?.percentage > 0
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium flex items-center gap-1`}
                    >
                      {data?.totalTickets?.percentage
                        ? `${data.totalTickets?.percentage}% em relação ao período anterior`
                        : "Primeiros atendimentos do período!"}
                    </p>
                  </div>
                  <div className="h-4 mt-2 items-center flex justify-center">
                    <Progress
                      value={data?.totalTickets?.percentage || 100}
                      className=""
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="elevated-2 hover:elevated-3 transition-all duration-300 w-1/4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-900">
                    Resolução com IA
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full justify-between">
                <div className="text-3xl font-bold text-primary">
                  {data?.resolutionWithAI?.totalPercentage?.toFixed(1) || 0}%
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    {!data?.resolutionWithAI?.previousPeriodPercentage ||
                    data?.resolutionWithAI?.previousPeriodPercentage > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <p
                      className={`text-xs ${
                        !data?.resolutionWithAI?.previousPeriodPercentage ||
                        data?.resolutionWithAI?.previousPeriodPercentage > 0
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium flex items-center gap-1`}
                    >
                      {data?.resolutionWithAI?.previousPeriodPercentage
                        ? `${data.resolutionWithAI?.previousPeriodPercentage}% em relação ao período anterior`
                        : "Primeiros atendimentos do período!"}
                    </p>
                  </div>
                  <div className="h-4 mt-2 items-center flex justify-center">
                    <Progress
                      value={data?.resolutionWithAI?.totalPercentage || 0}
                      className=""
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="elevated-2 hover:elevated-3 transition-all duration-300 w-1/4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <CardTitle className="text-sm font-medium text-gray-900">
                    Tempo Médio
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full justify-between">
                <div className="text-3xl font-bold text-primary">
                  {data?.averageHumanResolutionTime?.total
                    ? (() => {
                        const timeInMinutes =
                          data.averageHumanResolutionTime?.total / 60000;
                        if (timeInMinutes > 60) {
                          const timeInHours = timeInMinutes / 60;
                          return `${timeInHours.toFixed(1)}h`;
                        }
                        return `${timeInMinutes.toFixed(1)}min`;
                      })()
                    : "0.0min"}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mt-2">
                    {!data?.averageHumanResolutionTime?.difference ||
                    data?.averageHumanResolutionTime?.difference > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <p
                      className={`text-xs ${
                        !data?.averageHumanResolutionTime?.difference ||
                        data?.averageHumanResolutionTime?.difference > 0
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium`}
                    >
                      {data?.averageHumanResolutionTime?.difference
                        ? `${data.averageHumanResolutionTime?.difference}min em relação ao período anterior`
                        : "Primeiros atendimentos do período!"}
                    </p>
                  </div>
                  <div className="h-4 mt-2 items-center flex justify-center">
                    <Progress
                      value={
                        data?.averageHumanResolutionTime?.difference || 100
                      }
                      className=""
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Gráficos Principais */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {loading && !(user?.role === "MANAGER" && teams.length === 0) ? (
          <>
            <ChartSkeleton className="lg:col-span-2" />
            <ChartSkeleton />
          </>
        ) : user?.role === "MANAGER" && teams.length === 0 ? (
          <></>
        ) : (
          <>
            {/* Distribuição por Canal */}
            <Card className="elevated-1 lg:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Quantidade de Atendimentos por Canal
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Volume de atendimentos distribuído por cada canal
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid place-items-center p-6">
                {data?.quantityOfTicketByChannel &&
                data.quantityOfTicketByChannel.length > 0 ? (
                  <>
                    <div className="h-[565px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={
                            data?.quantityOfTicketByChannel?.map((item) => ({
                              ...item,
                              channel: capitalizeFirstLetter(item.channel),
                            })) || []
                          }
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="oklch(0.93 0.008 250)"
                          />
                          <XAxis
                            dataKey="channel"
                            tick={{ fill: "oklch(0.556 0 0)", fontSize: 11 }}
                            axisLine={{ stroke: "oklch(0.88 0.012 260)" }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis
                            tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                            axisLine={{ stroke: "oklch(0.88 0.012 260)" }}
                            label={{
                              value: "Quantidade",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <TooltipChart
                            contentStyle={{
                              backgroundColor: "oklch(1 0 0)",
                              border: "1px solid oklch(0.88 0.012 260)",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            labelFormatter={(value) => `Canal: ${value}`}
                            formatter={(value) => [value, "Quantidade"]}
                          />
                          <Bar
                            dataKey="quantity"
                            fill="url(#barGradient)"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={80}
                          />
                          <defs>
                            <linearGradient
                              id="barGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor="#E97939" />
                              <stop offset="100%" stopColor="#8A39DB" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      O gráfico exibe o volume de atendimentos por canal, onde
                      cada barra corresponde a um canal específico.
                    </p>
                  </>
                ) : (
                  <EmptyState
                    icon="📊"
                    title="Nenhum dado de canal disponível"
                    description="Não há dados de atendimentos por canal para o período selecionado. Verifique o filtro de data ou aguarde novos atendimentos."
                  />
                )}
              </CardContent>
            </Card>

            {/* Distribuição por Categoria */}
            <Card className="elevated-1">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">👥</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Atendimentos por Equipe
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Distribuição percentual entre as equipes
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                {data?.quantityOfTicketByTeams &&
                data.quantityOfTicketByTeams.length > 0 ? (
                  <>
                    <div className="w-full h-1/2">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={
                              data?.quantityOfTicketByTeams?.map(
                                (item, index) => ({
                                  areaName: item.areaName,
                                  quantity: item.quantity,
                                  percentage:
                                    (item.quantity /
                                      data.quantityOfTicketByTeams.reduce(
                                        (sum, i) => sum + i.quantity,
                                        0
                                      )) *
                                    100,
                                  color:
                                    platformColors[
                                      index % platformColors.length
                                    ],
                                })
                              ) || []
                            }
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="quantity"
                            nameKey="areaName"
                            label={({ percentage }) =>
                              `${percentage.toFixed(1)}%`
                            }
                            labelLine={false}
                          >
                            {data?.quantityOfTicketByTeams?.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    platformColors[
                                      index % platformColors.length
                                    ]
                                  }
                                />
                              )
                            )}
                          </Pie>
                          <TooltipChart
                            contentStyle={{
                              backgroundColor: "oklch(1 0 0)",
                              border: "1px solid oklch(0.88 0.012 260)",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                            formatter={(value) => {
                              const total =
                                data?.quantityOfTicketByTeams?.reduce(
                                  (sum, item) => sum + item.quantity,
                                  0
                                ) || 0;
                              const percentage =
                                total > 0 ? (Number(value) / total) * 100 : 0;
                              return [
                                `${value} (${percentage.toFixed(1)}%)`,
                                "Atendimentos",
                              ];
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-1/2">
                      <p className="text-sm text-muted-foreground mt-4">
                        O gráfico exibe a distribuição de atendimentos por
                        equipe, onde cada fatia corresponde a uma equipe
                        específica.
                      </p>
                      <div className="flex flex-col gap-2 w-full h-56 mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2">
                        {(() => {
                          const total =
                            data?.quantityOfTicketByTeams?.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            ) || 0;
                          return data?.quantityOfTicketByTeams?.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      backgroundColor: platformColors[index],
                                    }}
                                  ></div>
                                  <span className="text-sm">
                                    {item.areaName}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-semibold">
                                    {total > 0
                                      ? ((item.quantity / total) * 100).toFixed(
                                          1
                                        )
                                      : 0}
                                    %
                                  </span>
                                  <span className="text-xs text-muted-foreground block">
                                    ({item.quantity} tickets)
                                  </span>
                                </div>
                              </div>
                            )
                          );
                        })()}
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    icon="👥"
                    title="Nenhuma equipe encontrada"
                    description="Não há dados de atendimentos por equipe para o período selecionado. Verifique se existem equipes cadastradas."
                  />
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Performance e Tendências */}
      <div className="mb-8">
        {loading && !(user?.role === "MANAGER" && teams.length === 0) ? (
          <ChartSkeleton />
        ) : user?.role === "MANAGER" && teams.length === 0 ? (
          <></>
        ) : (
          /* Tendência de Satisfação */
          <Card className="elevated-1">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg">📈</span>
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Evolução da Satisfação nos Últimos 12 Meses
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Tendência temporal da satisfação dos clientes
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid place-items-center p-6">
              {data?.scoreAverageByMonth &&
              data.scoreAverageByMonth.length > 0 ? (
                <>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={data?.scoreAverageByMonth || []}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="oklch(0.93 0.008 250)"
                        />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                          axisLine={{ stroke: "oklch(0.88 0.012 260)" }}
                        />
                        <YAxis
                          domain={[4.0, 5.0]}
                          tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                          axisLine={{ stroke: "oklch(0.88 0.012 260)" }}
                        />
                        <TooltipChart
                          contentStyle={{
                            backgroundColor: "oklch(1 0 0)",
                            border: "1px solid oklch(0.88 0.012 260)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#3B82F6"
                          fill="url(#areaGradient)"
                          strokeWidth={3}
                        />
                        <defs>
                          <linearGradient
                            id="areaGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3B82F6"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3B82F6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    O gráfico exibe a evolução da satisfação nos últimos 12
                    meses, onde cada ponto representa um mês específico.
                  </p>
                </>
              ) : (
                <EmptyState
                  icon="📈"
                  title="Dados de satisfação indisponíveis"
                  description="Não há dados suficientes de satisfação para exibir a evolução temporal. Aguarde mais avaliações dos clientes."
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabelas e Listas */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {loading && !(user?.role === "MANAGER" && teams.length === 0) ? (
          <>
            <RankingSkeleton />
            <TicketsSkeleton />
          </>
        ) : user?.role === "MANAGER" && teams.length === 0 ? (
          <></>
        ) : (
          <>
            {/* Ranking dos Melhores Atendentes */}
            <Card className="elevated-1">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">🏆</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Ranking dos Melhores Atendentes
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Top atendentes humanos por satisfação
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.rankingUsersByScore &&
                  data.rankingUsersByScore.length > 0 ? (
                    <>
                      {data.rankingUsersByScore
                        .slice(0, showAllAgents ? 10 : 5)
                        .map((user, index) => {
                          const getMedalEmoji = (position: number) => {
                            switch (position) {
                              case 1:
                                return "🥇";
                              case 2:
                                return "🥈";
                              case 3:
                                return "🥉";
                              default:
                                return null;
                            }
                          };

                          const getPositionStyle = (position: number) => {
                            if (position <= 3) {
                              return "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200";
                            }
                            return "bg-gray-50 border-gray-200";
                          };

                          return (
                            <div
                              key={user.userId}
                              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${getPositionStyle(
                                index + 1
                              )}`}
                            >
                              <div className="flex items-center gap-4">
                                {/* Posição com medalha ou número */}
                                <div className="flex items-center justify-center min-w-[2.5rem]">
                                  {getMedalEmoji(index + 1) ? (
                                    <span className="text-2xl">
                                      {getMedalEmoji(index + 1)}
                                    </span>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-sm font-semibold text-gray-600">
                                        {index + 1}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Avatar e informações */}
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {user.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {user.totalTickets} tickets
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate max-w-[180px] mt-1">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Score */}
                              <div className="text-right">
                                <div className="flex items-center gap-1 justify-end">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-bold text-xl text-gray-900">
                                    {user.averageScore.toFixed(1)}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Satisfação
                                </p>
                              </div>
                            </div>
                          );
                        })}

                      {/* Botão Ver Todos / Ver Menos */}
                      {data.rankingUsersByScore.length > 5 && (
                        <div className="text-center pt-6">
                          <Button
                            variant="ghost"
                            onClick={() => setShowAllAgents(!showAllAgents)}
                            className="w-full text-primary hover:bg-primary/5 font-medium"
                          >
                            {showAllAgents ? (
                              <>
                                <span>Ver Menos</span>
                                <span className="ml-2">↑</span>
                              </>
                            ) : (
                              <>
                                <span>
                                  Ver Todos ({data.rankingUsersByScore.length})
                                </span>
                                <span className="ml-2">↓</span>
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <EmptyState
                      icon="🏆"
                      title="Nenhum atendente encontrado"
                      description="Não há atendentes com dados suficientes para criar um ranking no período selecionado."
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tickets Recentes */}
            <Card className="elevated-1">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">🎫</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Tickets Recentes
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Últimos atendimentos realizados
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={ticketStatusFilter}
                      onValueChange={setTicketStatusFilter}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="AI">IA</SelectItem>
                        <SelectItem value="IN_PROGRESS">
                          Em Andamento
                        </SelectItem>
                        <SelectItem value="CLOSED">Fechados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[428px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 pr-2">
                  {(() => {
                    const filteredTickets = getFilteredTickets();
                    return filteredTickets.length > 0 ? (
                      filteredTickets.map((ticket, index) => (
                        <TicketCard
                          key={`ticket-${ticket.id}-${index}`}
                          ticket={ticket}
                          selected={selectedTicket === ticket.id}
                          highlighted={false}
                          onSelect={(selectedTicket) =>
                            setSelectedTicket(selectedTicket.id)
                          }
                        />
                      ))
                    ) : (
                      <EmptyState
                        icon="🎫"
                        title="Nenhum ticket encontrado"
                        description={
                          ticketStatusFilter === "all"
                            ? "Não há tickets recentes para exibir no período selecionado. Novos atendimentos aparecerão aqui automaticamente."
                            : `Não há tickets com status "${
                                ticketStatusFilter === "AI"
                                  ? "IA"
                                  : ticketStatusFilter === "IN_PROGRESS"
                                  ? "Em Andamento"
                                  : "Fechados"
                              }" no período selecionado.`
                        }
                      />
                    );
                  })()}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    {ticketStatusFilter === "all"
                      ? "Exibindo os 5 tickets mais recentes"
                      : `Exibindo até 5 tickets com status "${
                          ticketStatusFilter === "AI"
                            ? "IA"
                            : ticketStatusFilter === "IN_PROGRESS"
                            ? "Em Andamento"
                            : "Fechados"
                        }"`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
