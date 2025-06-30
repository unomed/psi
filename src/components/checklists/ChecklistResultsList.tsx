
import { ChecklistResult } from "@/types";
import { ChecklistResultItem } from "./ChecklistResultItem";

interface ChecklistResultsListProps {
  results: ChecklistResult[];
  onViewResult: (result: ChecklistResult) => void;
}

export function ChecklistResultsList({ results, onViewResult }: ChecklistResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum resultado encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Resultados de Avaliações</h2>
      <div className="space-y-2">
        {results.map((result) => (
          <ChecklistResultItem
            key={result.id}
            result={result}
            onViewResult={onViewResult}
          />
        ))}
      </div>
    </div>
  );
}
