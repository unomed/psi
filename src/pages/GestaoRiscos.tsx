
import { useState } from "react";
import { PsychosocialRiskAnalysis } from "@/components/risks/PsychosocialRiskAnalysis";
import { PsychosocialRiskConfigForm } from "@/components/risks/PsychosocialRiskConfigForm";
import { PsychosocialAutomationDashboard } from "@/components/risks/PsychosocialAutomationDashboard";
import { RiskMatrixEditor } from "@/components/risks/RiskMatrixEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GestaoRiscos() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Riscos Psicossociais</h1>
          <p className="text-muted-foreground">
            Sistema completo de análise e gestão de riscos psicossociais no ambiente de trabalho
          </p>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">Análise de Riscos</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
          <TabsTrigger value="configuration">Configurações</TabsTrigger>
          <TabsTrigger value="matrix">Matriz de Riscos</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Riscos Psicossociais</CardTitle>
              <CardDescription>
                Visualize e gerencie as análises de riscos identificados nas avaliações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PsychosocialRiskAnalysis />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard de Automação</CardTitle>
              <CardDescription>
                Monitore o processamento automatizado de riscos psicossociais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PsychosocialAutomationDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Riscos</CardTitle>
              <CardDescription>
                Configure thresholds, periodicidade e automações para análise de riscos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PsychosocialRiskConfigForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Editor de Matriz de Riscos</CardTitle>
              <CardDescription>
                Configure a matriz de riscos personalizada para sua organização
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskMatrixEditor />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
