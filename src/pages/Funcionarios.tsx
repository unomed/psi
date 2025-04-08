
import { Users } from "lucide-react";

export default function Funcionarios() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
        <p className="text-muted-foreground mt-2">
          Cadastro e acompanhamento dos funcionários e suas avaliações psicossociais.
        </p>
      </div>
      
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Gestão de Funcionários</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Registre funcionários, histórico de funções, condições especiais e acompanhe
            as avaliações de fatores de risco psicossocial.
          </p>
        </div>
      </div>
    </div>
  );
}
