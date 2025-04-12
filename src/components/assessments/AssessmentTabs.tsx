
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ChecklistTemplate, ScheduledAssessment } from "@/types/checklist";
import { AssessmentSelectionForm } from "@/components/assessments/AssessmentSelectionForm";
import { ScheduledAssessmentsList } from "@/components/assessments/ScheduledAssessmentsList";

interface AssessmentTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  scheduledAssessments: ScheduledAssessment[];
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  templates: ChecklistTemplate[];
  isTemplatesLoading: boolean;
  onStartAssessment: () => void;
  onScheduleAssessment: () => void;
  onGenerateLink: () => void;
  onEmployeeSelect: (employeeId: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onSendEmail: (assessmentId: string) => void;
  onShareAssessment: (assessmentId: string) => void;
}

export function AssessmentTabs({
  activeTab,
  onTabChange,
  scheduledAssessments,
  selectedEmployee,
  selectedTemplate,
  templates,
  isTemplatesLoading,
  onStartAssessment,
  onScheduleAssessment,
  onGenerateLink,
  onEmployeeSelect,
  onTemplateSelect,
  onSendEmail,
  onShareAssessment
}: AssessmentTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList>
        <TabsTrigger value="agendadas">Avaliações Agendadas</TabsTrigger>
        <TabsTrigger value="nova">Nova Avaliação</TabsTrigger>
      </TabsList>
      
      <TabsContent value="agendadas" className="space-y-4">
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Avaliações Agendadas</h2>
            
            <ScheduledAssessmentsList
              scheduledAssessments={scheduledAssessments}
              onSendEmail={onSendEmail}
              onShareAssessment={onShareAssessment}
              templates={templates}
            />
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="nova" className="space-y-4">
        <Card className="p-6">
          <AssessmentSelectionForm
            selectedEmployee={selectedEmployee}
            selectedTemplate={selectedTemplate}
            templates={templates}
            isTemplatesLoading={isTemplatesLoading}
            onStartAssessment={onStartAssessment}
            onScheduleAssessment={onScheduleAssessment}
            onGenerateLink={onGenerateLink}
            onEmployeeSelect={onEmployeeSelect}
            onTemplateSelect={onTemplateSelect}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
