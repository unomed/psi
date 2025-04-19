
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { createSafeDate, isValidDate } from "@/utils/dateUtils";

interface AssessmentDateSectionProps {
  scheduledDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  dateError: boolean;
  errorMessage?: string;
}

export function AssessmentDateSection({
  scheduledDate,
  onDateSelect,
  dateError,
  errorMessage = "Selecione uma data para a avaliação."
}: AssessmentDateSectionProps) {
  useEffect(() => {
    console.log("Estado atual da data:", scheduledDate, 
      isValidDate(scheduledDate) ? "É uma data válida" : "Não é uma data válida",
      scheduledDate instanceof Date ? `Timestamp: ${scheduledDate.getTime()}` : "");
  }, [scheduledDate]);

  const formatDateForDisplay = (date: Date | undefined): string => {
    if (!date || !isValidDate(date)) {
      return 'Data não selecionada';
    }
    return date.toLocaleDateString('pt-BR');
  };

  const handleDateChange = (date: Date | undefined) => {
    // Using our new utility functions
    if (date && isValidDate(date)) {
      const safeDate = createSafeDate(date);
      console.log("Nova data válida selecionada:", safeDate, "Timestamp:", safeDate.getTime());
      onDateSelect(safeDate);
    } else {
      console.log("Data inválida ou undefined detectada");
      onDateSelect(undefined);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="scheduledDate" className={dateError ? "text-red-500" : ""}>
        Data da Avaliação {dateError && <span className="text-red-500">*</span>}
      </Label>
      <DatePicker 
        date={scheduledDate} 
        onSelect={handleDateChange} 
        disabled={(date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today;
        }} 
        allowInput={true}
      />
      {dateError && (
        <p className="text-xs text-red-500">
          {errorMessage}
        </p>
      )}
      
      {scheduledDate && !dateError && (
        <p className="text-xs text-muted-foreground">
          Data selecionada: {formatDateForDisplay(scheduledDate)}
        </p>
      )}
      {!scheduledDate && !dateError && (
        <p className="text-xs text-muted-foreground">
          Selecione a data em que a avaliação será realizada.
        </p>
      )}
    </div>
  );
}
