
import { useState, useCallback } from 'react';
import { isValidDate, createSafeDate } from '@/utils/dateUtils';
import { toast } from 'sonner';

export function useDateHandling(initialDate?: Date) {
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(initialDate);
  const [dateError, setDateError] = useState<boolean>(false);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    console.log("Date handling: Selected date:", date,
      date instanceof Date ? `Timestamp: ${date.getTime()}` : "");
    
    if (date && isValidDate(date)) {
      const safeDate = createSafeDate(date);
      console.log("Date handling: Created safe date:", safeDate);
      setScheduledDate(safeDate);
      setDateError(false);
    } else {
      setScheduledDate(undefined);
      setDateError(!date); // Only show error if date is undefined/null
    }
  }, []);

  const validateDate = useCallback(() => {
    if (!scheduledDate) {
      setDateError(true);
      toast.error("Selecione uma data para a avaliação");
      return false;
    }

    if (!isValidDate(scheduledDate)) {
      setDateError(true);
      toast.error("A data selecionada é inválida");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (scheduledDate < today) {
      setDateError(true);
      toast.error("A data não pode ser anterior à data atual");
      return false;
    }

    return true;
  }, [scheduledDate]);

  return {
    scheduledDate,
    dateError,
    handleDateSelect,
    validateDate,
    setDateError
  };
}

