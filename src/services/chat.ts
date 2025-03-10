import { Message } from '@/types/chat';

export const chatService = {
  async sendMessage(message: Message) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar mensagem');
    }

    return response.json();
  },

  async getMessages() {
    const response = await fetch('/api/chat');
    
    if (!response.ok) {
      throw new Error('Erro ao buscar mensagens');
    }

    return response.json();
  }
}; 