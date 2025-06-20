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
  private isInitialized = false;
  private isConnecting = false;

  async initialize() {
    if (this.isInitialized) {
      console.log("ChatService: Já foi inicializado");
      return;
    }
    
    console.log("ChatService: Inicializando serviço...");
    this.isInitialized = true;
    this.connect();
  }

  connect() {
    if (this.socket?.connected) {
      console.log("ChatService: Socket já está conectado");
      return;
    }

    if (this.isConnecting) {
      console.log("ChatService: Conexão já está em andamento");
      return;
    }

    this.isConnecting = true;
    const wsUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log("ChatService: Conectando ao WebSocket em:", wsUrl);

    if (!wsUrl) {
      console.error("ChatService: NEXT_PUBLIC_API_URL não está definida");
      this.isConnecting = false;
      return;
    }

    this.socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("ChatService: Conectado ao WebSocket com sucesso!");
      console.log("ChatService: Socket ID:", this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("ChatService: Erro ao conectar ao WebSocket:", error);
      this.isConnecting = false;
    });

    this.socket.on("new_message", (data: WebSocketEvents["new_message"]) => {
      console.log('ChatService: Dados de nova mensagem recebidos:', data);

      // Incrementar contador de mensagens não lidas
      const currentCount = this.unreadMessages.get(data.ticketId) || 0;
      this.unreadMessages.set(data.ticketId, currentCount + 1);
      this.notifyUnreadChange();

      // Converter dados do WebSocket para o formato Message
      const message: Message = {
        // id: data.id,
        ticketId: data.ticketId,
        message: data.message,
        senderName: data.senderName,
        senderType: data.senderType,
        senderIdentifier: data.senderIdentifier,
        createdAt: data.createdAt
      };

      console.log(`ChatService: Notificando ${this.messageCallbacks.size} callbacks de mensagem`);
      this.messageCallbacks.forEach((callback) => callback(message));
    });

    this.socket.on("new_ticket", (data: WebSocketEvents["new_ticket"]) => {
      console.log("ChatService: Novo ticket recebido via WebSocket:", data);
      console.log(`ChatService: Notificando ${this.ticketCallbacks.size} callbacks de ticket`);
      
      let callbackIndex = 0;
      this.ticketCallbacks.forEach((callback) => {
        console.log(`ChatService: Executando callback ${callbackIndex + 1} para novo ticket`);
        try {
          callback(data);
        } catch (error) {
          console.error(`ChatService: Erro ao executar callback ${callbackIndex + 1}:`, error);
        }
        callbackIndex++;
      });
    });

    this.socket.on("disconnect", (reason) => {
      console.log("ChatService: Desconectado do WebSocket. Razão:", reason);
      this.isConnecting = false;
    });

    this.socket.on("error", (error) => {
      console.error("ChatService: Erro no socket:", error);
      this.isConnecting = false;
    });

    // Eventos de debug
    this.socket.onAny((eventName, ...args) => {
      console.log(`ChatService: Evento recebido '${eventName}':`, args);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log("ChatService: Desconectando socket...");
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  async sendMessage(ticketId: number, message: string): Promise<void> {
    if (!this.socket?.connected) {
      console.log("ChatService: Socket não conectado, tentando reconectar...");
      this.connect();
      
      // Aguardar um pouco para a conexão ser estabelecida
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (!this.socket?.connected) {
      console.error("ChatService: Não foi possível estabelecer conexão para enviar mensagem");
      return;
    }

    console.log("ChatService: Enviando mensagem:", { ticketId, message });
    this.socket?.emit("send_message", {
      ticketId,
      message,
    });
  }

  onNewMessage(callback: MessageCallback): () => void {
    console.log("ChatService: Registrando callback para novas mensagens", callback);
    this.messageCallbacks.add(callback);
    return () => {
      console.log("ChatService: Removendo callback de novas mensagens");
      this.messageCallbacks.delete(callback);
    };
  }

  onTicketUpdate(callback: TicketCallback): () => void {
    console.log("ChatService: Registrando callback para atualizações de ticket");
    this.ticketCallbacks.add(callback);
    return () => {
      console.log("ChatService: Removendo callback de atualizações de ticket");
      this.ticketCallbacks.delete(callback);
    };
  }

  onNewTicket(callback: TicketCallback): () => void {
    console.log("ChatService: Registrando callback para novos tickets");
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

  // Métodos de debug
  getConnectionStatus() {
    return {
      connected: this.socket?.connected || false,
      id: this.socket?.id,
      messageCallbacks: this.messageCallbacks.size,
      ticketCallbacks: this.ticketCallbacks.size,
      isInitialized: this.isInitialized,
      isConnecting: this.isConnecting
    };
  }
}

export const chatService = new ChatService();

// Inicializar automaticamente quando o módulo for carregado (apenas no browser)
if (typeof window !== 'undefined') {
  chatService.initialize();
}
