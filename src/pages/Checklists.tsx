
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchChecklistTemplates } from "@/services/checklist";
import { ChecklistTemplatesList } from "@/components/checklists/ChecklistTemplatesList";
import { ChecklistResultsList } from "@/components/checklists/ChecklistResultsList";
import { ChecklistTemplate, ChecklistResult } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Checklists() {
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedResult, setSelectedResult] = useState<ChecklistResult | null>(null);

  // Buscar templates
  const { data: templates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['checklistTemplates'],
    queryFn: fetchChecklistTemplates
  });

  // Buscar resultados (mock por enquanto)
  const { data: results = [], isLoading: resultsLoading } = useQuery({
    queryKey: ['checklistResults'], 
    queryFn: async (): Promise<ChecklistResult[]> => {
      // Mock data - implementar busca real depois
      return [];
    }
  });

  const handleEditTemplate = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    console.log("Editar template:", template);
  };

  const handlePreviewTemplate = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    console.log("Visualizar template:", template);
  };

  const handleViewResult = (result: ChecklistResult) => {
    setSelectedResult(result);
    console.log("Ver resultado:", result);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Checklists e Avaliações</h1>
        <p className="text-muted-foreground">
          Gerencie templates, realize avaliações e visualize resultados
        </p>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <ChecklistTemplatesList
            templates={templates}
            isLoading={templatesLoading}
            onEditTemplate={handleEditTemplate}
            onPreviewTemplate={handlePreviewTemplate}
          />
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <ChecklistResultsList
            results={results}
            onViewResult={handleViewResult}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
