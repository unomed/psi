
import { useState } from "react";
import { useEmployeeCompanyFilter } from "@/hooks/employees/useEmployeeCompanyFilter";
import { EmployeeCompanySelector } from "@/components/employees/EmployeeCompanySelector";
import { CandidateEvaluationTemplates } from "@/components/candidates/CandidateEvaluationTemplates";
import { CandidateErrorBoundary } from "@/components/ui/candidate-error-boundary";

export default function CandidatosAvaliacoes() {
  const { selectedCompany, handleCompanyChange, userCompanies } = useEmployeeCompanyFilter();

  return (
    <CandidateErrorBoundary>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Avaliações de Candidatos</h1>
          <p className="text-muted-foreground mt-2">
            Templates e ferramentas para avaliação comportamental e técnica de candidatos.
          </p>
        </div>
        
        <EmployeeCompanySelector
          selectedCompany={selectedCompany}
          onCompanyChange={handleCompanyChange}
          userCompanies={userCompanies}
        />
        
        <CandidateEvaluationTemplates selectedCompany={selectedCompany} />
      </div>
    </CandidateErrorBoundary>
  );
}
