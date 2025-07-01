
import { Building2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCompanyStateProps {
  hasSearch: boolean;
  canCreate: boolean;
  onCreateNew: () => void;
}

export function EmptyCompanyState({ hasSearch, canCreate, onCreateNew }: EmptyCompanyStateProps) {
  return (
    <div className="flex items-center justify-center h-64 border rounded-lg">
      <div className="text-center">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">
          {hasSearch ? "Nenhuma empresa encontrada" : "Nenhuma empresa cadastrada"}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          {hasSearch 
            ? "Tente ajustar sua pesquisa para encontrar o que está procurando."
            : "Cadastre empresas e filiais, gerencie informações sobre o ramo de atividade e registre os responsáveis pelo PGR."}
        </p>
        {canCreate && (
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onCreateNew}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Empresa
          </Button>
        )}
      </div>
    </div>
  );
}
