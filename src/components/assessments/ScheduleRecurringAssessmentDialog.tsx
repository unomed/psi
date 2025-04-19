
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecurrenceType, ChecklistTemplate } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { toast } from "sonner";

interface ScheduleRecurringAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployeeId: string | null;
  selectedTemplate: ChecklistTemplate | null;
  scheduledDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onSave: (recurrenceType: RecurrenceType, phoneNumber: string) => void;
}

export function ScheduleRecurringAssessmentDialog({
  isOpen,
  onClose,
  selectedEmployeeId,
  selectedTemplate,
  scheduledDate,
  onDateSelect,
  onSave
}: ScheduleRecurringAssessmentDialogProps) {
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { employees, isLoading } = useEmployees();
  
  const getSelectedEmployee = () => {
    if (!selectedEmployeeId) return null;
    return employees?.find(emp => emp.id === selectedEmployeeId) || null;
  };

  const selectedEmployee = getSelectedEmployee();

  const handleSave = () => {
    if (!selectedEmployee) {
      toast.error("Funcionário não encontrado");
      return;
    }
    onSave(recurrenceType, phoneNumber);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Avaliação</DialogTitle>
          <DialogDescription>
            Agende uma avaliação com opção de recorrência para o funcionário selecionado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Funcionário</Label>
            {isLoading ? (
              <p className="text-sm">Carregando...</p>
            ) : selectedEmployee ? (
              <p className="text-sm">{selectedEmployee.name}</p>
            ) : (
              <p className="text-sm text-destructive">Funcionário não encontrado</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            {isLoading ? (
              <p className="text-sm">Carregando...</p> 
            ) : selectedEmployee ? (
              <p className="text-sm">{selectedEmployee.email || "Não informado"}</p>
            ) : (
              <p className="text-sm text-muted-foreground">-</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Modelo de Checklist</Label>
            <p className="text-sm">{selectedTemplate?.title}</p>
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
              onValueChange={(value) => setRecurrenceType(value as RecurrenceType)} 
              defaultValue="none"
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Agendar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
