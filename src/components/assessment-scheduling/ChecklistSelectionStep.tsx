
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Users, Star } from "lucide-react";
import { ChecklistTemplate } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchChecklistTemplates } from "@/services/checklist";

interface ChecklistSelectionStepProps {
  selectedChecklist: ChecklistTemplate | null;
  onChecklistSelect: (checklist: ChecklistTemplate) => void;
}

export function ChecklistSelectionStep({ 
  selectedChecklist, 
  onChecklistSelect 
}: ChecklistSelectionStepProps) {
  const [loading, setLoading] = useState(false);
  
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['checklistTemplates'],
    queryFn: fetchChecklistTemplates
  });
  
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

  const handleTemplateSelect = async (template: ChecklistTemplate) => {
    setLoading(true);
    try {
      onChecklistSelect(template);
    } catch (error) {
      console.error('Erro ao processar template:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Selecionar Checklist</h3>
          <p className="text-muted-foreground">
            Carregando templates disponíveis...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecionar Checklist</h3>
        <p className="text-muted-foreground">
          Escolha o checklist que será enviado para a avaliação. O link será gerado automaticamente com o nome do questionário.
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {templates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum template disponível. O sistema está inicializando os templates padrão.
          </div>
        ) : (
          templates.map(template => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedChecklist?.id === template.id ? 'ring-2 ring-primary' : ''
              } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{template.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>
                  
                  {selectedChecklist?.id === template.id && (
                    <Badge>Selecionado</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  {template.isStandard && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Padrão
                    </Badge>
                  )}
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

                <div className="mt-3 p-2 bg-green-50 rounded-md border border-green-200">
                  <p className="text-xs text-green-700">
                    <strong>Link gerado:</strong> avaliacao.unomed.med.br/checklist/{template.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {loading && (
        <div className="text-center text-sm text-muted-foreground">
          Processando template selecionado...
        </div>
      )}
    </div>
  );
}
