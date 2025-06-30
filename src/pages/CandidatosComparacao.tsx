
import { CandidateComparison } from "@/components/candidates/CandidateComparison";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CandidatosComparacao() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comparação de Candidatos</h1>
          <p className="text-muted-foreground">
            Compare perfis comportamentais e competências de candidatos
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Análise Comparativa de Candidatos</CardTitle>
          <CardDescription>
            Utilize ferramentas avançadas para comparar candidatos com base em avaliações comportamentais, 
            competências técnicas e adequação cultural
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CandidateComparison />
        </CardContent>
      </Card>
    </div>
  );
}
