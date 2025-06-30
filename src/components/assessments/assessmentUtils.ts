
import { RecurrenceType } from "@/types";

export const recurrenceLabels: Record<RecurrenceType, string> = {
  none: "Nenhuma",
  daily: "Diária",
  weekly: "Semanal", 
  monthly: "Mensal",
  quarterly: "Trimestral",
  semiannual: "Semestral",
  annual: "Anual",
  yearly: "Anual" // Adicionado para corrigir o erro
};

export function generateAssessmentLink(templateId: string, employeeId: string): string {
  const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  return `${window.location.origin}/avaliacao/${token}`;
}
