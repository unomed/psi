
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, Users, FileText, Mail, UserPlus, UsersIcon, Target } from "lucide-react";
import { SchedulingWorkflow } from "@/components/assessment-scheduling/SchedulingWorkflow";
import { ScheduledAssessmentsList } from "@/components/assessment-scheduling/ScheduledAssessmentsList";
import { AssessmentMetrics } from "@/components/assessment-scheduling/AssessmentMetrics";
import { EmailTemplateSection } from "@/components/assessment-scheduling/email-templates/EmailTemplateSection";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CompanySelectorReal } from "@/components/dashboard/CompanySelectorReal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AssessmentScheduling() {
  const { userRole, userCompanies } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(() => {
    if (userRole !== 'superadmin' && userCompanies.length > 0) {
      return userCompanies[0].companyId;
    }
    return null;
  });
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [schedulingType, setSchedulingType] = useState<'individual' | 'collective'>('individual');

  // Buscar templates disponíveis
  const { data: templates = [] } = useQuery({
    queryKey: ['templates-scheduling', selectedCompanyId],
    queryFn: async () => {
      let query = supabase
        .from('checklist_templates')
        .select('*')
        .eq('is_active', true);

      if (selectedCompanyId) {
        query = query.or(`company_id.eq.${selectedCompanyId},company_id.is.null`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId || userRole === 'superadmin'
  });

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId || null);
  };

  if (!selectedCompanyId && userRole !== 'superadmin') {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para agendar avaliações</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full max-w-none p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agendamento de Avaliações</h1>
            <p className="text-muted-foreground">
              Agende avaliações individuais ou coletivas usando templates existentes
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={schedulingType} onValueChange={(value: 'individual' | 'collective') => setSchedulingType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="collective">Coletivo</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsSchedulingOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        {/* Company Selector */}
        <div className="mb-6">
          <CompanySelectorReal
            selectedCompanyId={selectedCompanyId}
            onCompanyChange={handleCompanyChange}
          />
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-6">
            <TabsTrigger value="overview">
              <Calendar className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <Users className="h-4 w-4 mr-2" />
              Agendadas
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="w-full space-y-6">
            {/* Tipo de Agendamento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={schedulingType === 'individual' ? 'ring-2 ring-primary' : ''}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Agendamento Individual
                  </CardTitle>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1:1</div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Agende avaliações específicas para funcionários individuais
                  </p>
                  <Button 
                    variant={schedulingType === 'individual' ? 'default' : 'outline'}
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setSchedulingType('individual');
                      setIsSchedulingOpen(true);
                    }}
                  >
                    {schedulingType === 'individual' ? 'Agendar Agora' : 'Selecionar'}
                  </Button>
                </CardContent>
              </Card>

              <Card className={schedulingType === 'collective' ? 'ring-2 ring-primary' : ''}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Agendamento Coletivo
                  </CardTitle>
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">N:1</div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Agende a mesma avaliação para múltiplos funcionários
                  </p>
                  <Button 
                    variant={schedulingType === 'collective' ? 'default' : 'outline'}
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setSchedulingType('collective');
                      setIsSchedulingOpen(true);
                    }}
                  >
                    {schedulingType === 'collective' ? 'Agendar Agora' : 'Selecionar'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
                  <p className="text-xs text-muted-foreground">Disponíveis</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Candidatos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {templates.filter(t => t.type === 'disc').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Templates DISC</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {templates.filter(t => t.type === 'psicossocial').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Templates NR-01</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Personalizados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {templates.filter(t => t.type === 'custom').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Templates custom</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Summary */}
            <AssessmentMetrics />
          </TabsContent>

          <TabsContent value="templates" className="w-full space-y-6">
            {/* Templates Disponíveis para Agendamento */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Templates Disponíveis</h2>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/templates'}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Gerenciar Templates
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2">
                          {template.title}
                        </CardTitle>
                        <Badge 
                          variant={template.type === 'disc' ? 'default' : 
                                  template.type === 'psicossocial' ? 'destructive' : 'secondary'}
                        >
                          {template.type.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-3">
                        {template.description || 'Sem descrição disponível'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Tempo estimado:</span>
                          <span>{template.estimated_time_minutes || 30} min</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setIsSchedulingOpen(true)}
                          >
                            <Target className="mr-2 h-3 w-3" />
                            Agendar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="w-full">
            <ScheduledAssessmentsList />
          </TabsContent>

          <TabsContent value="email" className="w-full">
            <EmailTemplateSection />
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
