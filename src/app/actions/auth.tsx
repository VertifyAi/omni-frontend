"use server";

import { post } from "@/lib/fetch";
import { cookies } from "next/headers";

export async function signin(formData: { email: string, password: string }) {
  const payload = {
    email: formData.email,
    password: formData.password,
  }

  const result = await post("auth/sign-in", payload);

  if (result.response.status === 401) {
    return {
      message: "E-mail ou senha inválidos",
    };
  }

  const cookie = result.data.access_token;
  if (cookie) {
    const cookieStore = await cookies();
    cookieStore.set({
      name: "vertify-auth",
      value: cookie,
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours
    });

    return {
      message: "Login efetuado com sucesso",
    };
  } else {
    return {
      message: "Erro ao efetuar login",
    };
  }
}
