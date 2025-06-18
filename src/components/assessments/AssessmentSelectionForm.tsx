
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChecklistTemplate } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { useChecklistTemplates } from "@/hooks/checklist/useChecklistTemplates";
import { EmployeeSelector } from "./selectors/EmployeeSelector";
import { TemplateSelector } from "./selectors/TemplateSelector";
import { ScheduleAssessmentDialog } from "./ScheduleAssessmentDialog";
import { GenerateLinkDialog } from "./GenerateLinkDialog";
import { useAuth } from "@/hooks/useAuth";

interface AssessmentSelectionFormProps {
  companyId?: string | null;
}

export function AssessmentSelectionForm({ companyId }: AssessmentSelectionFormProps) {
  const { userCompanies } = useAuth();
  const targetCompanyId = companyId || (userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined);
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const { employees } = useEmployees({ companyId: targetCompanyId });
  const { checklists } = useChecklistTemplates();

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };

  const handleTemplateChange = (templateId: string) => {
    const template = checklists.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
  };

  const handleScheduleAssessment = () => {
    setIsScheduleDialogOpen(true);
  };

  const handleGenerateLink = () => {
    if (selectedEmployeeId && selectedTemplate) {
      const link = `${window.location.origin}/portal/${selectedTemplate.id}?employee=${selectedEmployeeId}`;
      setGeneratedLink(link);
      setIsLinkDialogOpen(true);
    }
  };

  const handleSaveScheduledAssessment = () => {
    // Implement save logic here
    setIsScheduleDialogOpen(false);
  };

  const canSchedule = selectedEmployeeId && selectedTemplate && scheduledDate;
  const canGenerateLink = selectedEmployeeId && selectedTemplate;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Nova Avaliação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <EmployeeSelector
            selectedEmployee={selectedEmployeeId}
            onEmployeeChange={handleEmployeeChange}
          />

          <TemplateSelector
            templates={checklists}
            selectedTemplateValue={selectedTemplate?.id || null}
            onTemplateSelect={handleTemplateChange}
          />

          <div className="flex gap-4">
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
