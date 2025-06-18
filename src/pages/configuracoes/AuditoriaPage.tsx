import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditDashboard } from "@/components/audit/AuditDashboard";
import { useAuth } from "@/hooks/useAuth";

export default function AuditoriaPage() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Auditoria</h1>
          <p className="text-muted-foreground">
            Monitoramento e rastreamento de atividades no sistema
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard de Auditoria</CardTitle>
          <CardDescription>
            Visão geral das atividades de auditoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuditDashboard companyId={companyId} />
        </CardContent>
      </Card>
    </div>
  );
}
