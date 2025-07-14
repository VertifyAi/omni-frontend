import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
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
          <h1 className="text-3xl font-bold text-center">
            🎉 Bem-vindo à Omni!
          </h1>
          <p className="text-center text-gray-600 mt-4 text-lg">
            Estamos muito felizes em tê-lo aqui. Descubra tudo o que nossa
            plataforma pode oferecer!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              Conheça a Omni em ação
            </h2>
            <div className="aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Vídeo Introdutório da Omni"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div> */}

          <div className="text-center">
            <p className="text-gray-700 mb-6">
              Pronto para começar? Acesse seu dashboard e explore todas as
              funcionalidades!
            </p>
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 inline-flex items-center gap-2 font-semibold text-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Acessar Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
