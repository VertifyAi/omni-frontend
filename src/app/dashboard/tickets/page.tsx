"use client";

import { useState } from "react";
import { TicketList } from "@/components/TicketList";
import { Chat } from "@/components/Chat";
import { Ticket, TicketStatus } from "@/types/chat";
import { fetchApi } from "@/lib/fetchApi";

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedTab, setSelectedTab] = useState<TicketStatus>(TicketStatus.AI);

  const handleChangeStatus = async () => {
    try {
      await fetchApi(`/api/tickets/status/${selectedTicket?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: TicketStatus.IN_PROGRESS,
        }),
      });

      setSelectedTicket((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: TicketStatus.IN_PROGRESS,
        };
      });

      setSelectedTab(TicketStatus.IN_PROGRESS);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen ml-16">
      <div className="w-[400px] border-r">
        <TicketList
          onTicketSelect={setSelectedTicket}
          selectedTicket={selectedTicket}
          setSelectedTab={setSelectedTab}
          selectedTab={selectedTab}
        />
      </div>
      <div className="flex-1">
        {selectedTicket ? (
          <Chat
            ticket={selectedTicket}
            handleChangeStatus={handleChangeStatus}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Selecione um ticket para iniciar o atendimento
          </div>
        )}
      </div>
    </div>
  );
}
