
import { Users, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyEmployeeStateProps {
  onCreateClick: () => void;
}

export function EmptyEmployeeState({ onCreateClick }: EmptyEmployeeStateProps) {
  return (
    <div className="flex items-center justify-center h-64 border rounded-lg">
      <div className="text-center">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhum funcionário cadastrado</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Cadastre funcionários para começar a gerenciar suas informações.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onCreateClick}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Cadastrar Funcionário
        </Button>
      </div>
    </div>
  );
}
