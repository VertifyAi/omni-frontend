import { io, Socket } from 'socket.io-client';
import { Message } from '@/types/chat';

class WebSocketService {
  private socket: Socket | null = null;
  private url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3001';

  connect() {
    if (!this.socket) {
      this.socket = io(this.url, {
        transports: ['websocket'],
        autoConnect: true,
      });
      
      this.socket.on('connect', () => {
        console.log('Socket.IO conectado');
      });

      this.socket.on('newMessage', (data) => {
        console.log('Mensagem recebida:', data);
        const customEvent = new CustomEvent('newMessage', { detail: data });
        window.dispatchEvent(customEvent);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Erro na conexão Socket.IO:', error);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket.IO desconectado');
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: Message) {
    if (this.socket?.connected) {
      this.socket.emit('message', message);
    } else {
      console.error('Socket.IO não está conectado');
    }
  }
}

export const websocketService = new WebSocketService(); 