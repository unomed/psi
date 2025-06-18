import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function AutomacaoGestores() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automação para Gestores</h1>
          <p className="text-muted-foreground">
            Ferramentas de automação para otimizar a gestão de riscos psicossociais
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Painel de Automação</CardTitle>
          <CardDescription>
            Visão geral das ferramentas de automação disponíveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidades de automação em desenvolvimento...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
