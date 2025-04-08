
import { UserRound } from "lucide-react";

export default function Funcoes() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Funções</h1>
        <p className="text-muted-foreground mt-2">
          Descrições de funções e análise de riscos psicossociais associados.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <UserRound className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Gestão de Funções</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Registre descrições detalhadas das funções incluindo demandas psicológicas,
            análise de riscos específicos e medidas preventivas recomendadas.
          </p>
        </div>
      </div>
    </div>
  );
}
