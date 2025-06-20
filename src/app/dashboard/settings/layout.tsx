"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  // Bell,
  Users,
  // Palette,
  Plug,
  User,
  // CreditCard,
  // Building2,
} from "lucide-react";

const settingsNavigation = [
  {
    name: "Perfil",
    href: "/dashboard/settings/profile",
    icon: User,
    description: "Gerenciar perfil",
  },
  // {
  //   name: "Notificações",
  //   href: "/settings/notifications",
  //   icon: Bell,
  //   description: "Preferências de notificações",
  // },
  {
    name: "Usuários",
    href: "/dashboard/settings/users",
    icon: Users,
    description: "Gerenciar membros da equipe",
  },
  // {
  //   name: "Aparência",
  //   href: "/settings/appearance",
  //   icon: Palette,
  //   description: "Personalizar a interface",
  // },
  // {
  //   name: "Segurança",
  //   href: "/settings/security",
  //   icon: Lock,
  //   description: "Senhas e autenticação",
  // },
  {
    name: "Integrações",
    href: "/dashboard/settings/integrations",
    icon: Plug,
    description: "Conectar com outros serviços",
  },
  // {
  //   name: "Faturamento",
  //   href: "/dashboard/settings/billing",
  //   icon: CreditCard,
  //   description: "Planos e pagamentos",
  // },
  // {
  //   name: "Empresa",
  //   href: "/dashboard/settings/company",
  //   icon: Building2,
  //   description: "Informações da empresa",
  // },
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
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
} 