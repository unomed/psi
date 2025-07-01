
import { useState } from "react";
import { ChecklistTemplate } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Target, Brain, Activity, FileText, ArrowLeft } from "lucide-react";
import { getTemplateTypeDisplayName } from "@/services/checklist/templateUtils";
import { TemplateSelectionForScheduling } from "./TemplateSelectionForScheduling";

interface ChecklistSelectionStepProps {
  templates: ChecklistTemplate[];
  selectedTemplate: ChecklistTemplate | null;
  onSelectTemplate: (template: ChecklistTemplate) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ChecklistSelectionStep({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onNext,
  onBack
}: ChecklistSelectionStepProps) {
  const [useAdvancedSelection, setUseAdvancedSelection] = useState(true);

  // Se usar seleção avançada, usar o novo componente
  if (useAdvancedSelection) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Selecionar Template de Avaliação</h2>
            <p className="text-muted-foreground">
              Interface avançada com favoritos, filtros e preview
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setUseAdvancedSelection(false)}
            size="sm"
          >
            Usar Seleção Básica
          </Button>
        </div>

        <TemplateSelectionForScheduling
          selectedTemplate={selectedTemplate}
          onTemplateSelect={onSelectTemplate}
          onBack={onBack}
        />
      </div>
    );
  }

  // Seleção básica original (mantida como fallback)
  const [filter, setFilter] = useState<string>("all");

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case "disc": return <Target className="h-5 w-5" />;
      case "psicossocial": return <Activity className="h-5 w-5" />;
      case "srq20":
      case "phq9":
      case "gad7":
      case "mbi":
      case "audit":
      case "pss": return <Brain className="h-5 w-5" />;
      case "evaluation_360": return <Users className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getTemplateColor = (type: string) => {
    switch (type) {
      case "disc": return "bg-orange-50 border-orange-200 hover:bg-orange-100";
      case "psicossocial": return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      case "srq20":
      case "phq9":
      case "gad7": return "bg-purple-50 border-purple-200 hover:bg-purple-100";
      case "mbi":
      case "audit":
      case "pss": return "bg-red-50 border-red-200 hover:bg-red-100";
      case "evaluation_360": return "bg-green-50 border-green-200 hover:bg-green-100";
      default: return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  const filteredTemplates = filter === "all" 
    ? templates 
    : templates.filter(t => t.type === filter);

  const getEstimatedQuestions = (template: ChecklistTemplate): number => {
    if (template.questions && Array.isArray(template.questions)) {
      return template.questions.length;
    }
    
    // Estimativas baseadas no tipo quando não há perguntas carregadas
    switch (template.type) {
      case "psicossocial": return 49; // MTE completo
      case "disc": return 24;
      case "srq20": return 20;
      case "phq9": return 9;
      case "gad7": return 7;
      case "mbi": return 22;
      case "audit": return 10;
      case "pss": return 14;
      default: return template.estimatedTimeMinutes ? Math.round(template.estimatedTimeMinutes / 0.5) : 10;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold mb-2">Selecionar Template de Avaliação</h2>
          <p className="text-muted-foreground">
            Escolha o tipo de avaliação que será aplicada aos funcionários (Seleção Básica)
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setUseAdvancedSelection(true)}
          size="sm"
        >
          Usar Seleção Avançada
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          size="sm"
        >
          Todos
        </Button>
        <Button
          variant={filter === "disc" ? "default" : "outline"}
          onClick={() => setFilter("disc")}
          size="sm"
        >
          DISC
        </Button>
        <Button
          variant={filter === "psicossocial" ? "default" : "outline"}
          onClick={() => setFilter("psicossocial")}
          size="sm"
        >
          Psicossocial
        </Button>
        <Button
          variant={filter === "evaluation_360" ? "default" : "outline"}
          onClick={() => setFilter("evaluation_360")}
          size="sm"
        >
          360°
        </Button>
        <Button
          variant={filter === "custom" ? "default" : "outline"}
          onClick={() => setFilter("custom")}
          size="sm"
        >
          Personalizado
        </Button>
      </div>

      {/* Lista de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all ${getTemplateColor(template.type)} ${
              selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                {getTemplateIcon(template.type)}
                {template.title}
                {template.isStandard && (
                  <Badge variant="secondary" className="text-xs">Padrão</Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tipo:</span>
                  <Badge variant="outline" className="text-xs">
                    {getTemplateTypeDisplayName({ type: template.type })}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Perguntas:
                  </span>
                  <span className="font-medium">{getEstimatedQuestions(template)}</span>
                </div>

                {template.estimatedTimeMinutes && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Tempo:
                    </span>
                    <span className="font-medium">{template.estimatedTimeMinutes} min</span>
                  </div>
                )}

                {/* Informações específicas do tipo */}
                {template.type === "psicossocial" && (
                  <div className="mt-2 p-2 bg-blue-100 rounded text-xs">
                    <strong>NR-01:</strong> Conforme Guia MTE de Fatores Psicossociais
                  </div>
                )}

                {template.type === "evaluation_360" && template.isAnonymous && (
                  <div className="mt-2 p-2 bg-green-100 rounded text-xs">
                    <strong>Anônima:</strong> Identidade dos avaliadores protegida
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum template encontrado para o filtro selecionado.</p>
        </div>
      )}

      {/* Navegação */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedTemplate}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
