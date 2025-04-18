
import { Building2, FolderKanban, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptySectorStateProps {
  noCompanySelected: boolean;
  onAddClick: () => void;
}

export function EmptySectorState({ noCompanySelected, onAddClick }: EmptySectorStateProps) {
  if (noCompanySelected) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Selecione uma empresa</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Para visualizar e gerenciar setores, selecione uma empresa no menu acima.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64 border rounded-lg">
      <div className="text-center">
        <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhum setor cadastrado</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Cadastre os setores da empresa para mapear riscos psicossociais 
          específicos e registrar incidentes relacionados.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onAddClick}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar Setor
        </Button>
      </div>
    </div>
  );
}
