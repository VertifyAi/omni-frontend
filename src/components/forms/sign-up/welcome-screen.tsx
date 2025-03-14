import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export function WelcomeScreen() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center mb-6">
          <img 
            src="https://vertify-public-assets.s3.us-east-2.amazonaws.com/logos/Design+sem+nome.png" 
            alt="Vera Avatar" 
            className="w-24 h-24 rounded-full"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <h1 className="text-2xl font-bold">Olá, bem-vindo à Vertify!</h1>
        
        <div className="flex items-center justify-center gap-2 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">Seu cadastro foi concluído com sucesso!</span>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg">
          <p className="mb-4">
            Eu sou a Vera, sua assistente virtual! Vou te ajudar a navegar pela plataforma
            e aproveitar ao máximo todas as ferramentas que preparamos para você.
          </p>
          <p>
            Se precisar de algo, estarei por aqui para te guiar!
          </p>
        </div>

        <div className="flex justify-center gap-4 text-sm">
          <Link href="/tutorial" className="text-blue-600 hover:underline flex items-center gap-1">
            🔗 Veja um tutorial rápido
          </Link>
          <span>|</span>
          <Link href="/suporte" className="text-blue-600 hover:underline flex items-center gap-1">
            📞 Fale com o suporte
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-sm text-slate-600 mb-4">
            Agora é só acessar seu painel e começar
          </p>
          <Link href="/dashboard">
            <Button className="w-full md:w-auto">
              Acessar Painel
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 