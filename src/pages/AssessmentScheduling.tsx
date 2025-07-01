
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, FileText, Mail } from "lucide-react";
import { SchedulingWorkflow } from "@/components/assessment-scheduling/SchedulingWorkflow";
import { ScheduledAssessmentsList } from "@/components/assessment-scheduling/ScheduledAssessmentsList";
import { AssessmentMetrics } from "@/components/assessment-scheduling/AssessmentMetrics";
import { EmailTemplateSection } from "@/components/assessment-scheduling/email-templates/EmailTemplateSection";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AssessmentScheduling() {
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const { user } = useAuth();

  return (
    <TooltipProvider>
      <div className="w-full max-w-none p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agendamento de Avaliações</h1>
            <p className="text-muted-foreground">
              Gerencie e agende avaliações psicossociais para funcionários com automação completa
            </p>
          </div>
          <Button onClick={() => setIsSchedulingOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Avaliação
          </Button>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-6">
            <TabsTrigger value="overview">
              <Calendar className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <Users className="h-4 w-4 mr-2" />
              Agendadas
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Mail className="h-4 w-4 mr-2" />
              Email Templates
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <FileText className="h-4 w-4 mr-2" />
              Métricas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="w-full space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Agendamento Individual
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1:1</div>
                  <p className="text-xs text-muted-foreground">
                    Agende avaliações específicas para funcionários individuais
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setIsSchedulingOpen(true)}
                  >
                    Agendar Agora
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Agendamento em Lote
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">N:1</div>
                  <p className="text-xs text-muted-foreground">
                    Agende a mesma avaliação para múltiplos funcionários
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    disabled
                  >
                    Em Breve
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Templates Disponíveis
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">11</div>
                  <p className="text-xs text-muted-foreground">
                    Templates de avaliação padrão + personalizados
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => window.location.href = '/templates'}
                  >
                    Ver Templates
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Summary */}
            <ScheduledAssessmentsList />
          </TabsContent>

          <TabsContent value="scheduled" className="w-full">
            <ScheduledAssessmentsList />
          </TabsContent>

          <TabsContent value="templates" className="w-full">
            <EmailTemplateSection />
          </TabsContent>

          <TabsContent value="metrics" className="w-full">
            <AssessmentMetrics />
          </TabsContent>
        </Tabs>

        {/* Modal de agendamento */}
        <SchedulingWorkflow 
          isOpen={isSchedulingOpen}
          onClose={() => setIsSchedulingOpen(false)}
        />
      </div>
    </TooltipProvider>
  );
}
