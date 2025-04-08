
import { Checklist } from "lucide-react";

export default function Checklists() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checklists</h1>
        <p className="text-muted-foreground mt-2">
          Modelos de avaliação psicossocial e questionários para identificação de riscos.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <Checklist className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Gestão de Checklists</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Crie e gerencie modelos de avaliação baseados em metodologias reconhecidas,
            questionários específicos e listas de verificação para identificação de fatores de risco.
          </p>
        </div>
      </div>
    </div>
  );
}
