import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

const createTeamSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  users: z.array(z.number()).min(1, "Selecione pelo menos um usuário"),
});

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const companyId = cookieStore.get('company_id')?.value;

    if (!token || !companyId) {
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

    const response = await fetch(`${apiUrl}/areas`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro da API:', data);
      return NextResponse.json(
        { 
          message: data.message || 'Erro ao listar equipes',
          errors: data.errors 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao listar equipes:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Criando equipe');
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const companyId = cookieStore.get('company_id')?.value;

    if (!token || !companyId) {
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

    const body = await request.json();
    const validationResult = createTeamSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Dados inválidos',
          errors: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${apiUrl}/areas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...validationResult.data,
        companyId: parseInt(companyId),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro da API:', data);
      return NextResponse.json(
        { 
          message: data.message || 'Erro ao criar equipe',
          errors: data.errors 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar equipe:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 