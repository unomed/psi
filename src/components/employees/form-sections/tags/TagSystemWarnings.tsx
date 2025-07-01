
import { AlertCircle } from "lucide-react";

interface TagSystemWarningsProps {
  hasDataIssues: boolean;
}

export function TagSystemWarnings({ hasDataIssues }: TagSystemWarningsProps) {
  if (!hasDataIssues) return null;

  return (
    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
      <div className="flex items-center gap-2 text-yellow-800">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Sistema de Tags não inicializado</span>
      </div>
      <p className="text-xs text-yellow-700 mt-1">
        Nenhum tipo de tag foi encontrado. Isso pode indicar que a migração não foi executada ou houve um problema na inicialização.
      </p>
    </div>
  );
}
