"use client";

import { useState } from "react";
import { TicketList } from "@/components/TicketList";
import { Chat } from "@/components/Chat";
import { Ticket } from "@/types/chat";

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <div className="flex h-screen ml-16">
      <div className="w-1/3 border-r">
        <TicketList
          onTicketSelect={setSelectedTicket}
          selectedTicket={selectedTicket}
        />
      </div>
      <div className="flex-1">
        {selectedTicket ? (
          <Chat ticket={selectedTicket} />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Selecione um ticket para iniciar o atendimento
          </div>
        )}
      </div>
    </div>
  );
} 