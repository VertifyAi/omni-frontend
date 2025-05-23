import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que precisam de autenticação
const privatePaths = [
  '/dashboard',
  '/dashboard/:path*',
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const path = request.nextUrl.pathname

  // Verifica se a rota atual é privada
  const isPrivatePath = privatePaths.some(privatePath => path.startsWith(privatePath))

  // Redireciona usuários não autenticados tentando acessar páginas privadas para o login
  if (!token && isPrivatePath) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/auth/login',
    '/api/auth/sign-up',
    '/dashboard',
    '/teams',
    '/teams/:path*',
    '/dashboard/:path*',
    '/whatsapp/onboarding',
    '/settings/:path*',
    '/api/chat/:path*',
    '/api/auth/me',
    '/api/integrations/:path*',
  ]
} 