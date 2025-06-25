"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Settings,
  Bell,
  // HelpCircle,
  User,
  Building2,
  Archive,
  Monitor,
  Bot,
  Workflow,
  LogOut,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";
import { UserRole } from "@/types/users";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const navigation = [
  {
    name: "Visão Geral",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    name: "Atendimento",
    href: "/dashboard/tickets",
    icon: Inbox,
  },
  {
    name: "Contatos",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    name: "Equipes",
    href: "/dashboard/teams",
    icon: Building2,
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    name: "Agentes de IA",
    href: "/dashboard/agents",
    icon: Bot,
    roles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    name: "Fluxo de Atendimento",
    href: "/dashboard/workflows",
    icon: Workflow,
    roles: [UserRole.ADMIN],
  },
];

const options = [
  {
    name: "Notificações",
    href: "",
    icon: Bell,
  },
  {
    name: "Configurações",
    href: "/dashboard/settings/profile",
    icon: Settings,
    roles: [UserRole.ADMIN],
  },
  // {
  //   name: "Ajuda",
  //   href: "/dashboard/help",
  //   icon: HelpCircle,
  // },
  {
    name: "Perfil",
    href: "/dashboard/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { hasRole, user } = useAuth();
  const router = useRouter();

  // Função para fazer logout
  const handleLogout = () => {
    // Remove o token do cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Redireciona para login
    router.push('/sign-in');
  };

  // Filtra os itens de navegação com base nas permissões do usuário
  const filteredNavigation = navigation.filter(item => {
    // Se não tiver roles definidas, permite para todos
    if (!item.roles) return true;
    // Caso contrário, verifica se o usuário tem pelo menos uma das roles necessárias
    return hasRole(item.roles);
  });

  // Filtra as opções com base nas permissões do usuário
  const filteredOptions = options.filter(item => {
    // Se não tiver roles definidas, permite para todos
    if (!item.roles) return true;
    // Caso contrário, verifica se o usuário tem pelo menos uma das roles necessárias
    return hasRole(item.roles);
  });

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-16 border-r bg-white">
      <div className="flex h-full flex-col items-center py-4">
        <nav className="flex-1 space-y-2">
          <TooltipProvider>
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:bg-accent",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-4">
                    <span>{item.name}</span>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>
        <nav className="flex flex-col gap-2">
          <TooltipProvider>
            {filteredOptions.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              if (item.name === "Notificações") {
                return (
                  <DropdownMenu
                    key={index}
                    open={isNotificationsOpen}
                    onOpenChange={setIsNotificationsOpen}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:bg-accent",
                            (isActive || isNotificationsOpen) && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex items-center gap-4">
                        <span>{item.name}</span>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent
                      side="right"
                      className="w-[380px] p-4 h-[500px]"
                      align="start"
                      alignOffset={-40}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Notificações</h2>
                        <Button variant="ghost" size="sm">
                          Arquivar todas
                        </Button>
                      </div>
                      <Tabs defaultValue="new" className="w-full">
                        <TabsList className="w-full mb-4">
                          <TabsTrigger value="new" className="flex-1">
                            New
                          </TabsTrigger>
                          <TabsTrigger value="archived" className="flex-1">
                            Archived
                          </TabsTrigger>
                          <TabsTrigger value="all" className="flex-1">
                            All
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="new" className="mt-0">
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Monitor className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold">You are up to date!</h3>
                            <p className="text-sm text-muted-foreground">
                              There are no new notifications.
                            </p>
                          </div>
                        </TabsContent>
                        <TabsContent value="archived" className="mt-0">
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Archive className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold">No archived notifications</h3>
                            <p className="text-sm text-muted-foreground">
                              Archived notifications will appear here.
                            </p>
                          </div>
                        </TabsContent>
                        <TabsContent value="all" className="mt-0">
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold">No notifications yet</h3>
                            <p className="text-sm text-muted-foreground">
                              When you receive notifications, they will appear here.
                            </p>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              if (item.name === "Perfil") {
                return (
                  <DropdownMenu
                    key={index}
                    open={isProfileOpen}
                    onOpenChange={setIsProfileOpen}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:bg-accent",
                            (isActive || isProfileOpen) && "bg-accent text-accent-foreground"
                          )}
                        >
                          <Avatar>
                            <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                            />
                            <AvatarFallback>
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex items-center gap-4">
                        <span>{item.name}</span>
                      </TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent
                      side="right"
                      className="w-48"
                      align="start"
                      alignOffset={-40}
                    >
                      <div className="px-3 py-2 border-b">
                        <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:bg-accent",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-4">
                    <span>{item.name}</span>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>

        <div className="mt-8">
          <Image
            src="https://vertify-public-assets.s3.us-east-2.amazonaws.com/logos/Design+sem+nome.png"
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
        </div>
      </div>
    </div>
  );
}
