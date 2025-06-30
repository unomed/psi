
import { RecurrenceType } from "@/types";

export const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  none: "Sem recorrência",
  daily: "Diário", 
  weekly: "Semanal",
  monthly: "Mensal",
  quarterly: "Trimestral",
  yearly: "Anual",
  semiannual: "Semestral",
  annual: "Anual"
};

export const getRecurrenceLabel = (recurrence: RecurrenceType): string => {
  return RECURRENCE_LABELS[recurrence] || "Desconhecido";
};

export const calculateNextAssessmentDate = (
  currentDate: Date,
  recurrenceType: RecurrenceType
): Date | null => {
  if (recurrenceType === "none") return null;

  const nextDate = new Date(currentDate);

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
    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      return null;
  }

  return nextDate;
};
