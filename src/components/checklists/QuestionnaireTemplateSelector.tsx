
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Users, Briefcase, Target } from "lucide-react";
import { PREDEFINED_PSYCHOSOCIAL_TEMPLATES, createPsychosocialTemplate } from "@/data/psychosocialQuestionnaires";
import { getDefaultQuestions } from "@/services/checklist/templateUtils";
import { ScaleType } from "@/types";

interface QuestionnaireTemplateSelectorProps {
  onSelectTemplate: (template: any) => void;
  onCancel: () => void;
}

export function QuestionnaireTemplateSelector({ onSelectTemplate, onCancel }: QuestionnaireTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case "avaliacao_completa":
        return <FileText className="h-5 w-5" />;
      case "estresse_ocupacional":
        return <Target className="h-5 w-5" />;
      case "ambiente_social":
        return <Users className="h-5 w-5" />;
      case "organizacao_trabalho":
        return <Briefcase className="h-5 w-5" />;
      case "disc_template":
        return <Target className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getTemplateColor = (templateId: string) => {
    switch (templateId) {
      case "avaliacao_completa":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100";
      case "estresse_ocupacional":
        return "bg-red-50 border-red-200 hover:bg-red-100";
      case "ambiente_social":
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case "organizacao_trabalho":
        return "bg-purple-50 border-purple-200 hover:bg-purple-100";
      case "disc_template":
        return "bg-orange-50 border-orange-200 hover:bg-orange-100";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  // Adicionar template DISC aos templates disponíveis
  const allTemplates = [
    {
      id: "disc_template",
      name: "Avaliação DISC Padrão",
      description: "Template com perguntas padrão para avaliação de perfil comportamental DISC",
      categories: ["D - Dominância", "I - Influência", "S - Estabilidade", "C - Conformidade"]
    },
    ...PREDEFINED_PSYCHOSOCIAL_TEMPLATES
  ];

  const handleSelectTemplate = (templateId: string) => {
    if (templateId === "disc_template") {
      // Criar template DISC com perguntas padrão
      const discQuestions = getDefaultQuestions("disc");
      const discTemplate = {
        title: "Avaliação DISC Padrão",
        description: "Avaliação de perfil comportamental baseada na metodologia DISC",
        type: "disc",
        scaleType: ScaleType.YesNo,
        questions: discQuestions
      };
      onSelectTemplate(discTemplate);
    } else {
      // Template psicossocial existente
      const template = PREDEFINED_PSYCHOSOCIAL_TEMPLATES.find(t => t.id === templateId);
      if (template) {
        const questionnaireTemplate = createPsychosocialTemplate(
          template.name,
          template.categories
        );
        onSelectTemplate(questionnaireTemplate);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Selecionar Template de Questionário</h2>
        <p className="text-muted-foreground">
          Escolha um template pré-definido para criar seu questionário
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-colors ${getTemplateColor(template.id)} ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getTemplateIcon(template.id)}
                {template.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Categorias incluídas:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.categories.map((categoryId) => (
                      <Badge key={categoryId} variant="secondary" className="text-xs">
                        {categoryId.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedTemplate === template.id && (
                  <div className="pt-2 border-t">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template.id);
                      }}
                      className="w-full"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Usar este Template
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={() => selectedTemplate && handleSelectTemplate(selectedTemplate)}
          disabled={!selectedTemplate}
        >
          Continuar com Template Selecionado
        </Button>
      </div>
    </div>
  );
}
