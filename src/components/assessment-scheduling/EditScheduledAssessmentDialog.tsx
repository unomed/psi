
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { ScheduledAssessment, RecurrenceType } from "@/types";
import { useEditScheduledAssessment } from "@/hooks/assessment-scheduling/useEditScheduledAssessment";

interface EditScheduledAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: ScheduledAssessment | null;
}

export function EditScheduledAssessmentDialog({
  isOpen,
  onClose,
  assessment
}: EditScheduledAssessmentDialogProps) {
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { editAssessment, isEditing } = useEditScheduledAssessment();

  useEffect(() => {
    if (assessment) {
      setScheduledDate(assessment.scheduledDate);
      setRecurrenceType(assessment.recurrenceType || "none");
      setPhoneNumber(assessment.phoneNumber || "");
    }
  }, [assessment]);

  const handleSave = async () => {
    if (!assessment || !scheduledDate) {
      return;
    }

    try {
      await editAssessment({
        id: assessment.id,
        scheduledDate,
        recurrenceType,
        phoneNumber
      });
      onClose();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    if (assessment) {
      setScheduledDate(assessment.scheduledDate);
      setRecurrenceType(assessment.recurrenceType || "none");
      setPhoneNumber(assessment.phoneNumber || "");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Funcionário</Label>
            <p className="text-sm text-muted-foreground">
              {assessment?.employees?.name || 'Nome não disponível'}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Template</Label>
            <p className="text-sm text-muted-foreground">
              {assessment?.checklist_templates?.title || 'Template não disponível'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Data Agendada *</Label>
            <DatePicker
              date={scheduledDate}
              onSelect={setScheduledDate}
              disabled={(date) => date < new Date()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurrenceType">Recorrência</Label>
            <Select value={recurrenceType} onValueChange={(value: RecurrenceType) => setRecurrenceType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar recorrência" />
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
            <Label htmlFor="phoneNumber">Telefone</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isEditing}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isEditing || !scheduledDate}
          >
            {isEditing ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
