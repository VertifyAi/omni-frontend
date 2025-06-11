"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useBilling } from "@/contexts/BillingContext";
import { TrendingUp, Zap, Users, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType: 'channels' | 'aiAgents' | 'monthlyAttendances';
  title?: string;
  description?: string;
}

const limitConfig = {
  channels: {
    icon: MessageSquare,
    title: "Limite de Canais Atingido",
    description: "Você atingiu o limite máximo de canais para seu plano atual.",
    benefit: "Conecte canais ilimitados e expanda seu atendimento"
  },
  aiAgents: {
    icon: Zap,
    title: "Limite de Agentes IA Atingido", 
    description: "Você atingiu o limite máximo de agentes de IA para seu plano atual.",
    benefit: "Crie agentes especializados para diferentes departamentos"
  },
  monthlyAttendances: {
    icon: Users,
    title: "Limite de Atendimentos Atingido",
    description: "Você atingiu o limite mensal de atendimentos para seu plano atual.",
    benefit: "Processe mais atendimentos e escale seu negócio"
  }
};

export function LimitReachedModal({ 
  isOpen, 
  onClose, 
  limitType, 
  title, 
  description 
}: LimitReachedModalProps) {
  const { usageStats, plans } = useBilling();
  const router = useRouter();
  
  const config = limitConfig[limitType];
  const Icon = config.icon;
  
  const currentPlan = plans.find(plan => 
    plan.id.toLowerCase() === usageStats?.planType.toLowerCase()
  );
  
  const recommendedPlan = plans.find(plan => {
    if (!currentPlan) return plan.id === 'profissional';
    
    // Se está no essencial, recomenda profissional
    if (currentPlan.id === 'essencial') return plan.id === 'profissional';
    
    // Se está no profissional, recomenda empresarial
    if (currentPlan.id === 'profissional') return plan.id === 'empresarial';
    
    return false;
  });

  const handleUpgrade = () => {
    onClose();
    router.push('/pricing');
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? 'Ilimitado' : limit.toLocaleString();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white-pure border border-white-warm shadow-white-elevated max-w-lg">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <Icon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-xl font-semibold text-foreground">
                {title || config.title}
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-muted-foreground leading-relaxed">
            {description || config.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Current vs Recommended Plan Comparison */}
        {currentPlan && recommendedPlan && (
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Current Plan */}
              <div className="p-4 bg-muted/50 rounded-lg border">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Plano Atual</h4>
                <div className="text-lg font-bold">{currentPlan.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {limitType === 'channels' && `${formatLimit(currentPlan.limits.channels)} canais`}
                  {limitType === 'aiAgents' && `${formatLimit(currentPlan.limits.aiAgents)} agentes`}
                  {limitType === 'monthlyAttendances' && `${currentPlan.limits.monthlyAttendances.toLocaleString()} atendimentos`}
                </div>
              </div>

              {/* Recommended Plan */}
              <div className="p-4 bg-gradient-to-r from-[#E97939]/10 to-[#8A39DB]/10 rounded-lg border border-primary/20">
                <h4 className="font-medium text-sm text-primary mb-2">Recomendado</h4>
                <div className="text-lg font-bold text-primary">{recommendedPlan.name}</div>
                <div className="text-sm text-primary/80 mt-1">
                  {limitType === 'channels' && `${formatLimit(recommendedPlan.limits.channels)} canais`}
                  {limitType === 'aiAgents' && `${formatLimit(recommendedPlan.limits.aiAgents)} agentes`}
                  {limitType === 'monthlyAttendances' && `${recommendedPlan.limits.monthlyAttendances.toLocaleString()} atendimentos`}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium text-sm">{config.benefit}</span>
              </div>
            </div>
          </div>
        )}
        
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            className="hover:bg-white-soft"
          >
            Continuar com limite
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-[#E97939] to-[#8A39DB] hover:opacity-90"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Fazer Upgrade
            </div>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 