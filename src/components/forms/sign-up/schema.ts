import { z } from "zod";

export const addressSchema = z.object({
  streetName: z.string().min(1, "Rua é obrigatória"),
  streetNumber: z.string().min(1, "Número é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 letras"),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
  country: z.string().min(1, "País é obrigatório"),
  complement: z.string().optional(),
});

export const companySchema = z.object({
  name: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido"),
  phone: z.string().min(11, "Telefone deve ter no mínimo 11 dígitos"),
  address: addressSchema,
});

export const signUpSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
  passwordConfirmation: z.string(),
  phone: z.string().min(1, "Telefone é obrigatório"),
  address: addressSchema,
  company: companySchema,
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "As senhas não coincidem",
  path: ["passwordConfirmation"],
});

export const steps = [
  {
    title: "Informações Pessoais",
    description: "Insira seus dados pessoais",
  },
  {
    title: "Endereço",
    description: "Insira seu endereço residencial",
  },
  {
    title: "Dados da Empresa",
    description: "Insira os dados básicos da empresa",
  },
  {
    title: "Endereço da Empresa",
    description: "Insira o endereço da empresa",
  },
] as const;

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type CompanyData = z.infer<typeof companySchema>; 