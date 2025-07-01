
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuestionLoadingStatusProps {
  isLoading: boolean;
  error: string | null;
  questionsCount: number;
  templateType: string;
}

export function QuestionLoadingStatus({ 
  isLoading, 
  error, 
  questionsCount, 
  templateType 
}: QuestionLoadingStatusProps) {
  if (isLoading) {
    return (
      <Alert>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>
          Carregando perguntas padrão do banco de dados...
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar perguntas: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (questionsCount > 0) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription>
          {questionsCount} perguntas {templateType === 'psicossocial' ? 'psicossociais MTE' : 'padrão'} carregadas com sucesso!
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
