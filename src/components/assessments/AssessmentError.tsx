
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssessmentErrorProps {
  errorMessage: string;
}

export function AssessmentError({ errorMessage }: AssessmentErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-red-500">Erro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">{errorMessage}</p>
          <div className="flex justify-center">
            <Button onClick={() => window.location.href = "/"}>
              Voltar para o início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
