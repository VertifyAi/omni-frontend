import { z } from "zod";

export const createAgentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  tone: z.enum(["casual", "formal", "informal"]),
  objective: z.enum(["screening", "sales", "support"]),
  segment: z.enum(["technology", "finance", "health", "education", "other"]),
  description: z.string().min(1, "Descrição é obrigatória"),
  teams_to_redirect: z.array(z.number()).optional(),
  interaction_example: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
        reasoning: z.string(),
      })
    )
    .optional(),
  presentation_example: z
    .string()
    .min(1, "Exemplo de apresentação é obrigatório"),
  products_or_services_knowledge_base: z
    .array(
      z.object({
        name: z.string(),
        amount: z.number().optional(),
        description: z.string(),
        ctaType: z.string(),
        ctaLink: z.string(),
      })
    )
    .optional(),
});
