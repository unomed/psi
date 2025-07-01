
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

interface TemplatesEmptyStateProps {
  onCreateFromScratch: () => void;
  isCreatingTemplate: boolean;
}

export function TemplatesEmptyState({ 
  onCreateFromScratch, 
  isCreatingTemplate 
}: TemplatesEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Nenhum template encontrado</h3>
      <p className="text-muted-foreground mb-4">
        Tente ajustar os filtros de busca ou criar um novo questionário do zero.
      </p>
      <Button onClick={onCreateFromScratch} disabled={isCreatingTemplate}>
        <Plus className="h-4 w-4 mr-2" />
        Criar Novo Questionário
      </Button>
    </div>
  );
}
