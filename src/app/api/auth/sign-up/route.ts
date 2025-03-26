import { NextResponse } from 'next/server';
import { z } from 'zod';

const signUpSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  passwordConfirmation: z.string().min(1, "Confirmação de senha é obrigatória"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  address: z.object({
    street: z.string().min(1, "Rua é obrigatória"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
    zip_code: z.string().min(1, "CEP é obrigatório"),
    country: z.string().min(1, "País é obrigatório"),
    complement: z.string().optional(),
  }),
  company: z.object({
    name: z.string().min(1, "Nome da empresa é obrigatório"),
    cnpj: z.string().min(14, "CNPJ inválido"),
    phone: z.string().min(1, "Telefone da empresa é obrigatório"),
    address: z.object({
      street: z.string().min(1, "Rua é obrigatória"),
      city: z.string().min(1, "Cidade é obrigatória"),
      state: z.string().min(1, "Estado é obrigatório"),
      zip_code: z.string().min(1, "CEP é obrigatório"),
      country: z.string().min(1, "País é obrigatório"),
      complement: z.string().optional(),
    }),
  }),
});

export async function POST(request: Request) {
  try {
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
    const validationResult = signUpSchema.safeParse(body);

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
    const userData = validationResult.data;

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
          message: data.message || 'Erro ao criar conta',
          errors: data.errors 
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 