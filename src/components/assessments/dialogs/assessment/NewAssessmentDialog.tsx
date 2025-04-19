
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AssessmentSelectionTab } from "../../scheduling/AssessmentSelectionTab";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { usePeriodicityForRisk } from "@/hooks/usePeriodicityForRisk";
import { ChecklistTemplate, RecurrenceType } from "@/types";
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
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date());
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [dateError, setDateError] = useState<boolean>(false);
  const [showRecurrenceWarning, setShowRecurrenceWarning] = useState<boolean>(false);

  // Obter o nível de risco do funcionário e a periodicidade correspondente
  const employeeRiskLevel = "high"; // Simplified for example, replace with actual logic
  const suggestedPeriodicity = usePeriodicityForRisk(employeeRiskLevel);

  // Verificar e inicializar a data ao abrir o diálogo
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
    if (scheduledDate) {
      setDateError(false);
    }
  }, [scheduledDate]);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            selectedCompany={null}
            selectedSector={null}
            selectedRole={null}
            onCompanyChange={() => {}}
            onSectorChange={() => {}}
            onRoleChange={() => {}}
            onNext={handleSave}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AssessmentDateSection
              scheduledDate={scheduledDate}
              onDateSelect={(date) => {
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
              dateError={dateError}
            />

            <AssessmentPeriodicitySection
              recurrenceType={recurrenceType}
              onRecurrenceChange={(value) => {
                setRecurrenceType(value);
                if (value !== 'none' && !scheduledDate) {
                  setShowRecurrenceWarning(true);
                } else {
                  setShowRecurrenceWarning(false);
                }
              }}
              showRecurrenceWarning={showRecurrenceWarning}
              employeeRiskLevel={employeeRiskLevel}
              suggestedPeriodicity={suggestedPeriodicity}
            />
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
