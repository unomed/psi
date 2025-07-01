
import { UserRound, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyRoleStateProps {
  onCreateClick: () => void;
  canCreate?: boolean;
}

export function EmptyRoleState({ onCreateClick, canCreate = true }: EmptyRoleStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border rounded-lg p-8 h-64">
      <UserRound className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">Nenhuma função encontrada</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
        As funções definem os cargos, habilidades necessárias e níveis de risco psicossocial
        para avaliação dos colaboradores.
      </p>
      {canCreate && (
        <Button onClick={onCreateClick} variant="outline" className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar Função
        </Button>
      )}
      {!canCreate && (
        <p className="text-sm text-muted-foreground text-center max-w-md mt-4">
          Você não tem permissão para criar funções.
        </p>
      )}
    </div>
  );
}
