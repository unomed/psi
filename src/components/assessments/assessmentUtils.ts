
import { RecurrenceType } from "@/types";

export const getRecurrenceLabel = (recurrence: RecurrenceType): string => {
  const labels: Record<RecurrenceType, string> = {
    none: 'Sem recorrência',
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
    quarterly: 'Trimestral',
    yearly: 'Anual',
    semiannual: 'Semestral',
    annual: 'Anual'
  };
  
  return labels[recurrence] || 'Não definido';
};

export const getNextRecurrenceDate = (baseDate: Date, recurrence: RecurrenceType): Date | null => {
  const date = new Date(baseDate);
  
  switch (recurrence) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      return date;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      return date;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      return date;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      return date;
    case 'semiannual':
      date.setMonth(date.getMonth() + 6);
      return date;
    case 'yearly':
    case 'annual':
      date.setFullYear(date.getFullYear() + 1);
      return date;
    case 'none':
    default:
      return null;
  }
};

export const isValidRecurrenceType = (type: string): type is RecurrenceType => {
  return ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'none', 'semiannual', 'annual'].includes(type);
};
