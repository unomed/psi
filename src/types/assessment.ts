
import { AssessmentStatus, RecurrenceType } from './enums';

export interface ScheduledAssessment {
  id: string;
  employeeId: string;                     // ✅ Manter para compatibilidade
  employee_id: string;                    // ✅ Nome correto do banco
  templateId: string;                     // ✅ Manter para compatibilidade  
  template_id: string;                    // ✅ Nome correto do banco
  scheduledDate: Date | string;           // ✅ Manter para compatibilidade
  scheduled_date: string;                 // ✅ Nome correto do banco
  status: AssessmentStatus;
  sentAt?: Date | string | null;          // ✅ Flexibilidade Date/string
  completedAt?: Date | string | null;     // ✅ Flexibilidade Date/string
  linkUrl?: string;
  link_url?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  createdAt?: string;                     // ✅ Manter para compatibilidade
  
  // ✅ ADICIONAR - propriedades faltando com AMBAS as convenções:
  recurrenceType?: RecurrenceType;        // ✅ camelCase - Compatibility field
  recurrence_type?: RecurrenceType;       // ✅ snake_case - Usado no código
  phoneNumber?: string;                   // ✅ camelCase - Usado no código
  employee_name?: string;                 // ✅ snake_case - Usado no código
  nextScheduledDate?: Date | string | null; // ✅ camelCase - Compatibility
  next_scheduled_date?: string | null;    // ✅ snake_case - Database field
  dueDate?: string;                       // ✅ camelCase - Compatibility
  due_date?: string;                      // ✅ snake_case - Database field
  isRecurring?: boolean;                  // ✅ camelCase - Compatibility
  is_recurring?: boolean;                 // ✅ snake_case - Database field
  recurrencePattern?: string;             // ✅ camelCase - Compatibility
  recurrence_pattern?: string;            // ✅ snake_case - Database field
  portalToken?: string;                   // ✅ camelCase - Compatibility
  portal_token?: string;                  // ✅ snake_case - Database field
  companyId?: string;                     // ✅ camelCase - Compatibility
  updatedAt?: string;                     // ✅ camelCase - Compatibility
  
  // ✅ ADICIONAR campos específicos para resolução de erros:
  checklist_template_id?: string;         // ✅ Para compatibilidade com código existente
  employee_ids?: string[];                // ✅ Para compatibilidade com código existente
  
  // ✅ Relacionamentos opcionais:
  employees?: {
    name: string;
    email: string;
    phone: string;
  } | null;
  checklist_templates?: {
    title: string;
  } | null;
}

// ✅ ADICIONAR - interface faltando:
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  description?: string;
  type?: string;                          // ✅ Permitir qualquer string
  created_at?: string;
  updated_at?: string;
  variables?: any;
}

// Alias types for compatibility
export type { RecurrenceType, AssessmentStatus };
