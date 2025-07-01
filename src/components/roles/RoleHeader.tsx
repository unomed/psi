
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface RoleHeaderProps {
  onCreateClick: () => void;
  canCreate: boolean;
}

export function RoleHeader({ onCreateClick, canCreate }: RoleHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Funções Organizacionais</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as funções, habilidades e perfis de risco psicossocial da sua empresa.
        </p>
      </div>
      {canCreate && (
        <Button onClick={onCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Função
        </Button>
      )}
    </div>
  );
}
