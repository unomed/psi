
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

interface TemplatesHeaderProps {
  onCreateFromScratch: () => void;
  isSubmitting: boolean;
  isCreatingTemplate: boolean;
}

export function TemplatesHeader({ 
  onCreateFromScratch, 
  isSubmitting, 
  isCreatingTemplate 
}: TemplatesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Templates de Questionários</h1>
        <p className="text-muted-foreground mt-2">
          Explore e utilize templates pré-definidos ou crie seus próprios questionários personalizados
        </p>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={onCreateFromScratch}
            className="flex items-center gap-2"
            disabled={isSubmitting || isCreatingTemplate}
          >
            <Plus className="h-4 w-4" />
            Criar do Zero
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Criar um questionário personalizado sem usar templates pré-definidos</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
