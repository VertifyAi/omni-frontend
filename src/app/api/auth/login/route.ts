import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Dados recebidos:', body);

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
    console.log('Fazendo requisição para:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Status da resposta:', response.status);
    console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));

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
    console.log('Dados da resposta:', data);

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
      maxAge: 60 * 60 * 24 * 7 // 7 dias
    });

    // Adicionar o cookie company_id
    if (data.content?.companyId) {
      nextResponse.cookies.set('company_id', data.content.companyId.toString(), {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
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