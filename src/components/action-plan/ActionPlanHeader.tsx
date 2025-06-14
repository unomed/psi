
import { Button } from "@/components/ui/button";
import { Download, ListChecks } from "lucide-react";
import { toast } from "sonner";

export function ActionPlanHeader() {
  const handleNewAction = () => {
    toast.info("Criar nova ação");
  };

  const handleExportPlan = () => {
    toast.info("Exportar plano de ação");
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Plano de Ação</h1>
        <p className="text-muted-foreground mt-2">
          Gerenciamento de ações para controle de riscos.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleExportPlan}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        <Button onClick={handleNewAction}>
          <ListChecks className="mr-2 h-4 w-4" />
          Nova Ação
        </Button>
      </div>
    </div>
  );
}
