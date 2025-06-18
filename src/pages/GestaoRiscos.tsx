
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, BarChart3, FileText, Settings, Brain, Bot } from "lucide-react";
import RiskAnalysisFormIntegrated from "@/components/risks/RiskAnalysisFormIntegrated";
import { RiskAssessmentsTable } from "@/components/risks/RiskAssessmentsTable";
import RiskMatrixSettingsFormIntegrated from "@/components/risks/RiskMatrixSettingsFormIntegrated";
import { PsychosocialRiskAnalysis } from "@/components/risks/PsychosocialRiskAnalysis";
import { PsychosocialProcessingMonitor } from "@/components/risks/PsychosocialProcessingMonitor";
import { useAuth } from "@/hooks/useAuth";

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

      <Tabs defaultValue="psychosocial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="psychosocial" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Análise NR-01
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
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </TabsTrigger>
        </TabsList>

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
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Cálculo de Risco Manual</CardTitle>
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
              <CardTitle>Histórico de Avaliações</CardTitle>
              <CardDescription>
                Lista de todas as avaliações de risco realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskAssessmentsTable companyId={companyId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Matriz de Risco</CardTitle>
              <CardDescription>
                Configure os parâmetros e critérios de avaliação de risco
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskMatrixSettingsFormIntegrated />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
