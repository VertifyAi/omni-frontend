"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { MessageSquare, Clock, TrendingUp, Bot, UserCheck, AlertTriangle, Star, Calendar, Filter, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import "../globals.css";

// Dados para os gráficos
const channelData = [
  { name: "WhatsApp", tickets: 245, satisfacao: 4.8 },
  { name: "Instagram", tickets: 189, satisfacao: 4.6 },
  { name: "Email", tickets: 156, satisfacao: 4.5 },
  { name: "Chat Web", tickets: 134, satisfacao: 4.7 },
  { name: "Facebook", tickets: 98, satisfacao: 4.4 },
  { name: "Telegram", tickets: 67, satisfacao: 4.6 },
  { name: "LinkedIn", tickets: 45, satisfacao: 4.3 },
];

const performanceData = [
  { periodo: "00h-06h", ia: 95, humano: 78, tickets: 45 },
  { periodo: "06h-12h", ia: 92, humano: 85, tickets: 156 },
  { periodo: "12h-18h", ia: 88, humano: 89, tickets: 234 },
  { periodo: "18h-24h", ia: 91, humano: 82, tickets: 189 },
];

const satisfactionTrend = [
  { mes: "Jan", ia: 4.6, humano: 4.2, geral: 4.4 },
  { mes: "Fev", ia: 4.7, humano: 4.3, geral: 4.5 },
  { mes: "Mar", ia: 4.8, humano: 4.4, geral: 4.6 },
  { mes: "Abr", ia: 4.9, humano: 4.5, geral: 4.7 },
  { mes: "Mai", ia: 4.8, humano: 4.6, geral: 4.7 },
  { mes: "Jun", ia: 4.9, humano: 4.7, geral: 4.8 },
];

const categoryData = [
  { name: "Suporte Técnico", value: 35, color: "#E97939" },
  { name: "Vendas", value: 28, color: "#8A39DB" },
  { name: "Financeiro", value: 18, color: "#3B82F6" },
  { name: "Cancelamento", value: 12, color: "#EF4444" },
  { name: "Outros", value: 7, color: "#10B981" },
];

const agentPerformance = [
  { nome: "Vera (IA)", tickets: 1247, satisfacao: 4.8, tempo: 2.3, tipo: "IA" },
  { nome: "Ana Silva", tickets: 234, satisfacao: 4.6, tempo: 15.2, tipo: "Humano" },
  { nome: "Carlos Santos", tickets: 198, satisfacao: 4.5, tempo: 18.7, tipo: "Humano" },
  { nome: "Maria Costa", tickets: 187, satisfacao: 4.7, tempo: 14.8, tipo: "Humano" },
  { nome: "João Oliveira", tickets: 156, satisfacao: 4.4, tempo: 19.3, tipo: "Humano" },
];

const recentTickets = [
  { id: "#12847", cliente: "João Silva", canal: "WhatsApp", status: "Resolvido", agente: "Vera (IA)", tempo: "2min", satisfacao: 5 },
  { id: "#12846", cliente: "Maria Santos", canal: "Instagram", status: "Em andamento", agente: "Ana Silva", tempo: "15min", satisfacao: null },
  { id: "#12845", cliente: "Pedro Costa", canal: "Email", status: "Resolvido", agente: "Vera (IA)", tempo: "1min", satisfacao: 4 },
  { id: "#12844", cliente: "Ana Oliveira", canal: "Chat Web", status: "Pendente", agente: "Carlos Santos", tempo: "45min", satisfacao: null },
  { id: "#12843", cliente: "Lucas Pereira", canal: "WhatsApp", status: "Resolvido", agente: "Vera (IA)", tempo: "3min", satisfacao: 5 },
];

export default function DashboardPage() {
  return (
    <div className="p-8 ml-16 bg-gradient-to-br from-background to-white-soft min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Visão Geral
          </h1>
          <p className="text-muted-foreground mt-2">Visão geral do desempenho do atendimento com IA</p>
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[140px] elevated-1">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="elevated-1 hover-cool-blue">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          
          <Button className="bg-primary">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="elevated-2 hover:elevated-3 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atendimentos</CardTitle>
            <MessageSquare className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-cool-teal bg-clip-text text-transparent">2,847</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-600 font-medium">+12.5% vs mês anterior</p>
            </div>
            <Progress value={75} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="elevated-2 hover:elevated-3 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação Geral</CardTitle>
            <Star className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.8</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-600 font-medium">+0.3 vs mês anterior</p>
            </div>
            <div className="flex gap-1 mt-3">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="elevated-2 hover:elevated-3 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolução IA</CardTitle>
            <Bot className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">87%</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <p className="text-xs text-green-600 font-medium">+5.2% vs mês anterior</p>
            </div>
            <Progress value={87} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="elevated-2 hover:elevated-3 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">4.2min</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
              <p className="text-xs text-red-600 font-medium">-2.1min vs mês anterior</p>
            </div>
            <Progress value={65} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Principais */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Distribuição por Canal */}
        <Card className="elevated-1 lg:col-span-2">
          <CardHeader className="text-center">
            <CardTitle className="text-lg font-semibold">Atendimentos por Canal</CardTitle>
          </CardHeader>
          <CardContent className="grid place-items-center p-6">
            <div className="h-[500px] w-full max-w-[700px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "oklch(0.556 0 0)", fontSize: 11 }}
                    axisLine={{ stroke: "oklch(0.88 0.012 260)" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                    axisLine={{ stroke: "oklch(0.88 0.012 260)" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.88 0.012 260)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                  />
                  <Bar 
                    dataKey="tickets" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E97939" />
                      <stop offset="100%" stopColor="#8A39DB" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Categoria */}
        <Card className="elevated-1">
          <CardHeader className="text-center">
            <CardTitle className="text-lg font-semibold">Categorias de Atendimento</CardTitle>
          </CardHeader>
          <CardContent className="grid place-items-center p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.88 0.012 260)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-4 w-full">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance e Tendências */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Performance IA vs Humano */}
        <Card className="elevated-1">
          <CardHeader className="text-center">
            <CardTitle className="text-lg font-semibold">Performance: IA vs Humano</CardTitle>
          </CardHeader>
          <CardContent className="grid place-items-center p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" />
                  <XAxis 
                    dataKey="periodo" 
                    tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                    axisLine={{ stroke: "oklch(0.88 0.012 260)" }}
                  />
                  <YAxis 
                    tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                    axisLine={{ stroke: "oklch(0.88 0.012 260)" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.88 0.012 260)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                  />
                  <Bar dataKey="ia" fill="#8A39DB" radius={[2, 2, 0, 0]} name="IA" />
                  <Bar dataKey="humano" fill="#E97939" radius={[2, 2, 0, 0]} name="Humano" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tendência de Satisfação */}
        <Card className="elevated-1">
          <CardHeader className="text-center">
            <CardTitle className="text-lg font-semibold">Evolução da Satisfação</CardTitle>
          </CardHeader>
          <CardContent className="grid place-items-center p-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={satisfactionTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.93 0.008 250)" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                    axisLine={{ stroke: "oklch(0.88 0.012 260)" }}
                  />
                  <YAxis 
                    domain={[4.0, 5.0]}
                    tick={{ fill: "oklch(0.556 0 0)", fontSize: 12 }}
                    axisLine={{ stroke: "oklch(0.88 0.012 260)" }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.88 0.012 260)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="geral" 
                    stroke="#3B82F6" 
                    fill="url(#areaGradient)"
                    strokeWidth={3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ia" 
                    stroke="#8A39DB"
                    strokeWidth={2}
                    dot={{ fill: "#8A39DB", r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humano" 
                    stroke="#E97939"
                    strokeWidth={2}
                    dot={{ fill: "#E97939", r: 4 }}
                  />
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas e Listas */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Performance dos Agentes */}
        <Card className="elevated-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Performance dos Agentes</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Buscar agente..." className="max-w-xs" />
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentPerformance.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white-soft border border-white-warm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-cool-teal flex items-center justify-center text-white font-semibold">
                      {agent.tipo === "IA" ? <Bot className="w-5 h-5" /> : agent.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{agent.nome}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={agent.tipo === "IA" ? "default" : "secondary"}>
                          {agent.tipo}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{agent.tickets} tickets</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{agent.satisfacao}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{agent.tempo}min médio</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tickets Recentes */}
        <Card className="elevated-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Tickets Recentes</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="resolved">Resolvidos</SelectItem>
                  <SelectItem value="progress">Em andamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white-soft border border-white-warm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-primary">{ticket.id}</span>
                      <Badge variant={
                        ticket.status === "Resolvido" ? "default" : 
                        ticket.status === "Em andamento" ? "secondary" : "destructive"
                      }>
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{ticket.cliente}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{ticket.canal}</span>
                      <span>•</span>
                      <span>{ticket.agente}</span>
                      <span>•</span>
                      <span>{ticket.tempo}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {ticket.satisfacao && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{ticket.satisfacao}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="elevated-1 border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-yellow-800">Pico de atendimentos</p>
                <p className="text-xs text-yellow-600">Volume 40% acima da média nas últimas 2h</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-800">Agente indisponível</p>
                <p className="text-xs text-red-600">Carlos Santos offline há 30min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="elevated-1 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800">IA Performance</p>
                <p className="text-xs text-green-600">87% de resolução automática este mês</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Melhor canal</p>
                <p className="text-xs text-blue-600">WhatsApp com 4.8 de satisfação média</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="elevated-1 border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-500" />
              Metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Satisfação Geral</span>
                  <span>4.8/5.0</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Resolução IA</span>
                  <span>87/90%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Tempo Médio</span>
                  <span>4.2/3.0min</span>
                </div>
                <Progress value={71} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 