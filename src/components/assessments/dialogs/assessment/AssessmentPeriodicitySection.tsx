
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RecurrenceType } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRiskBasedPeriodicity } from "@/hooks/assessments/operations/useRiskBasedPeriodicity";
import { useEffect } from "react";
import { PeriodicityType } from "@/types/settings";

interface AssessmentPeriodicitySectionProps {
  recurrenceType: RecurrenceType;
  onRecurrenceChange: (value: RecurrenceType) => void;
  showRecurrenceWarning: boolean;
  employeeId: string | null;
}

export function AssessmentPeriodicitySection({
  recurrenceType,
  onRecurrenceChange,
  showRecurrenceWarning,
  employeeId
}: AssessmentPeriodicitySectionProps) {
  const { suggestedPeriodicity, isLoading } = useRiskBasedPeriodicity(employeeId);

  useEffect(() => {
    // Only set suggested periodicity if no recurrence type is set yet and we have a valid suggestion
    if (suggestedPeriodicity && suggestedPeriodicity !== "none" && recurrenceType === "none") {
      onRecurrenceChange(suggestedPeriodicity as RecurrenceType);
    }
  }, [suggestedPeriodicity, recurrenceType, onRecurrenceChange]);

  if (isLoading) {
    return <div>Carregando periodicidade sugerida...</div>;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="recurrence">Periodicidade</Label>
      <Select 
        value={recurrenceType} 
        onValueChange={(value) => onRecurrenceChange(value as RecurrenceType)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione o tipo de recorrência" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sem recorrência</SelectItem>
          <SelectItem value="monthly">Mensal</SelectItem>
          <SelectItem value="semiannual">Semestral</SelectItem>
          <SelectItem value="annual">Anual</SelectItem>
        </SelectContent>
      </Select>
      
      {showRecurrenceWarning && (
        <div className="flex items-center text-amber-500 text-xs gap-1 mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>É necessário selecionar uma data para usar recorrência.</span>
        </div>
      )}
      
      {suggestedPeriodicity && suggestedPeriodicity !== 'none' && (
        <p className="text-xs text-muted-foreground">
          Periodicidade sugerida com base no nível de risco: {suggestedPeriodicity}
        </p>
      )}
      {recurrenceType !== 'none' && (
        <p className="text-xs text-muted-foreground">
          A próxima avaliação será agendada automaticamente de acordo com a periodicidade selecionada.
        </p>
      )}
    </div>
  );
}
