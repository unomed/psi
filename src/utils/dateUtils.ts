/**
 * Utilities for date handling and validation
 */

/**
 * Checks if the provided value is a valid Date object
 */
export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Creates a new Date instance with time set to 00:00:00
 * This helps avoid reference issues and ensures consistent date handling
 */
export const createSafeDate = (date: Date): Date => {
  const safeDate = new Date(date.getTime());
  safeDate.setHours(0, 0, 0, 0);
  return safeDate;
};

/**
 * Parses a date string in DD/MM/YYYY format
 * Returns undefined if the format is invalid
 */
export const parseDateString = (dateString: string): Date | undefined => {
  if (dateString.trim() === '') {
    return undefined;
  }
  
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    return undefined;
  }
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in Date
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return undefined;
  }
  
  const parsedDate = new Date(year, month, day);
  
  // Validate that the parsed date matches the input
  // This catches invalid dates like 31/02/2025
  if (
    parsedDate.getDate() !== day || 
    parsedDate.getMonth() !== month || 
    parsedDate.getFullYear() !== year
  ) {
    return undefined;
  }
  
  parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};

/**
 * Validates a date against a disabled dates function
 */
export const isDateEnabled = (
  date: Date | undefined, 
  disabledFn?: (date: Date) => boolean
): boolean => {
  if (!date || !isValidDate(date)) {
    return false;
  }
  
  if (disabledFn && disabledFn(date)) {
    return false;
  }
  
  return true;
};

/**
 * Complete validation for assessment dates
 * Returns validation errors or null if valid
 */
export const validateAssessmentDate = (date: Date | undefined): string | null => {
  if (!date) {
    return "Selecione uma data para a avaliação.";
  }
  
  if (!isValidDate(date)) {
    return "A data selecionada é inválida.";
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) {
    return "A data não pode ser anterior à data atual.";
  }
  
  return null;
};

/**
 * Format a date object for display using the pt-BR locale
 */
export const formatDateForDisplay = (date: Date | undefined): string => {
  if (!date || !isValidDate(date)) {
    return 'Data não selecionada';
  }
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
