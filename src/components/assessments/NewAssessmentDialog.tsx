
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
import { isValidDate, createSafeDate } from "@/utils/dateUtils";
import { AssessmentPeriodicitySection } from "@/components/assessments/dialogs/assessment/AssessmentPeriodicitySection";

interface NewAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onSave: (date?: Date) => Promise<boolean> | boolean;
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
  const [attemptedSave, setAttemptedSave] = useState<boolean>(false);

  const employeeRiskLevel = selectedEmployeeData?.role?.risk_level;
  const suggestedPeriodicity = usePeriodicityForRisk(employeeRiskLevel);
  
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Safe recurrence options with validation
  const recurrenceOptions = [
    { value: "none", label: "Sem recorrência" },
    { value: "monthly", label: "Mensal" },
    { value: "quarterly", label: "Trimestral" },
    { value: "semiannual", label: "Semestral" },
    { value: "annual", label: "Anual" }
  ].filter(option => option.value && option.value.trim() !== "");

  useEffect(() => {
    if (isOpen) {
      // Criar uma nova instância segura de Date para inicialização
      const today = createSafeDate(new Date());
      console.log("Inicializando data com:", today, "Timestamp:", today.getTime());
      setScheduledDate(today);
      setDateError(false);
      setAttemptedSave(false);
      
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

  // Este useEffect garante que o erro de data seja removido quando uma data válida for selecionada
  useEffect(() => {
    if (scheduledDate && isValidDate(scheduledDate)) {
      console.log("Data válida detectada, removendo erro:", scheduledDate);
      setDateError(false);
    } else if (attemptedSave && !scheduledDate) {
      // Apenas mostra erro se já tentou salvar e não tem data
      setDateError(true);
    }
  }, [scheduledDate, attemptedSave]);

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
    // Validate value before setting
    const validValue = value && recurrenceOptions.some(opt => opt.value === value) ? value : "none";
    setRecurrenceType(validValue as RecurrenceType);
    
    if (validValue !== 'none' && !scheduledDate) {
      setShowRecurrenceWarning(true);
    } else {
      setShowRecurrenceWarning(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    console.log("NewAssessmentDialog: Data selecionada:", date,
      date instanceof Date ? `Timestamp: ${date.getTime()}` : "");
    
    // Usar a função createSafeDate para garantir uma instância segura da data
    if (date && isValidDate(date)) {
      const safeDate = createSafeDate(date);
      console.log("Nova data segura criada:", safeDate, "Timestamp:", safeDate.getTime());
      setScheduledDate(safeDate);
    } else {
      setScheduledDate(undefined);
    }
  };

  const handleSave = async () => {
    setAttemptedSave(true);
    
    console.log("NewAssessmentDialog: Tentando salvar com data:", scheduledDate,
      scheduledDate instanceof Date ? `Timestamp: ${scheduledDate.getTime()}` : "");
    
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

    if (!isValidDate(scheduledDate)) {
      console.error("Data inválida detectada:", scheduledDate);
      setDateError(true);
      toast.error("A data selecionada é inválida. Por favor, selecione novamente.");
      return;
    }

    if (recurrenceType !== 'none') {
      console.log("Verificando periodicidade:", recurrenceType);
    }

    // Passar explicitamente a data validada para a função onSave
    const safeDate = createSafeDate(scheduledDate);
    console.log("Salvando com data segura:", safeDate, "Timestamp:", safeDate.getTime());
    
    try {
      const saved = await onSave(safeDate);
      if (saved) {
        onClose();
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Ocorreu um erro ao salvar a avaliação");
    }
  };

  const handleClose = () => {
    setSelectedCompany(null);
    setSelectedSector(null);
    setSelectedRole(null);
    setDateError(false);
    setShowRecurrenceWarning(false);
    setAttemptedSave(false);
    onClose();
  };

  const formatDateForDisplay = (date: Date | undefined): string => {
    if (!date || !isValidDate(date)) {
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
                onSelect={handleDateSelect} 
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
              <Label htmlFor="recurrenceType">Periodicidade</Label>
              <Select value={recurrenceType} onValueChange={handleRecurrenceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a periodicidade" />
                </SelectTrigger>
                <SelectContent>
                  {recurrenceOptions
                    .filter(option => option.value && option.value.trim() !== "")
                    .map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showRecurrenceWarning && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-xs">
                    Para recorrência, é necessário definir uma data inicial.
                  </p>
                </div>
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
