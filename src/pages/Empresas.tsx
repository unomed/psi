
import { Building2 } from "lucide-react";

export default function Empresas() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as empresas e suas filiais, incluindo informações do PGR.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Gerenciamento de Empresas</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Cadastre empresas e filiais, gerencie informações sobre o ramo de atividade
            e registre os responsáveis pelo PGR.
          </p>
        </div>
      </div>
    </div>
  );
}
