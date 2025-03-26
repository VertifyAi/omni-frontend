import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface WhatsAppTutorialProps {
  onBack: () => void;
  onConnect: () => void;
  isConnecting?: boolean;
}

export function WhatsAppTutorial({ onBack, onConnect, isConnecting = false }: WhatsAppTutorialProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Como conectar o WhatsApp</h2>
        <Button variant="ghost" onClick={onBack}>
          Voltar
        </Button>
      </div>

      <div className="aspect-video w-full mb-6">
        <iframe
          className="w-full h-full rounded-lg"
          src="https://www.youtube.com/embed/seu-video-id"
          title="Tutorial WhatsApp"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold">Passo a passo</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Faça login com sua conta do Facebook</li>
          <li>Selecione a página do Facebook que deseja conectar</li>
          <li>Configure seu número do WhatsApp Business</li>
          <li>Siga as instruções na tela para finalizar a conexão</li>
        </ol>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800">
            <strong>Importante:</strong> Certifique-se de que você está usando uma conta do WhatsApp Business
            e que ela não está conectada a nenhum outro serviço.
          </p>
        </div>
      </div>

      <Button 
        onClick={onConnect} 
        className="w-full"
        disabled={isConnecting}
      >
        {isConnecting ? "Conectando..." : "Conectar WhatsApp"}
      </Button>
    </Card>
  );
}
