import { io, Socket } from 'socket.io-client';
import { TicketMessage } from '@/types/ticket';
import { WebSocketEvents } from '@/types/chat';

class WebSocketService {
  private socket: Socket | null = null;
  private url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  connect() {
    if (this.socket?.connected) {
      console.log('WebSocketService: Já está conectado');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    try {
      console.log('WebSocketService: Conectando ao WebSocket...');
      
      // Obter token de autenticação
      let token = null;
      try {
        token = localStorage.getItem('auth_token');
      } catch (error) {
        console.error('WebSocketService: Erro ao acessar localStorage:', error);
      }

      if (!token) {
        console.error('WebSocketService: Token não encontrado');
        return;
      }

      // Configurar Socket.IO com autenticação
      this.socket = io(this.url, {
        auth: {
          token
        },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      // Configurar handlers de eventos
      this.socket.on('connect', () => {
        console.log('WebSocketService: Conectado com sucesso');
        this.reconnectAttempts = 0;
        window.dispatchEvent(new Event('connect'));
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocketService: Desconectado');
        window.dispatchEvent(new Event('disconnect'));
        this.scheduleReconnect();
      });

      this.socket.on('connect_error', (error) => {
        console.error('WebSocketService: Erro de conexão:', error);
        this.scheduleReconnect();
      });

      // Configurar handlers para eventos específicos
      this.socket.on('new_message', (data: WebSocketEvents['new_message']) => {
        console.log('WebSocketService: Nova mensagem recebida:', data);
        window.dispatchEvent(new CustomEvent('newMessage', { detail: data }));
      });

      this.socket.on('ticket_updated', (data: WebSocketEvents['ticket_updated']) => {
        console.log('WebSocketService: Ticket atualizado:', data);
        window.dispatchEvent(new CustomEvent('ticketUpdated', { detail: data }));
      });

    } catch (error) {
      console.error('WebSocketService: Erro ao inicializar WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('WebSocketService: Número máximo de tentativas de reconexão atingido');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(`WebSocketService: Tentando reconectar em ${delay}ms (tentativa ${this.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  disconnect() {
    if (this.socket) {
      console.log('WebSocketService: Desconectando...');
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.reconnectAttempts = 0;
  }

  sendMessage(message: TicketMessage) {
    if (!this.socket?.connected) {
      console.error('WebSocketService: Não está conectado');
      return false;
    }

    try {
      this.socket.emit('send_message', message);
      return true;
    } catch (error) {
      console.error('WebSocketService: Erro ao enviar mensagem:', error);
      return false;
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

// Exportar instância única
export const websocketService = new WebSocketService(); 