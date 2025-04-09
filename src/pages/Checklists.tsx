
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { ChecklistTabs } from "@/components/checklists/ChecklistTabs";
import { ChecklistDialogs } from "@/components/checklists/ChecklistDialogs";

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
      
      <ChecklistTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        checklists={checklists}
        results={results}
        onEditTemplate={handleEditTemplate}
        onStartAssessment={handleStartAssessment}
        onViewResult={handleViewResult}
        onCreateTemplate={() => setIsFormDialogOpen(true)}
      />
      
      <ChecklistDialogs
        isFormDialogOpen={isFormDialogOpen}
        setIsFormDialogOpen={setIsFormDialogOpen}
        isAssessmentDialogOpen={isAssessmentDialogOpen}
        setIsAssessmentDialogOpen={setIsAssessmentDialogOpen}
        isResultDialogOpen={isResultDialogOpen}
        setIsResultDialogOpen={setIsResultDialogOpen}
        selectedTemplate={selectedTemplate}
        selectedResult={selectedResult}
        onSubmitTemplate={handleCreateTemplate}
        onSubmitAssessment={handleSubmitAssessment}
        onCloseAssessment={handleCloseAssessment}
        onCloseResult={handleCloseResult}
      />
    </div>
  );
}
