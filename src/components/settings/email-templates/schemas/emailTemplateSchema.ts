
import { z } from "zod";

export const emailTemplateCreateSchema = z.object({
  name: z.string().min(1, "O tipo de modelo é obrigatório"),
  subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres"),
  body: z.string().min(20, "O conteúdo deve ter pelo menos 20 caracteres"),
  description: z.string().optional()
});

export const emailTemplateEditSchema = z.object({
  subject: z.string().min(5, "O assunto deve ter pelo menos 5 caracteres"),
  body: z.string().min(20, "O conteúdo deve ter pelo menos 20 caracteres")
});

export type EmailTemplateCreateValues = z.infer<typeof emailTemplateCreateSchema>;
export type EmailTemplateEditValues = z.infer<typeof emailTemplateEditSchema>;
