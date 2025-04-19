
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AssessmentSelectionTab } from "./scheduling/AssessmentSelectionTab";
import { useEmployees } from "@/hooks/useEmployees";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";  
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { usePeriodicityForRisk } from "@/hooks/usePeriodicityForRisk";

interface NewAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onSave: () => Promise<boolean> | boolean;
}

export function NewAssessmentDialog({
  isOpen,
  onClose,
  selectedEmployee,
  selectedTemplate,
  templates,
  isTemplatesLoading,
  onEmployeeSelect,
  onTemplateSelect,
  onSave
}: NewAssessmentDialogProps) {
  const { employees } = useEmployees();
  const selectedEmployeeData = employees?.find(emp => emp.id === selectedEmployee);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date());
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [dateError, setDateError] = useState<boolean>(false);

  // Get the employee's role risk level and corresponding periodicity
  const employeeRiskLevel = selectedEmployeeData?.role?.risk_level;
  const suggestedPeriodicity = usePeriodicityForRisk(employeeRiskLevel);
  
  // Add state for company, sector, and role selection
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Reset date error when date changes
  useEffect(() => {
    if (scheduledDate) {
      setDateError(false);
    }
  }, [scheduledDate]);

  // Handle company change
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    setSelectedSector(null);
    setSelectedRole(null);
    onEmployeeSelect("");
  };

  // Handle sector change
  const handleSectorChange = (sectorId: string) => {
    setSelectedSector(sectorId);
    setSelectedRole(null);
    onEmployeeSelect("");
  };

  // Handle role change
  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    onEmployeeSelect("");
  };

  const handleSave = async () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de avaliação");
      return;
    }

    if (!scheduledDate) {
      setDateError(true);
      toast.error("Selecione uma data para a avaliação");
      return;
    }

    const saved = await onSave();
    if (saved) {
      onClose();
    }
  };

  // Reset all selections when dialog closes
  const handleClose = () => {
    setSelectedCompany(null);
    setSelectedSector(null);
    setSelectedRole(null);
    setScheduledDate(new Date());
    setRecurrenceType("none");
    setDateError(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Avaliação</DialogTitle>
          <DialogDescription>
            Selecione o funcionário e o modelo de avaliação para criar uma nova avaliação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <AssessmentSelectionTab
            selectedEmployee={selectedEmployee}
            selectedTemplate={selectedTemplate}
            onEmployeeChange={onEmployeeSelect}
            onTemplateSelect={onTemplateSelect}
            templates={templates}
            isTemplatesLoading={isTemplatesLoading}
            selectedCompany={selectedCompany}
            selectedSector={selectedSector}
            selectedRole={selectedRole}
            onCompanyChange={handleCompanyChange}
            onSectorChange={handleSectorChange}
            onRoleChange={handleRoleChange}
            onNext={handleSave}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Data da Avaliação</Label>
              <DatePicker 
                date={scheduledDate} 
                onSelect={setScheduledDate} 
                disabled={(date) => date < new Date()} 
                allowInput={true}
              />
              {dateError && (
                <p className="text-xs text-red-500">
                  Selecione uma data para a avaliação.
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Selecione a data em que a avaliação será realizada.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurrence">Periodicidade</Label>
              <Select 
                value={recurrenceType} 
                onValueChange={(value) => setRecurrenceType(value as RecurrenceType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a periodicidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem recorrência</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="semiannual">Semestral</SelectItem>
                  <SelectItem value="annual">Anual</SelectItem>
                </SelectContent>
              </Select>
              {employeeRiskLevel && suggestedPeriodicity && (
                <p className="text-xs text-muted-foreground">
                  Periodicidade sugerida com base no nível de risco: {suggestedPeriodicity}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!selectedEmployee || !selectedTemplate || !scheduledDate}
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Avaliação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
