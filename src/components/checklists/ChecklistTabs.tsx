
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChecklistEmptyState } from "@/components/checklists/ChecklistEmptyState";
import { ClipboardCheck, ClipboardList } from "lucide-react";
import { TemplatesTable } from "./tables/TemplatesTable";
import { AllTemplatesTable } from "./tables/AllTemplatesTable";
import { ResultsList } from "./lists/ResultsList";

interface ChecklistTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  checklists: ChecklistTemplate[];
  results: ChecklistResult[];
  onEditTemplate: (template: ChecklistTemplate) => void;
  onDeleteTemplate: (template: ChecklistTemplate) => void;
  onCopyTemplate: (template: ChecklistTemplate) => void;
  onStartAssessment: (template: ChecklistTemplate) => void;
  onViewResult: (result: ChecklistResult) => void;
  onCreateTemplate: () => void;
  isDeleting?: boolean;
}

export function ChecklistTabs({
  activeTab,
  setActiveTab,
  checklists,
  results,
  onEditTemplate,
  onDeleteTemplate,
  onCopyTemplate,
  onStartAssessment,
  onViewResult,
  onCreateTemplate,
  isDeleting = false
}: ChecklistTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-md grid-cols-3">
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
    </Tabs>
  );
}
