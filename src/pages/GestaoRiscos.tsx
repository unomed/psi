/**
 * PÁGINA: Gestão de Riscos Psicossociais 
 * RESPONSABILIDADE: Monitoramento e automação (NÃO duplica critérios)
 * 
 * IMPORTANTE: Esta página CONSOME critérios de /configuracoes/criterios-avaliacao
 * NÃO DEVE duplicar configurações de matriz de risco ou critérios básicos
 * 
 * FUNCIONALIDADES:
 * - Overview: Dashboard de status do sistema
 * - Configurações: Apenas configs específicas de automação psicossocial
 * - Automação: Regras de processamento automático  
 * - Avançado: Configurações técnicas avançadas
 * - Monitoramento: Métricas em tempo real
 * 
 * INTEGRAÇÃO: 
 * - USA critérios de /configuracoes/criterios-avaliacao (fonte única)
 * - Foca em AUTOMAÇÃO e MONITORAMENTO, não em definição de critérios
 */
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, BarChart3, FileText, Settings, Brain, Zap } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { PsychosocialRiskConfigForm } from "@/components/risks/PsychosocialRiskConfigForm";
import { PsychosocialAdvancedConfig } from "@/components/risks/PsychosocialAdvancedConfig";
import { PsychosocialAutomationDashboard } from "@/components/risks/PsychosocialAutomationDashboard";
import { RealTimeMetrics } from "@/components/risks/RealTimeMetrics";

export default function GestaoRiscos() {
  const { selectedCompanyId } = useCompany();

  // Verificação se empresa está selecionada
  if (!selectedCompanyId) {
    return (
      <div className="text-center p-8">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Riscos Psicossociais</h1>
          <p className="text-muted-foreground">
            Configure análises automáticas, limites de risco e notificações conforme NR-01
          </p>
        </div>
        <div className="mt-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Selecione uma empresa</h3>
          <p className="text-muted-foreground">
            Para gerenciar riscos psicossociais, selecione uma empresa no canto superior direito.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Riscos Psicossociais</h1>
          <p className="text-muted-foreground">
            Configure análises automáticas, limites de risco e notificações conforme NR-01
          </p>
        </div>
      </div>


      {/* Tabs de Configuração */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Zap className="h-4 w-4 mr-2" />
            Automação
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Brain className="h-4 w-4 mr-2" />
            Avançado
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Monitoramento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Análises Automáticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Ativo</div>
                <p className="text-xs text-muted-foreground">Sistema funcionando</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Riscos Críticos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">0</div>
                <p className="text-xs text-muted-foreground">Último mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Planos de Ação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">2</div>
                <p className="text-xs text-muted-foreground">Em andamento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conformidade NR-01</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">95%</div>
                <p className="text-xs text-muted-foreground">Taxa de compliance</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Status do Sistema
                </CardTitle>
                <CardDescription>
                  Monitoramento em tempo real das análises automáticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Processamento automático</span>
                    <span className="text-sm text-green-600 font-medium">✓ Ativo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Notificações por email</span>
                    <span className="text-sm text-green-600 font-medium">✓ Ativo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Geração de planos de ação</span>
                    <span className="text-sm text-green-600 font-medium">✓ Ativo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Backup de dados</span>
                    <span className="text-sm text-green-600 font-medium">✓ Ativo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ações Recentes
                </CardTitle>
                <CardDescription>
                  Últimas atividades do sistema de análise de riscos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Avaliação processada automaticamente</span>
                    <span className="text-muted-foreground">2 min atrás</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plano de ação gerado</span>
                    <span className="text-muted-foreground">1 hora atrás</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notificação enviada para RH</span>
                    <span className="text-muted-foreground">3 horas atrás</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backup de dados realizado</span>
                    <span className="text-muted-foreground">1 dia atrás</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <PsychosocialRiskConfigForm selectedCompanyId={selectedCompanyId} />
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <PsychosocialAutomationDashboard selectedCompanyId={selectedCompanyId} />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <PsychosocialAdvancedConfig selectedCompanyId={selectedCompanyId} />
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <RealTimeMetrics selectedCompanyId={selectedCompanyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}