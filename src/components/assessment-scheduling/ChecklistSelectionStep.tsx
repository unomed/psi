
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Users, Star } from "lucide-react";
import { ChecklistTemplate } from "@/types";
import { STANDARD_QUESTIONNAIRE_TEMPLATES } from "@/data/standardQuestionnaires";
import { createStandardTemplate } from "@/data/standardQuestionnaires";

interface ChecklistSelectionStepProps {
  selectedChecklist: ChecklistTemplate | null;
  onChecklistSelect: (checklist: ChecklistTemplate) => void;
}

export function ChecklistSelectionStep({ 
  selectedChecklist, 
  onChecklistSelect 
}: ChecklistSelectionStepProps) {
  
  const getTemplateTypeLabel = (type: string) => {
    const types = {
      custom: "Personalizado",
      srq20: "SRQ-20",
      phq9: "PHQ-9",
      gad7: "GAD-7",
      mbi: "MBI",
      audit: "AUDIT",
      pss: "PSS",
      copsoq: "COPSOQ",
      jcq: "JCQ",
      eri: "ERI",
      disc: "DISC",
      psicossocial: "Psicossocial",
      personal_life: "Vida Pessoal",
      evaluation_360: "Avaliação 360°"
    };
    return types[type as keyof typeof types] || type;
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = createStandardTemplate(templateId);
    if (template) {
      onChecklistSelect(template);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecionar Checklist</h3>
        <p className="text-muted-foreground">
          Escolha o checklist que será enviado para a avaliação
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {STANDARD_QUESTIONNAIRE_TEMPLATES.map(template => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedChecklist?.title === template.name ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
                
                {selectedChecklist?.title === template.name && (
                  <Badge>Selecionado</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Padrão
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {getTemplateTypeLabel(template.type)}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {template.questions.length} questões
                </div>
                {template.estimatedTimeMinutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    ~{template.estimatedTimeMinutes} min
                  </div>
                )}
              </div>

              {template.instructions && (
                <div className="mt-3 p-3 bg-muted/50 rounded-md">
                  <p className="text-sm">{template.instructions}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
