
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChecklistTemplate } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { useChecklistTemplates } from "@/hooks/checklist/useChecklistTemplates";
import { EmployeeSelector } from "../selectors/EmployeeSelector";
import { TemplateSelector } from "../selectors/TemplateSelector";
import { ScheduleAssessmentDialog } from "../ScheduleAssessmentDialog";
import { GenerateLinkDialog } from "../GenerateLinkDialog";
import { useAuth } from "@/hooks/useAuth";

interface AssessmentSelectionFormProps {
  companyId?: string | null;
  selectedEmployee?: string | null;
  selectedTemplate?: ChecklistTemplate | null;
  templates?: ChecklistTemplate[];
  isTemplatesLoading?: boolean;
  onStartAssessment?: () => void;
  onScheduleAssessment?: () => void;
  onGenerateLink?: () => void;
  onEmployeeSelect?: (employeeId: string) => void;
  onTemplateSelect?: (templateId: string) => void;
}

export function AssessmentSelectionForm({ 
  companyId,
  selectedEmployee: externalSelectedEmployee,
  selectedTemplate: externalSelectedTemplate,
  templates: externalTemplates,
  isTemplatesLoading: externalIsLoading,
  onStartAssessment,
  onScheduleAssessment,
  onGenerateLink,
  onEmployeeSelect: externalOnEmployeeSelect,
  onTemplateSelect: externalOnTemplateSelect
}: AssessmentSelectionFormProps) {
  const { userCompanies } = useAuth();
  const targetCompanyId = companyId || (userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined);
  
  const [internalSelectedEmployeeId, setInternalSelectedEmployeeId] = useState<string | null>(null);
  const [internalSelectedTemplate, setInternalSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const { data: employees } = useEmployees(targetCompanyId);
  const { checklists, isLoading: internalIsLoading } = useChecklistTemplates();

  // Use external or internal state
  const selectedEmployeeId = externalSelectedEmployee || internalSelectedEmployeeId;
  const selectedTemplate = externalSelectedTemplate || internalSelectedTemplate;
  const templates = externalTemplates || checklists;
  const isTemplatesLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;

  const handleEmployeeChange = (employeeId: string) => {
    if (externalOnEmployeeSelect) {
      externalOnEmployeeSelect(employeeId);
    } else {
      setInternalSelectedEmployeeId(employeeId);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (externalOnTemplateSelect) {
      externalOnTemplateSelect(templateId);
    } else {
      setInternalSelectedTemplate(template || null);
    }
  };

  const handleScheduleAssessment = () => {
    if (onScheduleAssessment) {
      onScheduleAssessment();
    } else {
      setIsScheduleDialogOpen(true);
    }
  };

  const handleGenerateLink = () => {
    if (onGenerateLink) {
      onGenerateLink();
    } else if (selectedEmployeeId && selectedTemplate) {
      const link = `${window.location.origin}/portal/${selectedTemplate.id}?employee=${selectedEmployeeId}`;
      setGeneratedLink(link);
      setIsLinkDialogOpen(true);
    }
  };

  const handleStartAssessment = () => {
    if (onStartAssessment) {
      onStartAssessment();
    }
  };

  const handleSaveScheduledAssessment = () => {
    // Implement save logic here
    setIsScheduleDialogOpen(false);
  };

  const canGenerateLink = selectedEmployeeId && selectedTemplate;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Nova Avaliação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EmployeeSelector
            selectedRole={selectedRole}
            selectedEmployee={selectedEmployeeId}
            onEmployeeChange={handleEmployeeChange}
          />

          <TemplateSelector
            selectedEmployee={selectedEmployeeId}
            templates={templates}
            selectedTemplateValue={selectedTemplate?.id || null}
            isTemplatesLoading={isTemplatesLoading}
            onTemplateSelect={handleTemplateChange}
          />

          <div className="flex gap-4">
            {onStartAssessment && (
              <Button
                onClick={handleStartAssessment}
                disabled={!selectedEmployeeId || !selectedTemplate}
              >
                Iniciar Avaliação
              </Button>
            )}
            
            <Button
              onClick={handleScheduleAssessment}
              disabled={!selectedEmployeeId || !selectedTemplate}
            >
              Agendar Avaliação
            </Button>
            
            <Button
              variant="outline"
              onClick={handleGenerateLink}
              disabled={!canGenerateLink}
            >
              Gerar Link
            </Button>
          </div>
        </CardContent>
      </Card>

      <ScheduleAssessmentDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        selectedEmployeeId={selectedEmployeeId}
        selectedTemplate={selectedTemplate}
        scheduledDate={scheduledDate}
        onDateSelect={setScheduledDate}
        onSave={handleSaveScheduledAssessment}
      />

      <GenerateLinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        selectedEmployeeId={selectedEmployeeId}
        selectedTemplate={selectedTemplate}
        generatedLink={generatedLink}
      />
    </>
  );
}
