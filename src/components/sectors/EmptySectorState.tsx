
import { FolderKanban, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptySectorStateProps {
  noCompanySelected?: boolean;
  onAddClick: () => void;
}

export function EmptySectorState({ noCompanySelected = false, onAddClick }: EmptySectorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border rounded-lg p-8 h-64">
      <FolderKanban className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">
        {noCompanySelected 
          ? "Selecione uma empresa"
          : "Nenhum setor encontrado"
        }
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
        {noCompanySelected
          ? "Selecione uma empresa para visualizar e gerenciar seus setores"
          : "Os setores ajudam a organizar e avaliar diferentes áreas da empresa."
        }
      </p>
      {!noCompanySelected && (
        <Button onClick={onAddClick} variant="outline" className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar Setor
        </Button>
      )}
    </div>
  );
}
