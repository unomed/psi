
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, Users, Briefcase, Target, Heart, RefreshCw, Brain, Activity } from "lucide-react";
import { PREDEFINED_PSYCHOSOCIAL_TEMPLATES, createPsychosocialTemplate } from "@/data/psychosocialQuestionnaires";
import { STANDARD_QUESTIONNAIRE_TEMPLATES, createStandardTemplate } from "@/data/standardQuestionnaires";
import { getDefaultQuestions } from "@/services/checklist/templateUtils";

interface QuestionnaireTemplateSelectorProps {
  onSelectTemplate: (template: any) => void;
  onCancel: () => void;
}

export function QuestionnaireTemplateSelector({ onSelectTemplate, onCancel }: QuestionnaireTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const getTemplateIcon = (templateId: string) => {
    if (templateId.includes("disc")) return <Target className="h-5 w-5" />;
    if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) return <Brain className="h-5 w-5" />;
    if (templateId.includes("personal")) return <Heart className="h-5 w-5" />;
    if (templateId.includes("360")) return <RefreshCw className="h-5 w-5" />;
    if (templateId.includes("psicossocial")) return <Activity className="h-5 w-5" />;
    if (templateId.includes("ambiente_social")) return <Users className="h-5 w-5" />;
    if (templateId.includes("organizacao")) return <Briefcase className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const getTemplateColor = (templateId: string) => {
    if (templateId.includes("disc")) return "bg-orange-50 border-orange-200 hover:bg-orange-100";
    if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) return "bg-purple-50 border-purple-200 hover:bg-purple-100";
    if (templateId.includes("personal")) return "bg-pink-50 border-pink-200 hover:bg-pink-100";
    if (templateId.includes("360")) return "bg-indigo-50 border-indigo-200 hover:bg-indigo-100";
    if (templateId.includes("psicossocial")) return "bg-blue-50 border-blue-200 hover:bg-blue-100";
    if (templateId.includes("estresse")) return "bg-red-50 border-red-200 hover:bg-red-100";
    if (templateId.includes("ambiente_social")) return "bg-green-50 border-green-200 hover:bg-green-100";
    return "bg-gray-50 border-gray-200 hover:bg-gray-100";
  };

  // Combinar todos os templates disponíveis
  const allTemplates = [
    // Templates padrão de questionários
    ...STANDARD_QUESTIONNAIRE_TEMPLATES.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      categories: template.questions
        .filter((q): q is { category: string } => 
          typeof q === 'object' && q !== null && 'category' in q
        )
        .map(q => q.category)
        .filter((v, i, a) => a.indexOf(v) === i),
      type: 'standard'
    })),
    // Templates psicossociais existentes
    ...PREDEFINED_PSYCHOSOCIAL_TEMPLATES.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      categories: template.categories,
      type: 'psychosocial'
    }))
  ];

  const handleSelectTemplate = (templateId: string) => {
    const standardTemplate = STANDARD_QUESTIONNAIRE_TEMPLATES.find(t => t.id === templateId);
    
    if (standardTemplate) {
      // Template padrão
      const template = createStandardTemplate(templateId);
      if (template) {
        onSelectTemplate(template);
      }
    } else {
      // Template psicossocial existente
      const psychosocialTemplate = PREDEFINED_PSYCHOSOCIAL_TEMPLATES.find(t => t.id === templateId);
      if (psychosocialTemplate) {
        const questionnaireTemplate = createPsychosocialTemplate(
          psychosocialTemplate.name,
          psychosocialTemplate.categories
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {allTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-colors ${getTemplateColor(template.id)} ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                {getTemplateIcon(template.id)}
                {template.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium mb-2">Categorias/Fatores:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.categories.slice(0, 3).map((category, index) => (
                      <Badge key={`${template.id}-${index}`} variant="secondary" className="text-xs">
                        {String(category).replace('_', ' ')}
                      </Badge>
                    ))}
                    {template.categories.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.categories.length - 3} mais
                      </Badge>
                    )}
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
