import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z
    .string()
    .nonempty({
      message: "Campo obrigatório",
    })
    .email({
      message: "E-mail inválido",
    }),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(
      /[^A-Za-z0-9]/,
      "A senha deve conter pelo menos um caractere especial"
    ),
});

export const RecoverFormSchema = z.object({
  email: z
    .string()
    .nonempty({
      message: "Campo obrigatório",
    })
    .email({
      message: "E-mail inválido",
    }),
});

export const RecoverPasswordFormSchema = z.object({
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(
      /[^A-Za-z0-9]/,
      "A senha deve conter pelo menos um caractere especial"
    ),
  token: z
    .string()
    .nonempty({
      message: "Campo obrigatório",
    })
    .jwt({
      message: "Token inválido",
    }),
});

export interface SignInResponse {
  access_token: string;
}
