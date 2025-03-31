import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
  role: z.enum(["supervisor", "user"], {
    required_error: "Tipo de usuário é obrigatório",
  }),
});

export async function POST(
  request: NextRequest,
  response: NextResponse,
  { params }: { params: { companyId: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const { companyId } = await params;

    if (!token) {
      return NextResponse.json(
        { message: 'Não autorizado' },
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
      company_id: companyId,
    };

    console.log('Dados para enviar para a API:', JSON.stringify(userData, null, 2));

    // Faz a requisição para a API
    const response = await fetch(`${apiUrl}/users/companies/${companyId}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    console.log('Resposta da API:', JSON.stringify(data, null, 2));

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