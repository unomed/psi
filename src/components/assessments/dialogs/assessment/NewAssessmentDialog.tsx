
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AssessmentSelectionTab } from "../../scheduling/AssessmentSelectionTab";
import { useEmployees } from "@/hooks/useEmployees";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { usePeriodicityForRisk } from "@/hooks/usePeriodicityForRisk";
import { AssessmentDateSection } from "./AssessmentDateSection";
import { AssessmentPeriodicitySection } from "./AssessmentPeriodicitySection";

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

  // Obter o nível de risco do funcionário e a periodicidade correspondente
  const employeeRiskLevel = selectedEmployeeData?.role?.risk_level;
  const suggestedPeriodicity = usePeriodicityForRisk(employeeRiskLevel);
  
  // Adicionar estado para empresa, setor e função
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Verificar e inicializar a data ao abrir o diálogo
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      console.log("Inicializando data com:", today);
      setScheduledDate(today);
      setDateError(false);
      
      // Se tiver um nível de risco e periodicidade sugerida, defina como padrão
      if (suggestedPeriodicity && suggestedPeriodicity !== 'none') {
        setRecurrenceType(suggestedPeriodicity as RecurrenceType);
      }
    }
  }, [isOpen, suggestedPeriodicity]);

  // Verificar compatibilidade entre data e recorrência
  useEffect(() => {
    if (recurrenceType !== 'none' && !scheduledDate) {
      setShowRecurrenceWarning(true);
    } else {
      setShowRecurrenceWarning(false);
    }
  }, [recurrenceType, scheduledDate]);

  // Resetar erro de data quando a data muda
  useEffect(() => {
    if (scheduledDate && scheduledDate instanceof Date && !isNaN(scheduledDate.getTime())) {
      setDateError(false);
    }
  }, [scheduledDate]);

  // Lidar com a mudança de empresa
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompany(companyId);
    setSelectedSector(null);
    setSelectedRole(null);
    onEmployeeSelect("");
  };

  // Lidar com a mudança de setor
  const handleSectorChange = (sectorId: string) => {
    setSelectedSector(sectorId);
    setSelectedRole(null);
    onEmployeeSelect("");
  };

  // Lidar com a mudança de função
  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    onEmployeeSelect("");
  };

  // Lidar com a mudança de data
  const handleDateSelect = (date: Date | undefined) => {
    console.log("Data selecionada no diálogo:", date);
    setScheduledDate(date);
    
    // Validação mais explícita
    if (date && date instanceof Date && !isNaN(date.getTime())) {
      setDateError(false);
      if (recurrenceType !== 'none') {
        setShowRecurrenceWarning(false);
      }
    } else {
      setDateError(true);
      if (recurrenceType !== 'none') {
        setShowRecurrenceWarning(true);
      }
    }
  };

  // Lidar com a mudança de periodicidade
  const handleRecurrenceChange = (value: RecurrenceType) => {
    setRecurrenceType(value);
    
    if (value !== 'none' && (!scheduledDate || !(scheduledDate instanceof Date) || isNaN(scheduledDate.getTime()))) {
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

    // Validação robusta da data
    if (!scheduledDate || !(scheduledDate instanceof Date) || isNaN(scheduledDate.getTime())) {
      console.log("Data inválida ou não selecionada:", scheduledDate);
      setDateError(true);
      toast.error("Selecione uma data válida para a avaliação");
      return;
    }

    // Verificar se a periodicidade é válida quando selecionada
    if (recurrenceType !== 'none') {
      console.log("Verificando periodicidade:", recurrenceType);
    }

    const saved = await onSave();
    if (saved) {
      onClose();
    }
  };

  // Resetar todas as seleções quando o diálogo fecha
  const handleClose = () => {
    setSelectedCompany(null);
    setSelectedSector(null);
    setSelectedRole(null);
    setDateError(false);
    setShowRecurrenceWarning(false);
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
            <AssessmentDateSection
              scheduledDate={scheduledDate}
              onDateSelect={handleDateSelect}
              dateError={dateError}
            />

            <AssessmentPeriodicitySection
              recurrenceType={recurrenceType}
              onRecurrenceChange={handleRecurrenceChange}
              showRecurrenceWarning={showRecurrenceWarning}
              employeeRiskLevel={employeeRiskLevel}
              suggestedPeriodicity={suggestedPeriodicity}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!selectedEmployee || !selectedTemplate || dateError || (recurrenceType !== 'none' && (!scheduledDate || !(scheduledDate instanceof Date) || isNaN(scheduledDate.getTime())))}
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
