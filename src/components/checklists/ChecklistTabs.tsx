import { ChecklistTemplate, ChecklistResult, ScheduledAssessment } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChecklistEmptyState } from "@/components/checklists/ChecklistEmptyState";
import { ClipboardCheck, ClipboardList, Mail, History } from "lucide-react";
import { TemplatesTable } from "./tables/TemplatesTable";
import { AllTemplatesTable } from "./tables/AllTemplatesTable";
import { ResultsList } from "./lists/ResultsList";
import { EmailChecklistForm } from "./email/EmailChecklistForm";
import { EmailHistoryTable } from "./email/EmailHistoryTable";
import { useEmailSending } from "@/hooks/checklists/useEmailSending";
import { useAuth } from "@/hooks/useAuth";

interface ChecklistTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  checklists: ChecklistTemplate[];
  results: ChecklistResult[];
  scheduledAssessments: ScheduledAssessment[];
  onEditTemplate: (template: ChecklistTemplate) => void;
  onDeleteTemplate: (template: ChecklistTemplate) => void;
  onCopyTemplate: (template: ChecklistTemplate) => void;
  onStartAssessment: (template: ChecklistTemplate) => void;
  onViewResult: (result: ChecklistResult) => void;
  onCreateTemplate: () => void;
  onSendEmail: (assessmentId: string) => void;
  onRefreshScheduled: () => void;
  isDeleting?: boolean;
}

export function ChecklistTabs({
  activeTab,
  setActiveTab,
  checklists,
  results,
  scheduledAssessments,
  onEditTemplate,
  onDeleteTemplate,
  onCopyTemplate,
  onStartAssessment,
  onViewResult,
  onCreateTemplate,
  onSendEmail,
  onRefreshScheduled,
  isDeleting = false
}: ChecklistTabsProps) {
  const { sendEmails } = useEmailSending();
  const { userRole } = useAuth();

  const handleSendEmails = async (data: {
    templateId: string;
    employees: any[];
    subject: string;
    body: string;
  }) => {
    // Transform data to match useEmailSending interface
    const emailTemplate = {
      subject: data.subject,
      body: data.body
    };
    
    const assessmentIds = data.employees.map(emp => emp.id);
    
    await sendEmails({
      assessmentIds,
      templateId: data.templateId,
      emailTemplate
    });
    
    onRefreshScheduled();
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-2xl grid-cols-5">
        <TabsTrigger value="templates">
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Modelos
        </TabsTrigger>
        <TabsTrigger value="all">
          <ClipboardList className="h-4 w-4 mr-2" />
          Todos
        </TabsTrigger>
        <TabsTrigger value="results">
          <ClipboardList className="h-4 w-4 mr-2" />
          Resultados
        </TabsTrigger>
        <TabsTrigger value="email">
          <Mail className="h-4 w-4 mr-2" />
          Envio Email
        </TabsTrigger>
        <TabsTrigger value="history">
          <History className="h-4 w-4 mr-2" />
          Histórico
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="templates" className="mt-6">
        {checklists.length === 0 ? (
          <ChecklistEmptyState 
            type="templates" 
            onCreateTemplate={onCreateTemplate} 
          />
        ) : (
          <TemplatesTable
            templates={checklists}
            onEditTemplate={onEditTemplate}
            onDeleteTemplate={onDeleteTemplate}
            onCopyTemplate={onCopyTemplate}
            onStartAssessment={onStartAssessment}
            isDeleting={isDeleting}
          />
        )}
      </TabsContent>
      
      <TabsContent value="all" className="mt-6">
        {checklists.length === 0 ? (
          <ChecklistEmptyState 
            type="templates" 
            onCreateTemplate={onCreateTemplate} 
          />
        ) : (
          <AllTemplatesTable
            templates={checklists}
            onEditTemplate={onEditTemplate}
            onDeleteTemplate={onDeleteTemplate}
            onCopyTemplate={onCopyTemplate}
            onStartAssessment={onStartAssessment}
            isDeleting={isDeleting}
          />
        )}
      </TabsContent>

      <TabsContent value="results" className="mt-6">
        {results.length === 0 ? (
          <ChecklistEmptyState 
            type="results" 
            onSwitchTab={() => setActiveTab("templates")} 
          />
        ) : (
          <ResultsList
            results={results}
            templates={checklists}
            onViewResult={onViewResult}
          />
        )}
      </TabsContent>

      <TabsContent value="email" className="mt-6">
        <EmailChecklistForm
          templates={checklists}
          onSendEmails={handleSendEmails}
        />
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <EmailHistoryTable
          assessments={scheduledAssessments}
          onResendEmail={onSendEmail}
          onRefresh={onRefreshScheduled}
        />
      </TabsContent>
    </Tabs>
  );
}
