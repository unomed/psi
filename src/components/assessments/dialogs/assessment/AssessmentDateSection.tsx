
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";

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
  const formatDateForDisplay = (date: Date | undefined): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Data não selecionada';
    }
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="scheduledDate" className={dateError ? "text-red-500" : ""}>
        Data da Avaliação {dateError && <span className="text-red-500">*</span>}
      </Label>
      <DatePicker 
        date={scheduledDate} 
        onSelect={(date) => {
          console.log("Data selecionada:", date);
          onDateSelect(date);
        }} 
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
