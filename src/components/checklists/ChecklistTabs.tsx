
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, ClipboardList } from "lucide-react";
import { ChecklistTemplateCard } from "@/components/checklists/ChecklistTemplateCard";
import { ChecklistEmptyState } from "@/components/checklists/ChecklistEmptyState";
import { ChecklistResultItem } from "@/components/checklists/ChecklistResultItem";

interface ChecklistTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  checklists: ChecklistTemplate[];
  results: ChecklistResult[];
  onEditTemplate: (template: ChecklistTemplate) => void;
  onStartAssessment: (template: ChecklistTemplate) => void;
  onViewResult: (result: ChecklistResult) => void;
  onCreateTemplate: () => void;
}

export function ChecklistTabs({
  activeTab,
  setActiveTab,
  checklists,
  results,
  onEditTemplate,
  onStartAssessment,
  onViewResult,
  onCreateTemplate
}: ChecklistTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="templates">
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Modelos
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checklists.map((template) => (
              <ChecklistTemplateCard 
                key={template.id} 
                template={template}
                onEdit={onEditTemplate}
                onTakeAssessment={onStartAssessment}
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="results" className="mt-6">
        {results.length === 0 ? (
          <ChecklistEmptyState 
            type="results" 
            onSwitchTab={() => setActiveTab("templates")} 
          />
        ) : (
          <div className="space-y-4">
            {results.map((result) => {
              const template = checklists.find(t => t.id === result.templateId);
              return (
                <ChecklistResultItem
                  key={result.id}
                  result={result}
                  template={template}
                  onViewResult={onViewResult}
                />
              );
            })}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
