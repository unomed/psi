
import { useState } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import { CandidateEvaluationTemplates } from "@/components/candidates/CandidateEvaluationTemplates";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function CandidatosAvaliacoes() {
  const { selectedCompanyId } = useCompany();

  // Verificação se empresa está selecionada
  if (!selectedCompanyId) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Avaliações de Candidatos</h1>
          <p className="text-muted-foreground mt-2">
            Templates e ferramentas para avaliação comportamental e técnica de candidatos.
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">Selecione uma empresa</h3>
              <p className="text-muted-foreground">
                Para gerenciar avaliações de candidatos, selecione uma empresa no canto superior direito.
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
        <h1 className="text-3xl font-bold tracking-tight">Avaliações de Candidatos</h1>
        <p className="text-muted-foreground mt-2">
          Templates e ferramentas para avaliação comportamental e técnica de candidatos.
        </p>
      </div>
      
      <CandidateEvaluationTemplates selectedCompany={selectedCompanyId} />
    </div>
  );
}
