import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que não precisam de autenticação
const publicPaths = [
  '/',
  '/sign-in',
  '/sign-up',
  '/api/auth/login',
  '/api/auth/sign-up'
]

// Rotas que precisam de autenticação
const privatePaths = [
  '/dashboard',
  '/api/chat',
  '/api/auth/me'
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const path = request.nextUrl.pathname

  // Verifica se a rota atual é pública
  // const isPublicPath = publicPaths.some(publicPath => path.startsWith(publicPath))
  // Verifica se a rota atual é privada
  const isPrivatePath = privatePaths.some(privatePath => path.startsWith(privatePath))

  // Redireciona usuários autenticados tentando acessar páginas públicas para o dashboard
  // if (token && isPublicPath && path !== '/') {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  // Redireciona usuários não autenticados tentando acessar páginas privadas para o login
  if (!token && isPrivatePath) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [...publicPaths, ...privatePaths]
} 