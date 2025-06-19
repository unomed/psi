
import { Building2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCompanyStateProps {
  onCreate: () => void;
}

export function EmptyCompanyState({ onCreate }: EmptyCompanyStateProps) {
  return (
    <div className="flex items-center justify-center h-64 border rounded-lg">
      <div className="text-center">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhuma empresa cadastrada</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Cadastre empresas e filiais, gerencie informações sobre o ramo de atividade e registre os responsáveis pelo PGR.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onCreate}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar Primeira Empresa
        </Button>
      </div>
    </div>
  );
}
