
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChecklistHeaderProps {
  onCreateTemplate: () => void;
}

export function ChecklistHeader({ onCreateTemplate }: ChecklistHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checklists e Avaliações</h1>
        <p className="text-muted-foreground">
          Gerencie templates, realize avaliações e visualize resultados
        </p>
      </div>
      <Button onClick={onCreateTemplate}>
        <Plus className="h-4 w-4 mr-2" />
        Novo Template
      </Button>
    </div>
  );
}
