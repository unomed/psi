
import * as z from 'zod';

export const actionPlanSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  company_id: z.string().optional(),
  sector_id: z.string().optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  risk_level: z.enum(['low', 'medium', 'high']).optional(),
  budget_allocated: z.number().optional(),
});

export type ActionPlanFormData = z.infer<typeof actionPlanSchema>;
