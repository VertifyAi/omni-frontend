import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const path = request.nextUrl.pathname

  // Apenas rotas do dashboard precisam de autenticação
  const isPrivatePath = path.startsWith('/dashboard')

  // Redireciona usuários não autenticados tentando acessar páginas privadas para o login
  if (!token && isPrivatePath) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ]
} 