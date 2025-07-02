
import React from "react";
import { PsychosocialAutomationDashboard } from "@/components/risks/PsychosocialAutomationDashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function AutomacaoPsicossocialPage() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automação Psicossocial</h1>
          <p className="text-muted-foreground">
            Configure e monitore o processamento automático das avaliações psicossociais
          </p>
        </div>
      </div>

      <PsychosocialAutomationDashboard selectedCompanyId={companyId} />
    </div>
  );
}
