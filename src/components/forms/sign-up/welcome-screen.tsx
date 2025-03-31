import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-6">
            <Image
              src="https://vertify-public-assets.s3.us-east-2.amazonaws.com/logos/Design+sem+nome.png"
              alt="Vera Avatar"
              width={96}
              height={96}
              className="rounded-full"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-center">Bem-vindo à Omni!</h1>
          <p className="text-center text-gray-500 mt-2">
            Estamos felizes em ter você conosco. Vamos começar?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Para continuar, clique no botão abaixo:
          </p>
          <div className="flex justify-center">
            <Link
              href="/settings/integrations"
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Começar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 