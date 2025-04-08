
import { useState } from "react";
import { ClipboardCheck, PlusCircle, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { ChecklistTemplateForm } from "@/components/checklists/ChecklistTemplateForm";
import { ChecklistTemplateCard } from "@/components/checklists/ChecklistTemplateCard";
import { DiscAssessmentForm } from "@/components/checklists/DiscAssessmentForm";
import { DiscResultDisplay } from "@/components/checklists/DiscResultDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock initial checklist data
const initialChecklists: ChecklistTemplate[] = [
  {
    id: "disc-leadership",
    title: "Avaliação DISC para Liderança",
    description: "Avaliação de perfil comportamental para identificação de estilos de liderança e tomada de decisão",
    type: "disc",
    questions: [
      {
        id: "q1",
        text: "Prefiro tomar decisões rápidas e ser direto(a) ao comunicar",
        targetFactor: "D",
        weight: 2
      },
      {
        id: "q2",
        text: "Tenho facilidade em inspirar e motivar os outros",
        targetFactor: "I",
        weight: 2
      },
      {
        id: "q3",
        text: "Prefiro ouvir todas as opiniões antes de tomar decisões importantes",
        targetFactor: "S",
        weight: 2
      },
      {
        id: "q4",
        text: "Gosto de analisar todos os detalhes e dados antes de agir",
        targetFactor: "C",
        weight: 2
      },
      {
        id: "q5",
        text: "Frequentemente assumo a liderança em projetos e discussões",
        targetFactor: "D",
        weight: 3
      },
      {
        id: "q6",
        text: "Sou bom em construir relacionamentos e fazer networking",
        targetFactor: "I",
        weight: 3
      },
      {
        id: "q7",
        text: "Prefiro trabalhar em ambientes previsíveis e estruturados",
        targetFactor: "S",
        weight: 3
      },
      {
        id: "q8",
        text: "Sigo rigorosamente regras e procedimentos estabelecidos",
        targetFactor: "C",
        weight: 3
      }
    ],
    createdAt: new Date(2023, 6, 15)
  }
];

export default function Checklists() {
  const [checklists, setChecklists] = useState<ChecklistTemplate[]>(initialChecklists);
  const [results, setResults] = useState<ChecklistResult[]>([]);
  const [activeTab, setActiveTab] = useState("templates");
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedResult, setSelectedResult] = useState<ChecklistResult | null>(null);

  const handleCreateTemplate = (data: Omit<ChecklistTemplate, "id" | "createdAt">) => {
    const newTemplate = {
      ...data,
      id: `template-${Date.now()}`,
      createdAt: new Date()
    };
    
    setChecklists([...checklists, newTemplate]);
    setIsFormDialogOpen(false);
    toast.success("Modelo de checklist criado com sucesso!");
  };

  const handleEditTemplate = (template: ChecklistTemplate) => {
    // For demonstration, we'll just show a toast
    toast.info("Edição de checklist será implementada em breve!");
  };

  const handleStartAssessment = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    setIsAssessmentDialogOpen(true);
  };

  const handleSubmitAssessment = (resultData: Omit<ChecklistResult, "id" | "completedAt">) => {
    const newResult = {
      ...resultData,
      id: `result-${Date.now()}`,
      completedAt: new Date()
    };
    
    setResults([...results, newResult]);
    setIsAssessmentDialogOpen(false);
    setSelectedResult(newResult);
    setIsResultDialogOpen(true);
    toast.success("Avaliação concluída com sucesso!");
  };

  const handleCloseAssessment = () => {
    setIsAssessmentDialogOpen(false);
    setSelectedTemplate(null);
  };

  const handleCloseResult = () => {
    setIsResultDialogOpen(false);
    setSelectedResult(null);
  };

  const handleViewResult = (result: ChecklistResult) => {
    setSelectedResult(result);
    setIsResultDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checklists</h1>
          <p className="text-muted-foreground mt-2">
            Modelos de avaliação psicossocial e questionários para identificação de riscos.
          </p>
        </div>
        <Button onClick={() => setIsFormDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Checklist
        </Button>
      </div>
      
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
            <div className="flex items-center justify-center h-64 border rounded-lg">
              <div className="text-center">
                <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhum modelo cadastrado</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Cadastre modelos de checklist para avaliação psicossocial baseados em metodologias
                  como DISC para identificação de riscos e compatibilidade de perfis.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsFormDialogOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Modelo
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {checklists.map((template) => (
                <ChecklistTemplateCard 
                  key={template.id} 
                  template={template}
                  onEdit={handleEditTemplate}
                  onTakeAssessment={handleStartAssessment}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="results" className="mt-6">
          {results.length === 0 ? (
            <div className="flex items-center justify-center h-64 border rounded-lg">
              <div className="text-center">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhum resultado registrado</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Realize avaliações utilizando os modelos de checklist cadastrados para visualizar resultados
                  e relatórios de perfil comportamental.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab("templates")}
                >
                  Ir para Modelos
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => {
                const template = checklists.find(t => t.id === result.templateId);
                return (
                  <div 
                    key={result.id} 
                    className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                    onClick={() => handleViewResult(result)}
                  >
                    <div>
                      <h3 className="font-medium">{template?.title || "Avaliação"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {result.employeeName || "Anônimo"} - Perfil dominante: {result.dominantFactor}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating a new checklist template */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Modelo de Checklist</DialogTitle>
          </DialogHeader>
          <ChecklistTemplateForm onSubmit={handleCreateTemplate} />
        </DialogContent>
      </Dialog>
      
      {/* Dialog for taking an assessment */}
      <Dialog 
        open={isAssessmentDialogOpen && selectedTemplate !== null} 
        onOpenChange={setIsAssessmentDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.title}</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <DiscAssessmentForm 
              template={selectedTemplate}
              onSubmit={handleSubmitAssessment}
              onCancel={handleCloseAssessment}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog for displaying results */}
      <Dialog 
        open={isResultDialogOpen && selectedResult !== null} 
        onOpenChange={setIsResultDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Resultado da Avaliação</DialogTitle>
          </DialogHeader>
          {selectedResult && (
            <DiscResultDisplay 
              result={selectedResult}
              onClose={handleCloseResult}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
