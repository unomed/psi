
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { formatDateForDisplay, isValidDate } from "@/utils/dateUtils";

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
  return (
    <div className="space-y-2">
      <Label htmlFor="scheduledDate" className={dateError ? "text-red-500" : ""}>
        Data da Avaliação {dateError && <span className="text-red-500">*</span>}
      </Label>
      <DatePicker 
        date={scheduledDate} 
        onSelect={onDateSelect} 
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
