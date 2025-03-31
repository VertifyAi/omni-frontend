import { NextResponse } from "next/server";
import { z } from "zod";

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const body = await request.json();
    const validationResult = signUpSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Dados inválidos",
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Prepara os dados para enviar para a API
    const userData = validationResult.data;

    const response = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    // Trata erros da API
    if (!response.ok) {
      console.error("Erro da API:", data);
      return NextResponse.json(
        {
          message: data.message || "Erro ao criar conta",
          errors: data.errors,
        },
        { status: response.status }
      );
    }

    const loginResponse = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      return NextResponse.json(
        { message: loginData.message || "Credenciais inválidas" },
        { status: response.status }
      );
    }

    // Criar a resposta com os dados do usuário
    const nextResponse = NextResponse.json(loginData);

    nextResponse.cookies.set("auth_token", loginData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 50, // 50 minutos
    });

    if (loginData.content?.companyId) {
      nextResponse.cookies.set(
        "company_id",
        loginData.content.companyId.toString(),
        {
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 50, // 50 minutos
        }
      );
    }

    return nextResponse;
  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
