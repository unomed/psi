
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ChecklistTemplate, ScheduledAssessment } from "@/types";
import { ScheduledAssessmentsList } from "@/components/assessments/ScheduledAssessmentsList";

interface AssessmentTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  scheduledAssessments: ScheduledAssessment[];
  templates: ChecklistTemplate[];
  onSendEmail: (assessmentId: string) => void;
  onShareAssessment: (assessmentId: string) => void;
  onScheduleAssessment: (employeeId: string, templateId: string) => void;
  onGenerateLink: (employeeId: string, templateId: string) => void;
}

export function AssessmentTabs({
  activeTab,
  onTabChange,
  scheduledAssessments,
  templates,
  onSendEmail,
  onShareAssessment,
  onScheduleAssessment,
  onGenerateLink
}: AssessmentTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList>
        <TabsTrigger value="agendadas">Avaliações Agendadas</TabsTrigger>
        <TabsTrigger value="enviadas">Avaliações Enviadas</TabsTrigger>
        <TabsTrigger value="concluidas">Avaliações Concluídas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="agendadas" className="space-y-4">
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Avaliações Agendadas</h2>
            
            <ScheduledAssessmentsList
              scheduledAssessments={scheduledAssessments.filter(a => a.status === "scheduled")}
              onSendEmail={onSendEmail}
              onShareAssessment={onShareAssessment}
              onScheduleAssessment={onScheduleAssessment}
              onGenerateLink={onGenerateLink}
              templates={templates}
            />
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="enviadas" className="space-y-4">
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Avaliações Enviadas</h2>
            
            <ScheduledAssessmentsList
              scheduledAssessments={scheduledAssessments.filter(a => a.status === "sent")}
              onSendEmail={onSendEmail}
              onShareAssessment={onShareAssessment}
              onScheduleAssessment={onScheduleAssessment}
              onGenerateLink={onGenerateLink}
              templates={templates}
            />
          </div>
        </Card>
      </TabsContent>
      
      <TabsContent value="concluidas" className="space-y-4">
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Avaliações Concluídas</h2>
            
            <ScheduledAssessmentsList
              scheduledAssessments={scheduledAssessments.filter(a => a.status === "completed")}
              onSendEmail={onSendEmail}
              onShareAssessment={onShareAssessment}
              onScheduleAssessment={onScheduleAssessment}
              onGenerateLink={onGenerateLink}
              templates={templates}
            />
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
