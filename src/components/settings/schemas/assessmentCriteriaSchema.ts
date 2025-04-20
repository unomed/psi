
import { z } from "zod";

export const assessmentCriteriaSchema = z.object({
  // Periodicidade
  default_recurrence_type: z.enum(["none", "monthly", "semiannual", "annual"]).default("annual"),
  enable_recurrence_reminders: z.boolean().default(true),
  days_before_reminder_sent: z.number().min(1).max(90).default(15),
  
  // Critérios de amostragem
  minimum_employee_percentage: z.number().min(1).max(100).default(30),
  require_all_sectors: z.boolean().default(false),
  require_all_roles: z.boolean().default(false),
  prioritize_high_risk_roles: z.boolean().default(true),
  
  // Níveis de risco
  low_risk_threshold: z.number().min(0).max(100).default(30),
  medium_risk_threshold: z.number().min(0).max(100).default(60),
  // Alto risco é tudo acima do médio risco
  
  // Classificação nos relatórios
  sector_risk_calculation_type: z.enum(["average", "highest", "weighted"]).default("weighted"),
  company_risk_calculation_type: z.enum(["average", "highest", "weighted"]).default("weighted"),
  
  // Governança
  require_reassessment_for_high_risk: z.boolean().default(true),
  reassessment_max_days: z.number().min(1).max(365).default(90),
  notify_managers_on_high_risk: z.boolean().default(true),
});

export type AssessmentCriteriaFormValues = z.infer<typeof assessmentCriteriaSchema>;
