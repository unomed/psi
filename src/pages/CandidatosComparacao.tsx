
import { useState } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import { CandidateComparison } from "@/components/candidates/CandidateComparison";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CandidatosComparacao() {
  const { selectedCompanyId } = useCompany();

  // Verificação se empresa está selecionada
  if (!selectedCompanyId) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comparação de Candidatos</h1>
          <p className="text-muted-foreground mt-2">
            Compare candidatos com base em competências comportamentais e adequação às funções.
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">Selecione uma empresa</h3>
              <p className="text-muted-foreground">
                Para comparar candidatos, selecione uma empresa no canto superior direito.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comparação de Candidatos</h1>
        <p className="text-muted-foreground mt-2">
          Compare candidatos com base em competências comportamentais e adequação às funções.
        </p>
      </div>
      
      <CandidateComparison selectedCompany={selectedCompanyId} />
    </div>
  );
}
