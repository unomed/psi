
import { Building, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyCompanyStateProps {
  onCreateClick: () => void;
}

export function EmptyCompanyState({ onCreateClick }: EmptyCompanyStateProps) {
  return (
    <div className="flex items-center justify-center h-64 border rounded-lg">
      <div className="text-center">
        <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhuma empresa cadastrada</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Cadastre empresas para começar a gerenciar funcionários e avaliações.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onCreateClick}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar Empresa
        </Button>
      </div>
    </div>
  );
}
