
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Settings, Activity, Cpu } from "lucide-react";
import { BackgroundProcessingMonitor } from "@/components/risks/processing-monitor/BackgroundProcessingMonitor";
import { AutomationTriggerConfig } from "@/components/risks/automation/AutomationTriggerConfig";
import { PsychosocialAdvancedConfig } from "@/components/risks/PsychosocialAdvancedConfig";
import { useAuth } from "@/contexts/AuthContext";

export default function AutomacaoAvancadaPage() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automação Avançada</h1>
          <p className="text-muted-foreground">
            Configurações avançadas do sistema de automação psicossocial
          </p>
        </div>
      </div>

      <Tabs defaultValue="processing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="processing" className="flex items-center gap-2">
            <Cpu className="h-4 w-4" />
            Processamento Background
          </TabsTrigger>
          <TabsTrigger value="triggers" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Triggers e Automação
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Configurações Avançadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monitor de Processamento em Background
              </CardTitle>
              <CardDescription>
                Acompanhe o status e controle o sistema de processamento automático
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BackgroundProcessingMonitor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers">
          <AutomationTriggerConfig companyId={companyId} />
        </TabsContent>

        <TabsContent value="advanced">
          <PsychosocialAdvancedConfig selectedCompanyId={companyId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
