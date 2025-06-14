
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, BarChart3, FileText, Settings, Brain, Users, Bot, Activity, TrendingUp } from "lucide-react";
import RiskAnalysisFormIntegrated from "@/components/risks/RiskAnalysisFormIntegrated";
import { RiskAssessmentsTable } from "@/components/risks/RiskAssessmentsTable";
import RiskMatrixSettingsFormIntegrated from "@/components/risks/RiskMatrixSettingsFormIntegrated";
import { PsychosocialRiskAnalysis } from "@/components/risks/PsychosocialRiskAnalysis";
import { PsychosocialProcessingMonitor } from "@/components/risks/PsychosocialProcessingMonitor";
import { AutomationDashboard } from "@/components/dashboard/automation";
import { AdvancedAnalyticsDashboard } from "@/components/analytics/AdvancedAnalyticsDashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function GestaoRiscos() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Riscos</h1>
          <p className="text-muted-foreground">
            Análise e gerenciamento de riscos psicossociais conforme NR-01
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="psychosocial" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Análise
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Cálculos
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Avaliações
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AutomationDashboard companyId={companyId} />
        </TabsContent>

        <TabsContent value="analytics">
          <AdvancedAnalyticsDashboard companyId={companyId} />
        </TabsContent>

        <TabsContent value="psychosocial">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Análise de Riscos Psicossociais - NR-01
              </CardTitle>
              <CardDescription>
                Análise baseada no Manual de Fatores de Riscos Psicossociais do MTE e diretrizes da NR-01
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PsychosocialRiskAnalysis companyId={companyId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Processamento Automático
                </CardTitle>
                <CardDescription>
                  Monitor e controle do processamento automático das avaliações psicossociais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PsychosocialProcessingMonitor companyId={companyId} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Risco</CardTitle>
              <CardDescription>
                Calcule o nível de risco baseado na matriz configurada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskAnalysisFormIntegrated />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações de Risco</CardTitle>
              <CardDescription>
                Lista de todas as avaliações de risco realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskAssessmentsTable companyId={companyId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Risco</CardTitle>
              <CardDescription>
                Visualize estatísticas e tendências de risco
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Relatórios de risco em desenvolvimento...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <RiskMatrixSettingsFormIntegrated />
        </TabsContent>
      </Tabs>
    </div>
  );
}
