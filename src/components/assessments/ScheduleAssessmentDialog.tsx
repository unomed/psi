import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { ChecklistTemplate } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";

interface ScheduleAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployeeId: string | null;
  selectedTemplate: ChecklistTemplate | null;
  scheduledDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onSave: () => void;
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
  const { userCompanies } = useAuth();
  const companyId = userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined;
  const { employees } = useEmployees({ companyId });
  
  const getSelectedEmployeeName = () => {
    if (!selectedEmployeeId) return "";
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    return employee?.name || "";
  };

  const getSelectedEmployeeEmail = () => {
    if (!selectedEmployeeId) return "";
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    return employee?.email || "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Avaliação</DialogTitle>
          <DialogDescription>
            Agende uma avaliação para o funcionário selecionado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Funcionário</Label>
            <p className="text-sm">{getSelectedEmployeeName()}</p>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm">{getSelectedEmployeeEmail()}</p>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onSave}>Agendar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
