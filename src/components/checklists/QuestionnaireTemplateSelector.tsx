
import { useState } from "react";
import { PREDEFINED_PSYCHOSOCIAL_TEMPLATES, createPsychosocialTemplate } from "@/data/psychosocialQuestionnaires";
import { STANDARD_QUESTIONNAIRE_TEMPLATES, createStandardTemplate } from "@/data/standardQuestionnaires";

// Componentes refatorados
import { TemplateSelectorHeader } from "./template-selector/TemplateSelectorHeader";
import { TemplateSelectionGrid } from "./template-selector/TemplateSelectionGrid";
import { TemplateSelectorActions } from "./template-selector/TemplateSelectorActions";

interface QuestionnaireTemplateSelectorProps {
  onSelectTemplate: (template: any) => void;
  onCancel: () => void;
}

export function QuestionnaireTemplateSelector({ onSelectTemplate, onCancel }: QuestionnaireTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const getTemplateTypeLabel = (templateId: string) => {
    if (templateId.includes("disc")) return "DISC";
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return "Psicossocial";
    if (templateId.includes("360")) return "360°";
    if (templateId.includes("personal")) return "Vida Pessoal";
    return "Saúde Mental";
  };

  // Combinar todos os templates disponíveis com categorias padronizadas
  const allTemplates = [
    // Templates padrão de questionários
    ...STANDARD_QUESTIONNAIRE_TEMPLATES.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      categories: template.categories || ['Geral'],
      type: 'standard',
      estimatedQuestions: template.questions.length || 10,
      estimatedTimeMinutes: template.estimatedTimeMinutes || 10,
      typeLabel: getTemplateTypeLabel(template.id)
    })),
    // Templates psicossociais existentes
    ...PREDEFINED_PSYCHOSOCIAL_TEMPLATES.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      categories: template.categories,
      type: 'psychosocial',
      estimatedQuestions: template.categories.length * 3,
      estimatedTimeMinutes: template.categories.length * 2,
      typeLabel: "Psicossocial"
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

  const handleContinue = () => {
    if (selectedTemplate) {
      handleSelectTemplate(selectedTemplate);
    }
  };

  return (
    <div className="space-y-6">
      <TemplateSelectorHeader />

      <TemplateSelectionGrid
        templates={allTemplates}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
        onUseTemplate={handleSelectTemplate}
      />

      <TemplateSelectorActions
        selectedTemplate={selectedTemplate}
        onCancel={onCancel}
        onContinue={handleContinue}
      />
    </div>
  );
}
