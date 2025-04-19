import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AssessmentSelectionTab } from "@/components/assessments/scheduling/AssessmentSelectionTab";
import { useEmployees } from "@/hooks/useEmployees";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";  
import { Label } from "@/components/ui/label";
import { Save, AlertCircle } from "lucide-react";
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
  const [showRecurrenceWarning, setShowRecurrenceWarning] = useState<boolean>(false);

  const employeeRiskLevel = selectedEmployeeData?.role?.risk_level;
  const suggestedPeriodicity = usePeriodicityForRisk(employeeRiskLevel);
  
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      console.log("Inicializando data com:", today);
      setScheduledDate(today);
      setDateError(false);
      
      if (suggestedPeriodicity && suggestedPeriodicity !== 'none') {
        setRecurrenceType(suggestedPeriodicity as RecurrenceType);
      }
    }
  }, [isOpen, suggestedPeriodicity]);

  useEffect(() => {
    if (recurrenceType !== 'none' && !scheduledDate) {
      setShowRecurrenceWarning(true);
    } else {
      setShowRecurrenceWarning(false);
    }
  }, [recurrenceType, scheduledDate]);

  useEffect(() => {
    if (scheduledDate) {
      setDateError(false);
    }
  }, [scheduledDate]);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    setSelectedSector(null);
    setSelectedRole(null);
    onEmployeeSelect("");
  };

  const handleSectorChange = (sectorId: string) => {
    setSelectedSector(sectorId);
    setSelectedRole(null);
    onEmployeeSelect("");
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    onEmployeeSelect("");
  };

  const handleRecurrenceChange = (value: string) => {
    setRecurrenceType(value as RecurrenceType);
    
    if (value !== 'none' && !scheduledDate) {
      setShowRecurrenceWarning(true);
    } else {
      setShowRecurrenceWarning(false);
    }
  };

  const handleSave = async () => {
    console.log("Tentando salvar com data:", scheduledDate);
    
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de avaliação");
      return;
    }

    if (!scheduledDate) {
      console.log("Data não selecionada, configurando erro");
      setDateError(true);
      toast.error("Selecione uma data para a avaliação");
      return;
    }

    if (!(scheduledDate instanceof Date) || isNaN(scheduledDate.getTime())) {
      console.error("Data inválida detectada:", scheduledDate);
      setDateError(true);
      toast.error("A data selecionada é inválida. Por favor, selecione novamente.");
      return;
    }

    if (recurrenceType !== 'none') {
      console.log("Verificando periodicidade:", recurrenceType);
    }

    const saved = await onSave();
    if (saved) {
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedCompany(null);
    setSelectedSector(null);
    setSelectedRole(null);
    setDateError(false);
    setShowRecurrenceWarning(false);
    onClose();
  };

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
              <Label htmlFor="scheduledDate" className={dateError ? "text-red-500" : ""}>
                Data da Avaliação {dateError && <span className="text-red-500">*</span>}
              </Label>
              <DatePicker 
                date={scheduledDate} 
                onSelect={(date) => {
                  console.log("Data selecionada:", date);
                  setScheduledDate(date);
                  if (date) {
                    setDateError(false);
                    if (recurrenceType !== 'none') {
                      setShowRecurrenceWarning(false);
                    }
                  } else {
                    if (recurrenceType !== 'none') {
                      setShowRecurrenceWarning(true);
                    }
                  }
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

            <div className="space-y-2">
              <Label htmlFor="recurrence">Periodicidade</Label>
              <Select 
                value={recurrenceType} 
                onValueChange={handleRecurrenceChange}
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
              
              {showRecurrenceWarning && (
                <div className="flex items-center text-amber-500 text-xs gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>É necessário selecionar uma data para usar recorrência.</span>
                </div>
              )}
              
              {employeeRiskLevel && suggestedPeriodicity && suggestedPeriodicity !== 'none' && (
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
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!selectedEmployee || !selectedTemplate || dateError || (recurrenceType !== 'none' && !scheduledDate)}
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
