
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

interface AssessmentDateSectionProps {
  scheduledDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  dateError: boolean;
}

export function AssessmentDateSection({
  scheduledDate,
  onDateSelect,
  dateError
}: AssessmentDateSectionProps) {
  // Log para verificação de data
  useEffect(() => {
    console.log("Estado atual da data:", scheduledDate, 
      scheduledDate instanceof Date ? "É uma data válida" : "Não é uma data válida",
      scheduledDate instanceof Date && !isNaN(scheduledDate.getTime()) ? "Data válida" : "Data inválida",
      "Timestamp:", scheduledDate?.getTime?.());
  }, [scheduledDate]);

  // Helper para verificar se a data é válida
  const isValidDate = (date: any): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  const formatDateForDisplay = (date: Date | undefined): string => {
    if (!date || !isValidDate(date)) {
      return 'Data não selecionada';
    }
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    console.log("Data selecionada em AssessmentDateSection:", date, 
      date instanceof Date ? "É objeto Date" : "Não é objeto Date",
      date instanceof Date ? `Timestamp: ${date.getTime()}` : "");
    
    // Garantir que sempre passamos uma data válida ou undefined explícito
    if (date && isValidDate(date)) {
      // Criar uma nova instância de Date para evitar problemas de referência
      const newDate = new Date(date.getTime());
      console.log("Nova data criada:", newDate, "Timestamp:", newDate.getTime());
      onDateSelect(newDate);
    } else {
      console.log("Data inválida ou undefined, definindo como undefined");
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
          Selecione uma data para a avaliação.
        </p>
      )}
      
      {scheduledDate && isValidDate(scheduledDate) && !dateError && (
        <p className="text-xs text-muted-foreground">
          Data selecionada: {formatDateForDisplay(scheduledDate)}
        </p>
      )}
      {(!scheduledDate || !isValidDate(scheduledDate)) && !dateError && (
        <p className="text-xs text-muted-foreground">
          Selecione a data em que a avaliação será realizada.
        </p>
      )}
    </div>
  );
}
