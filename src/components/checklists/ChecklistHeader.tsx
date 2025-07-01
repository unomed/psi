
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ChecklistHeaderProps {
  onCreateNew: () => void;
}

export function ChecklistHeader({ onCreateNew }: ChecklistHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checklists</h1>
        <p className="text-muted-foreground mt-2">
          Modelos de avaliação psicossocial e questionários para identificação de riscos.
        </p>
      </div>
      <Button onClick={onCreateNew}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Novo Checklist
      </Button>
    </div>
  );
}
