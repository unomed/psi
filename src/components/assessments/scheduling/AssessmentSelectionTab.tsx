
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistTemplate } from "@/types";
import { Button } from "@/components/ui/button";
import { AssessmentSelectionForm } from "./AssessmentSelectionForm";

interface AssessmentSelectionTabProps {
  selectedCompany?: string | null;
  selectedSector?: string | null;
  selectedRole?: string | null;
  selectedEmployee?: string | null;
  selectedTemplate?: ChecklistTemplate | null;
  onCompanyChange?: (companyId: string) => void;
  onSectorChange?: (sectorId: string) => void;
  onRoleChange?: (roleId: string) => void;
  onEmployeeChange?: (employeeId: string) => void;
  onTemplateSelect?: (templateId: string) => void;
  templates?: ChecklistTemplate[];
  isTemplatesLoading?: boolean;
  onNext?: () => void;
  companyId?: string;
}

export function AssessmentSelectionTab({ 
  selectedCompany,
  selectedSector,
  selectedRole,
  selectedEmployee,
  selectedTemplate,
  onCompanyChange,
  onSectorChange,
  onRoleChange,
  onEmployeeChange,
  onTemplateSelect,
  templates,
  isTemplatesLoading,
  onNext,
  companyId 
}: AssessmentSelectionTabProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(selectedEmployee || null);
  const [selectedTemplateState, setSelectedTemplateState] = useState<ChecklistTemplate | null>(selectedTemplate || null);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

  const handleEmployeeSelect = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    if (onEmployeeChange) {
      onEmployeeChange(employeeId);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateId);
    }
    // Find template from list if available
    const template = templates?.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplateState(template);
    }
  };

  const handleScheduleAssessment = () => {
    setIsScheduleDialogOpen(true);
  };

  const handleGenerateLink = () => {
    if (selectedEmployeeId && selectedTemplateState) {
      const link = `${window.location.origin}/portal/${selectedTemplateState.id}?employee=${selectedEmployeeId}`;
      setGeneratedLink(link);
      setIsLinkDialogOpen(true);
    }
  };

  const canSchedule = selectedEmployeeId && selectedTemplateState && scheduledDate;
  const canGenerateLink = selectedEmployeeId && selectedTemplateState;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Avaliação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AssessmentSelectionForm
          companyId={companyId}
          selectedEmployee={selectedEmployeeId}
          selectedTemplate={selectedTemplateState}
          templates={templates}
          isTemplatesLoading={isTemplatesLoading}
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
  );
}
