import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Users, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistTemplate } from "@/types";

interface TemplateSelectionStepProps {
  selectedTemplate: ChecklistTemplate | null;
  onTemplateSelect: (template: ChecklistTemplate) => void;
}

export function TemplateSelectionStep({ selectedTemplate, onTemplateSelect }: TemplateSelectionStepProps) {
  const { data: templates, isLoading } = useQuery({
    queryKey: ['checklistTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checklist_templates')
        .select(`
          *,
          questions(count)
        `)
        .eq('is_active', true)
        .order('is_standard', { ascending: false })
        .order('title');

      if (error) throw error;
      
      // Transform database response to match ChecklistTemplate interface
      return data.map(template => ({
        id: template.id,
        title: template.title,
        description: template.description || '',
        type: template.type,
        questions: [], // Will be loaded separately if needed
        createdAt: new Date(template.created_at),
        scaleType: template.scale_type,
        isStandard: template.is_standard,
        companyId: template.company_id,
        derivedFromId: template.derived_from_id,
        estimatedTimeMinutes: template.estimated_time_minutes,
        instructions: template.instructions,
        interpretationGuide: template.interpretation_guide,
        maxScore: template.max_score,
        cutoffScores: template.cutoff_scores,
        isActive: template.is_active,
        version: template.version,
        updatedAt: template.updated_at ? new Date(template.updated_at) : undefined,
        createdBy: template.created_by,
        // Keep database field names for compatibility
        estimated_time_minutes: template.estimated_time_minutes,
        is_standard: template.is_standard,
        company_id: template.company_id,
        derived_from_id: template.derived_from_id,
        scale_type: template.scale_type,
        created_at: template.created_at,
        updated_at: template.updated_at,
        created_by: template.created_by,
        is_active: template.is_active,
        cutoff_scores: template.cutoff_scores,
        max_score: template.max_score,
        interpretation_guide: template.interpretation_guide
      })) as ChecklistTemplate[];
    }
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
      psicossocial: "Psicossocial"
    };
    return types[type as keyof typeof types] || type;
  };

  const getScaleTypeLabel = (scaleType: string) => {
    const scales = {
      likert5: "Likert 5 pontos",
      likert7: "Likert 7 pontos",
      binary: "Sim/Não",
      range10: "Escala 0-10",
      frequency: "Frequência",
      custom: "Personalizada",
      percentile: "Percentil",
      stanine: "Stanine",
      tscore: "T-Score"
    };
    return scales[scaleType as keyof typeof scales] || scaleType;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecionar Modelo de Avaliação</h3>
        <p className="text-muted-foreground">
          Escolha o template que será usado para a avaliação psicossocial
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="text-center py-8">Carregando templates...</div>
        ) : templates?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum template disponível
          </div>
        ) : (
          templates?.map(template => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{template.title}</CardTitle>
                      {template.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {selectedTemplate?.id === template.id && (
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
                  {template.scaleType && (
                    <Badge variant="outline" className="text-xs">
                      {getScaleTypeLabel(template.scaleType)}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Questões disponíveis
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
          ))
        )}
      </div>
    </div>
  );
}
