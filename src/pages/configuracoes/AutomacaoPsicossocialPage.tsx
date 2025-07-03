
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PsychosocialAutomationDashboard } from "@/components/risks/PsychosocialAutomationDashboard";
import { PsychosocialAdvancedConfig } from "@/components/risks/PsychosocialAdvancedConfig";
import { NotificationManager } from "@/components/automation/NotificationManager";
import { ProcessingJobsMonitor } from "@/components/automation/ProcessingJobsMonitor";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Activity, Settings, Brain } from "lucide-react";

export default function AutomacaoPsicossocialPage() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automação Psicossocial</h1>
          <p className="text-muted-foreground">
            Configure e monitore o processamento automático das avaliações psicossociais
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">
            <Settings className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Brain className="h-4 w-4 mr-2" />
            Inteligência Artificial
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="processing">
            <Activity className="h-4 w-4 mr-2" />
            Processamento
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <PsychosocialAutomationDashboard selectedCompanyId={companyId} />
        </TabsContent>
        
        <TabsContent value="ai">
          <PsychosocialAdvancedConfig selectedCompanyId={companyId} />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationManager />
        </TabsContent>
        
        <TabsContent value="processing">
          <ProcessingJobsMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
