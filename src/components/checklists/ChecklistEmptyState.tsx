
import { ClipboardCheck, ClipboardList, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChecklistEmptyStateProps {
  type: "templates" | "results";
  onCreateTemplate?: () => void;
  onSwitchTab?: () => void;
}

export function ChecklistEmptyState({ 
  type, 
  onCreateTemplate, 
  onSwitchTab 
}: ChecklistEmptyStateProps) {
  if (type === "templates") {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <ClipboardCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Nenhum modelo cadastrado</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Cadastre modelos de checklist para avaliação psicossocial baseados em metodologias
            como DISC para identificação de riscos e compatibilidade de perfis.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onCreateTemplate}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Modelo
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center h-64 border rounded-lg">
      <div className="text-center">
        <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhum resultado registrado</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Realize avaliações utilizando os modelos de checklist cadastrados para visualizar resultados
          e relatórios de perfil comportamental.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onSwitchTab}
        >
          Ir para Modelos
        </Button>
      </div>
    </div>
  );
}
