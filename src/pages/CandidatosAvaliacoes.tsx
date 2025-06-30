
import { CandidateEvaluationTemplates } from "@/components/candidates/CandidateEvaluationTemplates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CandidatosAvaliacoes() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Avaliações de Candidatos</h1>
          <p className="text-muted-foreground">
            Sistema completo de avaliação comportamental e técnica de candidatos
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates de Avaliação para Candidatos</CardTitle>
          <CardDescription>
            Configure e aplique avaliações personalizadas para processos seletivos, 
            incluindo testes comportamentais, técnicos e de adequação cultural
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CandidateEvaluationTemplates />
        </CardContent>
      </Card>
    </div>
  );
}
