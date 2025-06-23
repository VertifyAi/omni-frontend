"use client";

import { useState } from "react";
import { TicketList } from "@/components/TicketList";
import { Chat } from "@/components/Chat";
import { Ticket, TicketPriorityLevel, TicketStatus } from "@/types/chat";
import { ChangeTicketStatusDto } from "@/types/ChangeTicketStatusDto";
import { fetchApi } from "@/lib/fetchApi";
import { useAuth } from "@/contexts/AuthContext";
import "../../globals.css";

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedTab, setSelectedTab] = useState<TicketStatus>(TicketStatus.IN_PROGRESS);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();

  const handleChangeStatus = async (status: TicketStatus) => {
    try {
      const payload: ChangeTicketStatusDto = {
        status: status,
      };

      if (status === TicketStatus.IN_PROGRESS && user?.id) {
        payload.userId = user.id;
        payload.priorityLevel = TicketPriorityLevel.MEDIUM;
      }

      await fetchApi(`/api/tickets/status/${selectedTicket?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setSelectedTicket((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: status,
          userId: payload.userId,
          priorityLevel: payload.priorityLevel || TicketPriorityLevel.MEDIUM,
        };
      });

      setSelectedTab(status);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen ml-16 bg-gradient-to-br from-background to-white-muted">
      {/* Nível 2: Listagem de Atendimentos */}
      <div className="w-[400px] bg-white-soft border-r border-white-warm shadow-white-soft">
        <TicketList
          onTicketSelect={setSelectedTicket}
          selectedTicket={selectedTicket}
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
          refreshTrigger={refreshTrigger}
        />
      </div>
      
      {/* Nível 3: Área do Chat */}
      <div className="flex-1 bg-white-warm">
        {selectedTicket ? (
          <Chat
            ticket={selectedTicket}
            handleChangeStatus={handleChangeStatus}
            onTicketUpdated={() => {
              setRefreshTrigger(prev => prev + 1);
              setSelectedTicket(null); // Desselecionar o ticket transferido
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-white-warm">
            <div className="text-center p-8 rounded-2xl bg-white-soft border border-white-warm shadow-white-soft max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhum ticket selecionado
              </h3>
              <p className="text-sm text-muted-foreground">
                Selecione um ticket na lista ao lado para iniciar o atendimento
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
