import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  role: z.enum(["ADMIN", "SUPERVISOR", "USER"], {
    required_error: "Tipo de usuário é obrigatório",
  }),
});

export async function POST(request: Request) {
  try {
    // Obtém o company_id do cookie
    const cookieStore = await cookies();
    const companyId = cookieStore.get('company_id');

    if (!companyId) {
      return NextResponse.json(
        { message: 'Company ID não encontrado' },
        { status: 401 }
      );
    }

    // Verifica se a URL da API está configurada
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_URL não está configurada');
      return NextResponse.json(
        { message: 'Configuração do servidor incorreta' },
        { status: 500 }
      );
    }

    // Parse e valida o corpo da requisição
    const body = await request.json();
    const validationResult = createUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Dados inválidos',
          errors: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    // Prepara os dados para enviar para a API
    const userData = {
      ...validationResult.data,
      company_id: companyId.value,
    };

    console.log('Dados para enviar para a API:', JSON.stringify(userData, null, 2));

    // Faz a requisição para a API
    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    // Trata erros da API
    if (!response.ok) {
      console.error('Erro da API:', data);
      return NextResponse.json(
        { 
          message: data.message || 'Erro ao criar usuário',
          errors: data.errors 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Obtém o company_id do cookie
    const cookieStore = await cookies();
    const companyId = cookieStore.get('company_id');

    if (!companyId) {
      return NextResponse.json(
        { message: 'Company ID não encontrado' },
        { status: 401 }
      );
    }

    // Verifica se a URL da API está configurada
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_URL não está configurada');
      return NextResponse.json(
        { message: 'Configuração do servidor incorreta' },
        { status: 500 }
      );
    }

    // Parse e valida o corpo da requisição
    const body = await request.json();
    const validationResult = createUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Dados inválidos',
          errors: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    // Prepara os dados para enviar para a API
    const userData = {
      ...validationResult.data,
      company_id: companyId.value,
    };

    console.log('Dados para enviar para a API:', JSON.stringify(userData, null, 2));

    // Faz a requisição para a API
    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    // Trata erros da API
    if (!response.ok) {
      console.error('Erro da API:', data);
      return NextResponse.json(
        { 
          message: data.message || 'Erro ao criar usuário',
          errors: data.errors 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 