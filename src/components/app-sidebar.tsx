"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Plug2,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Atendimento",
    href: "/tickets",
    icon: MessageSquare,
  },
  {
    name: "Clientes",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Integrações",
    href: "/integrations",
    icon: Plug2,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-16 border-r bg-background">
      <div className="flex h-full flex-col items-center py-4">
        <div className="mb-8">
          <img src="https://vertify-public-assets.s3.us-east-2.amazonaws.com/logos/Design+sem+nome.png" alt="Logo" className="h-8 w-8" />
        </div>
        <nav className="flex-1 space-y-2">
          <TooltipProvider>
            {navigation.map((item) => {
              const isActive = pathname === item.href
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
                      <item.icon className="h-6 w-6" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-4">
                    <span>{item.name}</span>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </nav>
      </div>
    </div>
  )
}
