import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Users, Star } from "lucide-react";
import { ChecklistTemplate, SCALE_TYPES } from "@/types";
import { STANDARD_QUESTIONNAIRE_TEMPLATES } from "@/data/standardQuestionnaires";
import { createStandardTemplate } from "@/data/standardQuestionnaires";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChecklistSelectionStepProps {
  selectedChecklist: ChecklistTemplate | null;
  onChecklistSelect: (checklist: ChecklistTemplate) => void;
}

export function ChecklistSelectionStep({ 
  selectedChecklist, 
  onChecklistSelect 
}: ChecklistSelectionStepProps) {
  const [loading, setLoading] = useState(false);
  
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

  const handleTemplateSelect = async (templateId: string) => {
    setLoading(true);
    try {
      const templateData = STANDARD_QUESTIONNAIRE_TEMPLATES.find(t => t.id === templateId);
      if (!templateData) {
        throw new Error("Template não encontrado");
      }

      // Primeiro verificar se o template já existe na base de dados
      const { data: existingTemplate, error: fetchError } = await supabase
        .from('checklist_templates')
        .select('*')
        .eq('title', templateData.name)
        .eq('type', templateData.type as any)
        .maybeSingle();

      if (fetchError) {
        console.error('Erro ao buscar template existente:', fetchError);
      }

      let finalTemplate: ChecklistTemplate;

      if (existingTemplate) {
        // Se já existe, usar o template existente
        finalTemplate = {
          id: existingTemplate.id,
          name: existingTemplate.title,
          title: existingTemplate.title,
          description: existingTemplate.description || "",
          category: templateData.type,
          scale_type: SCALE_TYPES.LIKERT_5, // ✅ Usar constante correta
          questions: [],
          createdAt: new Date(existingTemplate.created_at),
          is_standard: existingTemplate.is_standard,
          is_active: existingTemplate.is_active,
          estimated_time_minutes: existingTemplate.estimated_time_minutes || 15,
          instructions: existingTemplate.instructions,
          created_at: existingTemplate.created_at,
          updated_at: existingTemplate.updated_at,
          version: existingTemplate.version || 1,
          type: templateData.type
        };
      } else {
        // Se não existe, criar e salvar o template
        const tempTemplate = createStandardTemplate(templateId);
        if (!tempTemplate) {
          throw new Error("Template não encontrado");
        }

        // Salvar template na base de dados
        const { data: savedTemplate, error: saveError } = await supabase
          .from('checklist_templates')
          .insert({
            title: tempTemplate.name,
            description: tempTemplate.description,
            type: tempTemplate.type,
            scale_type: tempTemplate.scale_type,
            is_standard: true,
            is_active: true,
            estimated_time_minutes: tempTemplate.estimated_time_minutes,
            instructions: tempTemplate.instructions
          } as any)
          .select()
          .single();

        if (saveError) {
          console.error('Erro ao salvar template:', saveError);
          throw new Error("Erro ao salvar template na base de dados");
        }

        // Salvar questões do template
        if (tempTemplate.questions && tempTemplate.questions.length > 0) {
          const questionsToInsert = tempTemplate.questions.map((question, index) => ({
            template_id: savedTemplate.id,
            question_text: typeof question === 'string' ? question : question.text || question.question_text || '',
            order_number: index + 1,
            target_factor: typeof question === 'object' && 'targetFactor' in question 
              ? String(question.targetFactor) 
              : typeof question === 'object' && 'category' in question 
                ? String(question.category) 
                : 'general',
            weight: typeof question === 'object' && 'weight' in question ? Number(question.weight) : 1
          }));

          const { error: questionsError } = await supabase
            .from('questions')
            .insert(questionsToInsert);

          if (questionsError) {
            console.error('Erro ao salvar questões:', questionsError);
          }
        }

        finalTemplate = {
          id: savedTemplate.id,
          name: savedTemplate.title,
          title: savedTemplate.title,
          description: savedTemplate.description || "",
          category: tempTemplate.type,
          scale_type: tempTemplate.scale_type,
          questions: tempTemplate.questions || [],
          createdAt: new Date(savedTemplate.created_at),
          is_standard: savedTemplate.is_standard,
          is_active: savedTemplate.is_active,
          estimated_time_minutes: savedTemplate.estimated_time_minutes || 15,
          instructions: savedTemplate.instructions,
          created_at: savedTemplate.created_at,
          updated_at: savedTemplate.updated_at,
          version: savedTemplate.version || 1,
          type: tempTemplate.type
        };
      }

      onChecklistSelect(finalTemplate);
      toast.success(`Template "${finalTemplate.name}" selecionado com sucesso!`);
    } catch (error) {
      console.error('Erro ao processar template:', error);
      toast.error("Erro ao processar template selecionado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecionar Checklist</h3>
        <p className="text-muted-foreground">
          Escolha o checklist que será enviado para a avaliação. O link será gerado automaticamente com o nome do questionário.
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {STANDARD_QUESTIONNAIRE_TEMPLATES.map(template => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedChecklist?.name === template.name ? 'ring-2 ring-primary' : ''
            } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
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
                
                {selectedChecklist?.name === template.name && (
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
                {template.estimated_time_minutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    ~{template.estimated_time_minutes} min
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
                  <strong>Link gerado:</strong> avaliacao.unomed.med.br/checklist/{template.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="text-center text-sm text-muted-foreground">
          Processando template selecionado...
        </div>
      )}
    </div>
  );
}
