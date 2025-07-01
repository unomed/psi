
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface TemplateSelectionHeaderProps {
  onBack: () => void;
}

export function TemplateSelectionHeader({ onBack }: TemplateSelectionHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
      <div>
        <h2 className="text-2xl font-bold">Selecionar Template de Avaliação</h2>
        <p className="text-muted-foreground">
          Escolha um template para criar a avaliação agendada (Templates padrão + seus templates customizados)
        </p>
      </div>
    </div>
  );
}
