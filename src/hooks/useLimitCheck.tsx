"use client";

import { useState } from "react";
import { useBilling } from "@/contexts/BillingContext";
import { LimitReachedModal } from "@/components/LimitReachedModal";
import { toast } from "sonner";

type LimitType = 'channels' | 'aiAgents' | 'monthlyAttendances';

interface UseLimitCheckReturn {
  checkLimit: (limitType: LimitType, action?: () => void) => boolean;
  showLimitModal: (limitType: LimitType, title?: string, description?: string) => void;
  LimitModal: React.ReactNode;
}

export function useLimitCheck(): UseLimitCheckReturn {
  const { 
    canCreateChannel, 
    canCreateAIAgent, 
    canProcessAttendance,
    hasActiveSubscription 
  } = useBilling();
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    limitType: LimitType;
    title?: string;
    description?: string;
  }>({
    isOpen: false,
    limitType: 'channels'
  });

  const checkLimit = (limitType: LimitType, action?: () => void): boolean => {
    // Primeiro verifica se tem assinatura ativa
    if (!hasActiveSubscription) {
      toast.error("Você precisa de uma assinatura ativa para usar este recurso");
      return false;
    }

    let canProceed = false;
    
    switch (limitType) {
      case 'channels':
        canProceed = canCreateChannel;
        break;
      case 'aiAgents':
        canProceed = canCreateAIAgent;
        break;
      case 'monthlyAttendances':
        canProceed = canProcessAttendance;
        break;
    }

    if (canProceed) {
      // Limite não atingido, executa a ação se fornecida
      action?.();
      return true;
    } else {
      // Limite atingido, mostra modal
      showLimitModal(limitType);
      return false;
    }
  };

  const showLimitModal = (
    limitType: LimitType, 
    title?: string, 
    description?: string
  ) => {
    setModalState({
      isOpen: true,
      limitType,
      title,
      description
    });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const LimitModal = (
    <LimitReachedModal
      isOpen={modalState.isOpen}
      onClose={handleCloseModal}
      limitType={modalState.limitType}
      title={modalState.title}
      description={modalState.description}
    />
  );

  return {
    checkLimit,
    showLimitModal,
    LimitModal
  };
}

// Hook específico para verificações mais simples
export function useCanPerformAction() {
  const { 
    canCreateChannel, 
    canCreateAIAgent, 
    canProcessAttendance,
    hasActiveSubscription 
  } = useBilling();

  return {
    canCreateChannel: hasActiveSubscription && canCreateChannel,
    canCreateAIAgent: hasActiveSubscription && canCreateAIAgent,
    canProcessAttendance: hasActiveSubscription && canProcessAttendance,
    hasActiveSubscription
  };
} 