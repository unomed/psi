
import { PlusCircle, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmployeeHeaderProps {
  onCreateClick: () => void;
  onManageTagsClick: () => void;
}

export function EmployeeHeader({ onCreateClick, onManageTagsClick }: EmployeeHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os funcionários da empresa e suas informações.
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={onManageTagsClick} variant="outline">
          <Tags className="mr-2 h-4 w-4" />
          Gerenciar Tags
        </Button>
        <Button onClick={onCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Funcionário
        </Button>
      </div>
    </div>
  );
}
