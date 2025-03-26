import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    console.log('Headers recebidos:', Object.fromEntries(headersList.entries()));
    
    const token = headersList.get('authorization')?.replace('Bearer ', '') || '';
    console.log('Token extraído:', token);

    if (!token) {
      return NextResponse.json(
        { message: 'Token não fornecido' },
        { status: 401 }
      );
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`;
    console.log('Fazendo requisição para:', apiUrl);

    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Status da resposta:', apiResponse.status);
    const data = await apiResponse.json();
    console.log('Dados recebidos:', data);

    if (!apiResponse.ok) {
      return NextResponse.json(
        { message: data.message || 'Não autorizado' },
        { status: apiResponse.status }
      );
    }

    // Criar a resposta com os dados do usuário e o cookie company_id
    return NextResponse.json(data, {
      headers: {
        'Set-Cookie': `company_id=${data.company_id.toString()}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`
      }
    });
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 