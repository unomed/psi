
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { ScheduledAssessment } from "@/types/assessment";
import { Employee } from "@/types/employee";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChecklistEmptyState } from "@/components/checklists/ChecklistEmptyState";
import { ClipboardCheck, ClipboardList, Mail, History } from "lucide-react";
import { TemplatesTable } from "./tables/TemplatesTable";
import { AllTemplatesTable } from "./tables/AllTemplatesTable";
import { ResultsList } from "./lists/ResultsList";
import { EmailChecklistForm } from "./email/EmailChecklistForm";
import { EmailHistoryTable } from "./email/EmailHistoryTable";
import { useEmailSending } from "@/hooks/checklists/useEmailSending";
import { useAuth } from "@/contexts/AuthContext";

// Interface local para garantir que o email seja obrigatório no contexto de envio de emails
interface EmailEmployee extends Employee {
  email: string; // Tornando o email obrigatório neste contexto
}

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
  const { sendChecklistEmails, isLoading: isSendingEmails } = useEmailSending();
  const { userRole } = useAuth();

  const handleSendEmails = async (data: {
    templateId: string;
    employees: EmailEmployee[];
    subject: string;
    body: string;
    scheduledDate: Date;
  }) => {
    await sendChecklistEmails(data);
    onRefreshScheduled();
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-slate-50 p-1 rounded-lg">
        <TabsTrigger 
          value="all"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-blue-200 data-[state=active]:text-blue-800 data-[state=active]:border-blue-300 transition-all duration-200"
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          Todos
        </TabsTrigger>
        <TabsTrigger 
          value="results"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100 data-[state=active]:to-green-200 data-[state=active]:text-green-800 data-[state=active]:border-green-300 transition-all duration-200"
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          Resultados
        </TabsTrigger>
        <TabsTrigger 
          value="email"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-100 data-[state=active]:to-purple-200 data-[state=active]:text-purple-800 data-[state=active]:border-purple-300 transition-all duration-200"
        >
          <Mail className="h-4 w-4 mr-2" />
          Envio Email
        </TabsTrigger>
        <TabsTrigger 
          value="history"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-orange-200 data-[state=active]:text-orange-800 data-[state=active]:border-orange-300 transition-all duration-200"
        >
          <History className="h-4 w-4 mr-2" />
          Histórico
        </TabsTrigger>
      </TabsList>
      
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
