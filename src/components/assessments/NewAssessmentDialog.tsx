
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AssessmentSelectionTab } from "./scheduling/AssessmentSelectionTab";
import { useEmployees } from "@/hooks/useEmployees";
import { ChecklistTemplate } from "@/types";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

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

  const handleSave = async () => {
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
            // Remove unnecessary state and change tracking
            selectedCompany={null}
            selectedSector={null}
            selectedRole={null}
            onCompanyChange={() => {}}
            onSectorChange={() => {}}
            onRoleChange={() => {}}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={!selectedEmployee || !selectedTemplate}
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
