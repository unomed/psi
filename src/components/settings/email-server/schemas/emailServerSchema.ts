
import { z } from "zod";

export const emailServerSchema = z.object({
  smtpServer: z.string().min(1, "O servidor SMTP é obrigatório"),
  smtpPort: z.string().regex(/^\d+$/, "A porta deve ser um número"),
  username: z.string().min(1, "O usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
  senderEmail: z.string().email("Email inválido"),
  senderName: z.string().min(1, "O nome do remetente é obrigatório"),
});

export type EmailServerFormValues = z.infer<typeof emailServerSchema>;
