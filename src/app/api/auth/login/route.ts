import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Verificar se a resposta é JSON antes de tentar fazer o parse
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Resposta não é JSON:', contentType);
      return NextResponse.json(
        { message: 'Erro na comunicação com o servidor' },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Credenciais inválidas' },
        { status: response.status }
      );
    }

    // Criar a resposta com os dados do usuário
    const nextResponse = NextResponse.json(data);

    // Adicionar o cookie auth_token
    nextResponse.cookies.set('auth_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 50, // 50 minutos
    });

    // Adicionar o cookie company_id
    if (data.content?.companyId) {
      nextResponse.cookies.set('company_id', data.content.companyId.toString(), {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 50, // 50 minutos
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 