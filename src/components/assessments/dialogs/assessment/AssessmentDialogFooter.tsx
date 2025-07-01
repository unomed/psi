
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface AssessmentDialogFooterProps {
  onSave: () => void;
  disabled: boolean;
}

export function AssessmentDialogFooter({ onSave, disabled }: AssessmentDialogFooterProps) {
  return (
    <div className="flex justify-end">
      <Button
        onClick={onSave}
        disabled={disabled}
      >
        <Save className="mr-2 h-4 w-4" />
        Salvar Avaliação
      </Button>
    </div>
  );
}
