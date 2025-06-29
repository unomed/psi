
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
  sentAt?: Date | null;
  completedAt?: Date | null;
  linkUrl?: string;
  link_url?: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  createdAt?: string;                     // ✅ Manter para compatibilidade
  
  // ✅ ADICIONAR - propriedades faltando:
  recurrenceType?: RecurrenceType;        // ✅ Compatibility field
  recurrence_type?: RecurrenceType;       // ✅ Usado no código
  phoneNumber?: string;                   // ✅ Usado no código
  employee_name?: string;                 // ✅ Usado no código
  nextScheduledDate?: Date | null;        // ✅ Compatibility
  next_scheduled_date?: string | null;    // ✅ Database field
  dueDate?: string;                       // ✅ Compatibility
  due_date?: string;                      // ✅ Database field
  isRecurring?: boolean;                  // ✅ Compatibility
  is_recurring?: boolean;                 // ✅ Database field
  recurrencePattern?: string;             // ✅ Compatibility
  recurrence_pattern?: string;            // ✅ Database field
  portalToken?: string;                   // ✅ Compatibility
  portal_token?: string;                  // ✅ Database field
  companyId?: string;                     // ✅ Compatibility
  updatedAt?: string;                     // ✅ Compatibility
  
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
  type?: string;
  created_at?: string;
  updated_at?: string;
  variables?: any;
}

// Alias types for compatibility
export type { RecurrenceType, AssessmentStatus };
