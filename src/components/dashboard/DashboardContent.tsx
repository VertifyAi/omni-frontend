import { Chat } from "@/components/Chat";

export default function DashboardContent() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <Chat ticketId={1} />
      </div>
    </div>
  );
} 