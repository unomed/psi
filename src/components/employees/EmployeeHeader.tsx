
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeHeaderProps {
  onCreateClick: () => void;
}

export function EmployeeHeader({ onCreateClick }: EmployeeHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os funcionários da empresa e suas informações.
        </p>
      </div>
      <Button onClick={onCreateClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Novo Funcionário
      </Button>
    </div>
  );
}
