
/**
 * Utility functions for date formatting
 */

/**
 * Formats a date string or Date object to the Brazilian format (dd/mm/yyyy)
 * @param dateValue - Date to format (string or Date object)
 * @returns Formatted date string
 */
export const formatDate = (dateValue: string | Date | undefined): string => {
  if (!dateValue) return '-';
  
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Formats a date with time in Brazilian format (dd/mm/yyyy hh:mm)
 * @param dateValue - Date to format (string or Date object)
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateValue: string | Date | undefined): string => {
  if (!dateValue) return '-';
  
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date with time:', error);
    return '-';
  }
};
