"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useBilling } from "@/contexts/BillingContext";
import { Zap, TrendingUp, Calendar, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface BillingStatusCardProps {
  compact?: boolean;
  showUpgradeButton?: boolean;
}

export function BillingStatusCard({ 
  compact = false, 
  showUpgradeButton = true 
}: BillingStatusCardProps) {
  const { 
    usageStats, 
    hasActiveSubscription, 
    createPortalSession,
    loading 
  } = useBilling();
  
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  const handleManageSubscription = async () => {
    try {
      setIsLoadingPortal(true);
      const portalUrl = await createPortalSession();
      window.open(portalUrl, '_blank');
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
      toast.error('Erro ao acessar portal de billing');
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'trialing':
        return 'Trial';
      case 'past_due':
        return 'Vencida';
      case 'inactive':
        return 'Inativa';
      default:
        return 'Desconhecido';
    }
  };

  const calculateUsagePercentage = (current: number, limit: number, isUnlimited: boolean) => {
    if (isUnlimited) return 0;
    return Math.min((current / limit) * 100, 100);
  };

  if (loading) {
    return (
      <Card className={`${compact ? 'p-3' : ''} elevated-1`}>
        <CardContent className={compact ? 'p-0' : ''}>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-muted rounded animate-pulse" />
            <div className="w-20 h-4 bg-muted rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <Card className={`${compact ? 'p-3' : ''} elevated-1 border-orange-200 bg-orange-50/50`}>
        <CardContent className={compact ? 'p-0' : 'pt-6'}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              Assinatura Inativa
            </span>
          </div>
          {showUpgradeButton && (
            <Button asChild size="sm" className="w-full bg-gradient-to-r from-[#E97939] to-[#8A39DB] hover:opacity-90">
              <Link href="/pricing">
                <TrendingUp className="w-4 h-4 mr-2" />
                Ativar Plano
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!usageStats) return null;

  return (
    <Card className={`${compact ? 'p-3' : ''} elevated-1`}>
      {!compact && (
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Plano {usageStats.planType}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={getStatusColor(usageStats.subscriptionStatus)}
            >
              {getStatusText(usageStats.subscriptionStatus)}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {usageStats.daysUntilReset}d restantes
            </span>
          </div>
        </CardHeader>
      )}
      
      <CardContent className={compact ? 'p-0' : 'pt-0'}>
        <div className="space-y-3">
          {/* Canais */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Canais</span>
              <span className="font-medium">
                {usageStats.usage.channels.current}
                {!usageStats.usage.channels.isUnlimited && ` / ${usageStats.usage.channels.limit}`}
              </span>
            </div>
            {!usageStats.usage.channels.isUnlimited && (
              <Progress 
                value={calculateUsagePercentage(
                  usageStats.usage.channels.current,
                  usageStats.usage.channels.limit,
                  usageStats.usage.channels.isUnlimited
                )}
                className="h-1.5"
              />
            )}
          </div>

          {/* Agentes IA */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Agentes IA</span>
              <span className="font-medium">
                {usageStats.usage.aiAgents.current}
                {!usageStats.usage.aiAgents.isUnlimited && ` / ${usageStats.usage.aiAgents.limit}`}
              </span>
            </div>
            {!usageStats.usage.aiAgents.isUnlimited && (
              <Progress 
                value={calculateUsagePercentage(
                  usageStats.usage.aiAgents.current,
                  usageStats.usage.aiAgents.limit,
                  usageStats.usage.aiAgents.isUnlimited
                )}
                className="h-1.5"
              />
            )}
          </div>

          {/* Atendimentos */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Atendimentos</span>
              <span className="font-medium">
                {usageStats.usage.monthlyAttendances.current.toLocaleString()}
                {!usageStats.usage.monthlyAttendances.isUnlimited && 
                  ` / ${usageStats.usage.monthlyAttendances.limit.toLocaleString()}`
                }
              </span>
            </div>
            {!usageStats.usage.monthlyAttendances.isUnlimited && (
              <Progress 
                value={calculateUsagePercentage(
                  usageStats.usage.monthlyAttendances.current,
                  usageStats.usage.monthlyAttendances.limit,
                  usageStats.usage.monthlyAttendances.isUnlimited
                )}
                className="h-1.5"
              />
            )}
          </div>
        </div>

        {!compact && (
          <div className="flex gap-2 mt-4">
            {showUpgradeButton && (
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href="/pricing">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Upgrade
                </Link>
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleManageSubscription}
              disabled={isLoadingPortal}
              className="flex-1"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {isLoadingPortal ? 'Carregando...' : 'Gerenciar'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 