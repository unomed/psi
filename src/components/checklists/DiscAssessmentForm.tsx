
import { ChecklistTemplate } from "@/types";
import { PsicossocialAssessmentForm } from "./PsicossocialAssessmentForm";

interface DiscAssessmentFormProps {
  template: ChecklistTemplate;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function DiscAssessmentForm({ template, onSubmit, onCancel }: DiscAssessmentFormProps) {
  console.log("Template recebido:", template);
  console.log("Tipo do template:", template.type);
  console.log("Número de questões:", template.questions?.length);

  // Simplificando: vamos tratar todos os templates como psicossocial por enquanto
  // Isso elimina problemas de mapeamento de tipos
  if (template.questions && template.questions.length > 0) {
    return (
      <PsicossocialAssessmentForm 
        template={template}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );
  }

  // Fallback se não houver questões
  return (
    <div className="text-center p-8">
      <h3 className="text-lg font-semibold mb-2">Questionário não disponível</h3>
      <p className="text-muted-foreground mb-4">
        Este questionário não possui perguntas configuradas.
      </p>
      <button 
        onClick={onCancel}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Voltar
      </button>
    </div>
  );
}
