
import { Settings } from "lucide-react";

export default function Configuracoes() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Configurações do sistema, níveis de risco, periodicidade e permissões.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Configurações do Sistema</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Configure níveis de risco psicossocial, periodicidade das avaliações,
            alertas e notificações, e gerencie permissões de acesso.
          </p>
        </div>
      </div>
    </div>
  );
}
