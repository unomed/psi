
import React from "react";
import { AutomationRulesManager } from "@/components/automation/AutomationRulesManager";
import { useAuth } from "@/contexts/AuthContext";

export default function AutomacaoGestores() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Automação para Gestores</h1>
        <p className="text-muted-foreground">
          Configure regras inteligentes de automação, escalação e notificações personalizadas
        </p>
      </div>

      <AutomationRulesManager companyId={companyId} />
    </div>
  );
}
