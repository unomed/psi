
import { ChecklistResult, ChecklistTemplate } from "@/types/checklist";
import { ChecklistResultItem } from "@/components/checklists/ChecklistResultItem";

interface ResultsListProps {
  results: ChecklistResult[];
  templates: ChecklistTemplate[];
  onViewResult: (result: ChecklistResult) => void;
}

export function ResultsList({ results, templates, onViewResult }: ResultsListProps) {
  return (
    <div className="space-y-4">
      {results.map((result) => {
        const template = templates.find(t => t.id === result.templateId);
        return (
          <ChecklistResultItem
            key={result.id}
            result={result}
            template={template}
            onViewResult={onViewResult}
          />
        );
      })}
    </div>
  );
}
