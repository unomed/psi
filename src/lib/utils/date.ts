
// ===== UTILITÁRIOS DE DATA =====

import { format, parseISO, addDays, addWeeks, addMonths, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RecurrenceType } from '@/types';

export const formatDate = (date: Date | string, pattern: string = 'dd/MM/yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, pattern, { locale: ptBR });
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatDateTimeComplete = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
};

export const calculateNextDate = (currentDate: Date, recurrence: RecurrenceType): Date | null => {
  if (recurrence === 'none') return null;
  
  switch (recurrence) {
    case 'daily':
      return addDays(currentDate, 1);
    case 'weekly':
      return addWeeks(currentDate, 1);
    case 'monthly':
      return addMonths(currentDate, 1);
    case 'quarterly':
      return addMonths(currentDate, 3);
    case 'yearly':
      return addMonths(currentDate, 12);
    default:
      return null;
  }
};

export const getRecurrenceLabel = (recurrence: RecurrenceType): string => {
  const labels = {
    none: 'Sem recorrência',
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
    quarterly: 'Trimestral',
    yearly: 'Anual'
  };
  
  return labels[recurrence] || 'Não definido';
};

export const isDateExpired = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;
  return dateObj < new Date();
};

export const getDaysUntilDate = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 0;
  
  const today = new Date();
  const diffTime = dateObj.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
