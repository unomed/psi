
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

interface AssessmentListHeaderProps {
  onSetupEmailTemplates: () => void;
}

export function AssessmentListHeader({ onSetupEmailTemplates }: AssessmentListHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <CardTitle>Avaliações Agendadas</CardTitle>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onSetupEmailTemplates}
        title="Configurar templates de email padrão"
      >
        <Settings className="h-4 w-4 mr-1" />
        Configurar Templates
      </Button>
    </div>
  );
}
