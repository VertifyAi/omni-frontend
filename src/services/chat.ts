import { io, Socket } from "socket.io-client";
import { Message, Ticket, WebSocketEvents } from "@/types/chat";

type MessageCallback = (message: Message) => void;
type TicketCallback = (ticket: Ticket) => void;

class ChatService {
  private socket: Socket | null = null;
  private messageCallbacks: Set<MessageCallback> = new Set();
  private ticketCallbacks: Set<TicketCallback> = new Set();
  private unreadMessages: Map<number, number> = new Map();
  private unreadCallbacks: Set<() => void> = new Set();

  async initialize() {
    this.connect();
  }

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_API_URL);

    this.socket.on("connect", () => {
      console.log("Conectado ao WebSocket com sucesso!");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Erro ao conectar ao WebSocket:", error);
    });

    this.socket.on("new_message", (data: WebSocketEvents["new_message"]) => {
      console.log('Dados recebidos do WebSocket:', data);
    

      
      // Incrementar contador de mensagens não lidas
      const currentCount = this.unreadMessages.get(data.ticketId) || 0;
      this.unreadMessages.set(data.ticketId, currentCount + 1);
      this.notifyUnreadChange();

      this.messageCallbacks.forEach((callback) => callback(data));
    });

    this.socket?.on("new_ticket", (data: Ticket) => {
      console.log("Novo ticket recebido:", data);
      this.ticketCallbacks.forEach((callback) => callback(data));
      // Incrementar contador de mensagens não lidas
      const currentCount = this.unreadMessages.get(data.id) || 0;
      this.unreadMessages.set(data.id, currentCount + 1);
      this.notifyUnreadChange();
    });

    this.socket.on("disconnect", () => {
      console.log("Desconectado do WebSocket");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  async sendMessage(ticketId: number, message: string): Promise<void> {
    if (!this.socket?.connected) {
      this.connect();
    }

    this.socket?.emit("send_message", {
      ticketId,
      message,
    });
  }

  onNewMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);
    return () => this.messageCallbacks.delete(callback);
  }

  onTicketUpdate(callback: TicketCallback): () => void {
    this.ticketCallbacks.add(callback);
    return () => this.ticketCallbacks.delete(callback);
  }

  onNewTicket(callback: TicketCallback): () => void {
    return this.onTicketUpdate(callback);
  }

  markAsRead(ticketId: number) {
    this.unreadMessages.set(ticketId, 0);
    this.notifyUnreadChange();
  }

  getUnreadCount(ticketId: number): number {
    return this.unreadMessages.get(ticketId) || 0;
  }

  onUnreadChange(callback: () => void): () => void {
    this.unreadCallbacks.add(callback);
    return () => this.unreadCallbacks.delete(callback);
  }
  
  private notifyUnreadChange() {
    this.unreadCallbacks.forEach((callback) => callback());
  }
  
}

export const chatService = new ChatService();
