
import { ClipboardList } from "lucide-react";

export default function Avaliacoes() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
        <p className="text-muted-foreground mt-2">
          Aplicação e registro de avaliações psicossociais individuais e coletivas.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Gestão de Avaliações</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Aplique checklists de avaliação, registre entrevistas individuais e coletivas,
            documente observações in loco e classifique os riscos identificados.
          </p>
        </div>
      </div>
    </div>
  );
}
