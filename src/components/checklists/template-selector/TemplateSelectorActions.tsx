
import { Button } from "@/components/ui/button";

interface TemplateSelectorActionsProps {
  selectedTemplate: string | null;
  onCancel: () => void;
  onContinue: () => void;
}

export function TemplateSelectorActions({ 
  selectedTemplate, 
  onCancel, 
  onContinue 
}: TemplateSelectorActionsProps) {
  return (
    <div className="flex justify-center gap-4 pt-4">
      <Button variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button 
        onClick={onContinue}
        disabled={!selectedTemplate}
      >
        Continuar com Template Selecionado
      </Button>
    </div>
  );
}
