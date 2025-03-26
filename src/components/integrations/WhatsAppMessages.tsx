import { useEffect, useState, useCallback } from 'react';
import { IntegrationsService } from '@/services/integrations';
import { WhatsAppMessage } from '@/types/integrations';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export function WhatsAppMessages() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadMessages = useCallback(async () => {
    try {
      const data = await IntegrationsService.getInstance().getWhatsAppMessages();
      setMessages(data);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSendMessage = async () => {
    if (!phone || !newMessage) {
      toast({
        title: 'Erro',
        description: 'Preencha o telefone e a mensagem',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await IntegrationsService.getInstance().sendWhatsAppMessage({
        phone,
        message: newMessage,
      });
      setNewMessage('');
      toast({
        title: 'Sucesso',
        description: 'Mensagem enviada com sucesso',
      });
      loadMessages();
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a mensagem',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.direction === 'outgoing' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.direction === 'outgoing'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Número do WhatsApp"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
          <Input
            placeholder="Digite sua mensagem"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleSendMessage} disabled={loading}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
} 