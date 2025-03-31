import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  response: Response,
  { params }: { params: { companyId: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const { companyId } = params;

    if (!token) {
      return NextResponse.json(
        { message: 'Não autorizado' },
        { status: 401 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_URL não está configurada');
      return NextResponse.json(
        { message: 'Configuração do servidor incorreta' },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiUrl}/users/companies/${companyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro da API:', data);
      return NextResponse.json(
        { 
          message: data.message || 'Erro ao listar usuários',
          errors: data.errors 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 