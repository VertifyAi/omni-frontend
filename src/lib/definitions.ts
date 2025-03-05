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
  password: z.string().nonempty({
    message: "Campo obrigatório",
  }),
});

export interface SignInResponse {
  access_token: string;
}