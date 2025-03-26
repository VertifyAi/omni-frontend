"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Settings,
  Bell,
  Users,
  Palette,
  Plug,
  CreditCard,
  Building2,
} from "lucide-react";

const settingsNavigation = [
  {
    name: "Geral",
    href: "/settings",
    icon: Settings,
    description: "Configurações gerais da conta",
  },
  {
    name: "Notificações",
    href: "/settings/notifications",
    icon: Bell,
    description: "Preferências de notificações",
  },
  {
    name: "Equipe",
    href: "/settings/teams",
    icon: Users,
    description: "Gerenciar membros da equipe",
  },
  {
    name: "Aparência",
    href: "/settings/appearance",
    icon: Palette,
    description: "Personalizar a interface",
  },
  // {
  //   name: "Segurança",
  //   href: "/settings/security",
  //   icon: Lock,
  //   description: "Senhas e autenticação",
  // },
  {
    name: "Integrações",
    href: "/settings/integrations",
    icon: Plug,
    description: "Conectar com outros serviços",
  },
  {
    name: "Faturamento",
    href: "/settings/billing",
    icon: CreditCard,
    description: "Planos e pagamentos",
  },
  {
    name: "Empresa",
    href: "/settings/company",
    icon: Building2,
    description: "Informações da empresa",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-background ml-16">
        <div className="flex flex-col gap-2 p-6">
          <h2 className="text-lg font-semibold">Configurações</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie suas preferências
          </p>
        </div>
        <nav className="space-y-0.5 px-2">
          {settingsNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                  isActive ? "bg-accent" : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-6">
          {children}
        </div>
      </main>
    </div>
  );
} 