
import { useState } from "react";
import { useEmployeeCompanyFilter } from "@/hooks/employees/useEmployeeCompanyFilter";
import { EmployeeCompanySelector } from "@/components/employees/EmployeeCompanySelector";
import { CandidateComparison } from "@/components/candidates/CandidateComparison";

export default function CandidatosComparacao() {
  const { selectedCompany, handleCompanyChange, userCompanies } = useEmployeeCompanyFilter();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comparação de Candidatos</h1>
        <p className="text-muted-foreground mt-2">
          Compare candidatos com base em competências comportamentais e adequação às funções.
        </p>
      </div>
      
      <EmployeeCompanySelector
        selectedCompany={selectedCompany}
        onCompanyChange={handleCompanyChange}
        userCompanies={userCompanies}
      />
      
      <CandidateComparison selectedCompany={selectedCompany} />
    </div>
  );
}
