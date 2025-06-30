
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { NR01ComplianceReport } from "@/components/reports/NR01ComplianceReport";
import { ActionPlanSummary } from "@/components/reports/ActionPlanSummary";  
import { RiskAnalysisSummary } from "@/components/reports/RiskAnalysisSummary";
import { EffectivenessMetrics } from "@/components/reports/EffectivenessMetrics";
import { FileText, Download, BarChart3, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function NR01Page() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;
  const [activeTab, setActiveTab] = useState("compliance");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatório NR-01</h1>
          <p className="text-muted-foreground">
            Geração de relatórios de conformidade com a NR-01
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <Tabs defaultValue="compliance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Conformidade
          </TabsTrigger>
          <TabsTrigger value="action-plans" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Planos de Ação
          </TabsTrigger>
          <TabsTrigger value="risk-analysis" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Análise de Risco
          </TabsTrigger>
           <TabsTrigger value="effectiveness" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Efetividade
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Relatório de Conformidade NR-01
              </CardTitle>
              <CardDescription>
                Visão geral da conformidade com os requisitos da NR-01
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Seletor de data em desenvolvimento...</p>
              </div>
              <NR01ComplianceReport />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action-plans">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Sumário dos Planos de Ação
              </CardTitle>
              <CardDescription>
                Resumo dos planos de ação implementados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Seletor de data em desenvolvimento...</p>
              </div>
              <ActionPlanSummary />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Sumário da Análise de Risco
              </CardTitle>
              <CardDescription>
                Visão geral das análises de risco realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Seletor de data em desenvolvimento...</p>
              </div>
              <RiskAnalysisSummary />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="effectiveness">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Métricas de Efetividade
              </CardTitle>
              <CardDescription>
                Métricas para avaliar a efetividade das ações implementadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Seletor de data em desenvolvimento...</p>
              </div>
              <EffectivenessMetrics />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Análise detalhada dos dados de conformidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
