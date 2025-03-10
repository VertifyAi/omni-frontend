import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 letras"),
  zip_code: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
  country: z.string().min(1, "País é obrigatório"),
  complement: z.string().optional(),
});

export const companySchema = z.object({
  name: z.string().min(1, "Nome da empresa é obrigatório"),
  cnpj: z.string().length(14, "CNPJ deve ter 14 dígitos"),
  phone: z.string().min(11, "Telefone deve ter no mínimo 11 dígitos"),
  address: addressSchema,
});

export const signUpSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  phone: z.string().min(11, "Telefone deve ter no mínimo 11 dígitos"),
  address: addressSchema,
  companyChoice: z.enum(["create", "join"]).optional(),
  company: companySchema.optional(),
  areaId: z.number(),
  role: z.enum(["attendant", "admin"]),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type CompanyData = z.infer<typeof companySchema>;

export const steps = [
  { title: "Dados Pessoais", description: "Informações básicas" },
  { title: "Endereço", description: "Seu endereço completo" },
  { title: "Empresa", description: "Criar ou entrar em uma empresa" },
  { title: "Dados da Empresa", description: "Informações da nova empresa" },
  { title: "Função", description: "Sua função na empresa" },
]; 