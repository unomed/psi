
import { Building2, FolderKanban, UserRound, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyRoleStateProps {
  noCompanySelected: boolean;
  noSectorSelected: boolean;
  onAddClick: () => void;
}

export function EmptyRoleState({ noCompanySelected, noSectorSelected, onAddClick }: EmptyRoleStateProps) {
  if (noCompanySelected) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Selecione uma empresa</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Para visualizar e gerenciar funções, primeiro selecione uma empresa no menu acima.
          </p>
        </div>
      </div>
    );
  }

  if (noSectorSelected) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Selecione um setor</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Para visualizar e gerenciar funções, selecione um setor da empresa no menu acima.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64 border rounded-lg">
      <div className="text-center">
        <UserRound className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhuma função cadastrada</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Cadastre as funções existentes neste setor com as habilidades requeridas
          e riscos psicossociais associados.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onAddClick}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar Função
        </Button>
      </div>
    </div>
  );
}
