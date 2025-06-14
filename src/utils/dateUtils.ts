
import { isValid, parseISO, format, startOfDay } from 'date-fns';

/**
 * Valida se uma data é válida
 */
export function isValidDate(date: Date | string | null | undefined): boolean {
  if (!date) return false;
  
  if (typeof date === 'string') {
    try {
      const parsed = parseISO(date);
      return isValid(parsed);
    } catch {
      return false;
    }
  }
  
  return isValid(date);
}

/**
 * Cria uma data segura removendo timezone issues
 */
export function createSafeDate(date: Date | string): Date {
  if (typeof date === 'string') {
    return startOfDay(parseISO(date));
  }
  return startOfDay(date);
}

/**
 * Valida uma data para agendamento de avaliação
 */
export function validateAssessmentDate(date: Date | undefined): string | null {
  if (!date) {
    return "Selecione uma data para a avaliação";
  }

  if (!isValidDate(date)) {
    return "A data selecionada é inválida";
  }

  const today = startOfDay(new Date());
  const selectedDate = startOfDay(date);
  
  if (selectedDate < today) {
    return "A data não pode ser anterior à data atual";
  }

  // Verificar se a data não é muito longe no futuro (1 ano)
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
  if (selectedDate > startOfDay(oneYearFromNow)) {
    return "A data não pode ser mais de 1 ano no futuro";
  }

  return null;
}

/**
 * Formata uma data para exibição no formato brasileiro
 */
export function formatDateBR(date: Date | string): string {
  if (!isValidDate(date)) {
    return "Data inválida";
  }

  const safeDate = typeof date === 'string' ? parseISO(date) : date;
  return format(safeDate, 'dd/MM/yyyy');
}

/**
 * Formata uma data para exibição com hora no formato brasileiro
 */
export function formatDateTimeBR(date: Date | string): string {
  if (!isValidDate(date)) {
    return "Data inválida";
  }

  const safeDate = typeof date === 'string' ? parseISO(date) : date;
  return format(safeDate, 'dd/MM/yyyy HH:mm');
}

/**
 * Formata uma data para exibição (alias para formatDateBR)
 */
export function formatDateForDisplay(date: Date | string): string {
  return formatDateBR(date);
}

/**
 * Analisa uma string de data no formato DD/MM/YYYY
 */
export function parseDateString(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  // Remove espaços e verifica formato básico
  const cleanString = dateString.trim();
  
  // Verifica se está no formato DD/MM/YYYY
  const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = cleanString.match(dateRegex);
  
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  
  // Converte para números
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  // Validações básicas
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > 2100) {
    return null;
  }
  
  // Cria a data (mês é 0-indexed em JavaScript)
  const date = new Date(yearNum, monthNum - 1, dayNum);
  
  // Verifica se a data é válida (JavaScript ajusta datas inválidas)
  if (date.getFullYear() !== yearNum || 
      date.getMonth() !== monthNum - 1 || 
      date.getDate() !== dayNum) {
    return null;
  }
  
  return date;
}

/**
 * Calcula a diferença em dias entre duas datas
 */
export function daysDifference(date1: Date | string, date2: Date | string): number {
  if (!isValidDate(date1) || !isValidDate(date2)) {
    return 0;
  }

  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Adiciona dias a uma data
 */
export function addDays(date: Date | string, days: number): Date {
  const baseDate = typeof date === 'string' ? parseISO(date) : new Date(date);
  const result = new Date(baseDate);
  result.setDate(result.getDate() + days);
  return result;
}
