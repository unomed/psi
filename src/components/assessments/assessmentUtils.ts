
import { RecurrenceType } from "@/types";

export const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  none: "Sem recorrência",
  daily: "Diário",
  weekly: "Semanal",
  monthly: "Mensal",
  quarterly: "Trimestral",
  semiannual: "Semestral",
  annual: "Anual"
};

export const STATUS_LABELS = {
  scheduled: "Agendada",
  sent: "Enviada",
  completed: "Concluída",
  pending: "Pendente"
};

export const STATUS_COLORS = {
  scheduled: "bg-blue-100 text-blue-800",
  sent: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  pending: "bg-gray-100 text-gray-800"
};

export const calculateNextRecurrence = (date: Date, recurrenceType: RecurrenceType): Date => {
  const nextDate = new Date(date);
  
  switch (recurrenceType) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "quarterly":
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case "semiannual":
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case "annual":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case "none":
    default:
      return nextDate; // No recurrence
  }
  
  return nextDate;
};

export const generateAssessmentLink = (templateId: string, employeeId?: string): string => {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const base = employeeId ? `/assessment/${templateId}/${employeeId}` : `/assessment/${templateId}`;
  return `${base}?token=${token}`;
};
