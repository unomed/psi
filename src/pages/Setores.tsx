
import { FolderKanban } from "lucide-react";

export default function Setores() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Setores</h1>
        <p className="text-muted-foreground mt-2">
          Mapeamento e análise de riscos psicossociais específicos por setor.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Gestão de Setores</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Mapeie riscos psicossociais por setor, registre incidentes relacionados 
            e mantenha um histórico de intervenções realizadas.
          </p>
        </div>
      </div>
    </div>
  );
}
