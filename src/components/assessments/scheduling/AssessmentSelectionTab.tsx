import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistTemplate } from "@/types";
import { Button } from "@/components/ui/button";
import { AssessmentSelectionForm } from "./AssessmentSelectionForm";
import { ScheduleAssessmentDialog } from "./ScheduleAssessmentDialog";
import { GenerateLinkDialog } from "./GenerateLinkDialog";

interface AssessmentSelectionTabProps {
  companyId?: string;
}

export function AssessmentSelectionTab({ companyId }: AssessmentSelectionTabProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };

  const handleTemplateSelect = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
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
          <AssessmentSelectionForm
            companyId={companyId}
            selectedEmployeeId={selectedEmployeeId}
            selectedTemplate={selectedTemplate}
            onEmployeeSelect={handleEmployeeSelect}
            onTemplateSelect={handleTemplateSelect}
          />

          <div className="flex gap-4">
            <Button
              onClick={handleScheduleAssessment}
              disabled={!canSchedule}
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
