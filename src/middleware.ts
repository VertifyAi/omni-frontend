import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const isAuthPage = request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up'

  // Redireciona usuários autenticados tentando acessar a página de login para o dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redireciona usuários não autenticados tentando acessar páginas privadas para o login
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Aplica o middleware apenas nas rotas que precisamos verificar
  matcher: ['/sign-in', '/sign-up', '/dashboard/:path*']
} 