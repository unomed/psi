import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistTemplate, ChecklistQuestion } from "@/types";

interface TemplatePreviewDialogProps {
  template: ChecklistTemplate;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePreviewDialog({ 
  template, 
  isOpen, 
  onClose 
}: TemplatePreviewDialogProps) {
  if (!template) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template não encontrado</DialogTitle>
            <DialogDescription>
              Não foi possível carregar os detalhes do template.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getScaleOptions = () => {
    const scaleType = template.scale_type;
    
    // ✅ Usar string literals diretamente:
    if (scaleType === 'likert_5') {
      return ["1 - Discordo totalmente", "2 - Discordo", "3 - Neutro", "4 - Concordo", "5 - Concordo totalmente"];
    } else if (scaleType === 'binary' || scaleType === 'yes_no') {
      return ["Sim", "Não"];
    } else if (scaleType === 'psicossocial') {
      return ["1 - Nunca", "2 - Raramente", "3 - Às vezes", "4 - Frequentemente", "5 - Sempre"];
    }
    
    return ["Opção 1", "Opção 2", "Opção 3"];
  };

  const getScaleDescription = () => {
    const scaleType = template.scale_type;
    
    // ✅ Usar string literals diretamente:
    if (scaleType === 'likert_5') {
      return "Escala Likert de 5 pontos";
    } else if (scaleType === 'binary' || scaleType === 'yes_no') {
      return "Resposta binária (Sim/Não)";
    } else if (scaleType === 'psicossocial') {
      return "Escala psicossocial de frequência";
    }
    
    return "Escala personalizada";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prévia: {template.name || template.title}</DialogTitle>
          <DialogDescription>
            Visualização de como o questionário será apresentado aos respondentes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{template.name || template.title}</CardTitle>
              {template.description && (
                <CardDescription>{template.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Tipo de escala:</span> {getScaleDescription()}
                </div>
                <div>
                  <span className="font-medium">Tempo estimado:</span> {template.estimated_time_minutes} minutos
                </div>
                <div>
                  <span className="font-medium">Total de questões:</span> {template.questions?.length || 0}
                </div>
                <div>
                  <span className="font-medium">Template padrão:</span> {template.is_standard ? 'Sim' : 'Não'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scale Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Opções de Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getScaleOptions().map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-gray-300 rounded-full" />
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Questions Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Questões do Formulário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {template.questions?.map((question, index) => (
                  <div key={question.id || index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Questão {index + 1}
                      </span>
                    </div>
                    <p className="text-sm mb-3">{question.question_text || question.text}</p>
                    <div className="space-y-1">
                      {getScaleOptions().slice(0, 3).map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <div className="w-3 h-3 border border-gray-300 rounded-full" />
                          <span>{option}</span>
                        </div>
                      ))}
                      {getScaleOptions().length > 3 && (
                        <div className="text-xs text-muted-foreground ml-5">
                          ... e mais {getScaleOptions().length - 3} opções
                        </div>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-muted-foreground py-8">
                    Nenhuma questão configurada neste template
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
