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
          <h1 className="text-2xl font-bold text-center">🎉 Inauguração Omni!</h1>
          <p className="text-center text-gray-500 mt-2">
            Estamos chegando! Nossa plataforma será inaugurada em
          </p>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mt-2 mb-2">10 de Julho</p>
            <p className="text-sm text-gray-600">
              Acompanhe todas as novidades no nosso Instagram
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-700">
            Não perca nenhuma atualização sobre o lançamento!
          </p>
          <div className="flex justify-center">
            <Link
              href="https://www.instagram.com/vertifybr/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 font-semibold"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Seguir @vertifybr
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 