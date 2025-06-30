
import { ChecklistResult, ChecklistTemplate } from "@/types";
import { ChecklistResultItem } from "../ChecklistResultItem";

interface ResultsListProps {
  results: ChecklistResult[];
  templates: ChecklistTemplate[];
  onViewResult: (result: ChecklistResult) => void;
}

export function ResultsList({ results, templates, onViewResult }: ResultsListProps) {
  return (
    <div className="space-y-4">
      {results.map((result) => {
        // Use tanto template_id quanto templateId para compatibilidade
        const templateId = result.template_id || result.templateId;
        const template = templates.find(t => t.id === templateId);
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
