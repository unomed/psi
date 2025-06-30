
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AutomationRulesManager } from "@/components/automation/AutomationRulesManager";
import { EscalationConfig } from "@/components/automation/EscalationConfig";
import { NotificationCenter } from "@/components/automation/NotificationCenter";
import { ReportsGenerator } from "@/components/automation/ReportsGenerator";
import { AdvancedAnalytics } from "@/components/automation/AdvancedAnalytics";
import { Bot, Settings, Bell, BarChart3, FileText, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AutomacaoAvancadaPage() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automação Avançada</h1>
          <p className="text-muted-foreground">
            Configurações avançadas para automação de processos
          </p>
        </div>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Regras de Automação
          </TabsTrigger>
          <TabsTrigger value="escalation" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Escalonamento
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Gerenciador de Regras de Automação
              </CardTitle>
              <CardDescription>
                Crie e gerencie regras para automatizar tarefas e processos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AutomationRulesManager companyId={companyId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Configurações de Escalonamento
              </CardTitle>
              <CardDescription>
                Defina as regras de escalonamento para garantir que os problemas sejam resolvidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EscalationConfig 
                companyId={companyId} 
                escalationLevels={[]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Central de Notificações
              </CardTitle>
              <CardDescription>
                Configure as notificações para manter todos informados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <p>Central de notificações em desenvolvimento...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Gerador de Relatórios
              </CardTitle>
              <CardDescription>
                Crie relatórios personalizados para acompanhar o desempenho
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportsGenerator companyId={companyId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
