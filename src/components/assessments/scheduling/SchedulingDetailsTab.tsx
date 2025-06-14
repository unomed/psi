
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecurrenceType } from "@/types";

interface SchedulingDetailsTabProps {
  employeeName: string;
  employeeEmail?: string;
  templateTitle?: string;
  scheduledDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onBack: () => void;
  onSchedule: (recurrenceType: RecurrenceType, phoneNumber: string) => void;
}

export function SchedulingDetailsTab({
  employeeName,
  employeeEmail,
  templateTitle,
  scheduledDate,
  onDateSelect,
  onBack,
  onSchedule
}: SchedulingDetailsTabProps) {
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Funcionário</Label>
        <p className="text-sm">{employeeName || "Funcionário não encontrado"}</p>
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <p className="text-sm">{employeeEmail || "Não informado"}</p>
      </div>

      <div className="space-y-2">
        <Label>Modelo de Checklist</Label>
        <p className="text-sm">{templateTitle}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduledDate">Data Agendada</Label>
        <DatePicker
          date={scheduledDate}
          onSelect={onDateSelect}
          disabled={(date) => date < new Date()}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recurrence">Recorrência</Label>
        <Select 
          value={recurrenceType || undefined}
          onValueChange={(value) => setRecurrenceType(value as RecurrenceType)} 
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Número de Celular (WhatsApp)</Label>
        <Input
          id="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="(XX) XXXXX-XXXX"
          maxLength={15}
        />
        <p className="text-xs text-muted-foreground">
          Digite o número de WhatsApp para compartilhar o link da avaliação.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button 
          onClick={() => onSchedule(recurrenceType, phoneNumber)}
          disabled={!scheduledDate}
        >
          Agendar
        </Button>
      </div>
    </div>
  );
}
