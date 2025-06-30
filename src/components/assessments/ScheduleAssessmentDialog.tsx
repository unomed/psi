
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChecklistTemplate } from "@/types";

interface ScheduleAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployeeId?: string | null;
  selectedTemplate?: ChecklistTemplate | null;
  scheduledDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
  onSave?: () => void;
}

export function ScheduleAssessmentDialog({
  isOpen,
  onClose,
  selectedEmployeeId,
  selectedTemplate,
  scheduledDate,
  onDateSelect,
  onSave
}: ScheduleAssessmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Avaliação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Funcionário: {selectedEmployeeId}</p>
          <p>Template: {selectedTemplate?.title || selectedTemplate?.name}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onSave}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
