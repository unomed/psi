import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Plus, Calendar, Users, FileText, Mail, UserPlus, UsersIcon, Target, Search, Filter, Eye } from "lucide-react";
import { SchedulingWorkflow } from "@/components/assessment-scheduling/SchedulingWorkflow";
import { CollectiveSchedulingWorkflow } from "@/components/assessment-scheduling/CollectiveSchedulingWorkflow";
import { ScheduledAssessmentsList } from "@/components/assessment-scheduling/ScheduledAssessmentsList";
import { AssessmentMetrics } from "@/components/assessment-scheduling/AssessmentMetrics";
import { EmailTemplateSection } from "@/components/assessment-scheduling/email-templates/EmailTemplateSection";
import { useCompany } from "@/contexts/CompanyContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Agendamentos() {
  const { selectedCompanyId } = useCompany();
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [schedulingType, setSchedulingType] = useState<'individual' | 'collective'>('individual');
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Verificação se empresa está selecionada
  if (!selectedCompanyId) {
    return (
      <div className="text-center p-8">
        <div>
          <h1 className="text-3xl font-bold">Agendamento de Avaliações</h1>
          <p className="text-muted-foreground">
            Agende avaliações individuais ou coletivas usando templates existentes
          </p>
        </div>
        <div className="mt-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Selecione uma empresa</h3>
          <p className="text-muted-foreground">
            Para agendar avaliações, selecione uma empresa no canto superior direito.
          </p>
        </div>
      </div>
    );
  }

  // Buscar apenas templates criados e salvos no banco (mesma consulta que /templates)
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates-for-scheduling', selectedCompanyId],
    queryFn: async () => {
      let query = supabase
        .from('checklist_templates')
        .select(`
          *,
          questions(id, question_text, order_number)
        `)
        .eq('is_active', true);

      if (selectedCompanyId) {
        query = query.or(`company_id.eq.${selectedCompanyId},company_id.is.null`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      // Só retornar templates que realmente existem no banco (não templates padrão não salvos)
      return (data || []).filter(template => template.id && template.title);
    },
    enabled: !!selectedCompanyId
  });

  const getTemplateTypeLabel = (type: string) => {
    switch (type) {
      case 'disc': return 'DISC';
      case 'psicossocial': return 'Psicossocial';
      case 'custom': return 'Personalizado';
      default: return type.toUpperCase();
    }
  };

  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case 'disc': return 'bg-blue-100 text-blue-800';
      case 'psicossocial': return 'bg-red-100 text-red-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtrar templates
  const getFilteredTemplates = () => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();

  return (
    <TooltipProvider>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agendamento de Avaliações</h1>
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
                <SelectItem value="individual">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Individual
                  </div>
                </SelectItem>
                <SelectItem value="collective">
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4" />
                    Coletivo
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsSchedulingOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>
        </div>


        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="overview">
              <Calendar className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="h-4 w-4 mr-2" />
              Selecionar Template
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <Users className="h-4 w-4 mr-2" />
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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

            {/* Métricas de Atividade */}
            <AssessmentMetrics />
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Selecionar Template para Agendamento</h2>
                  <p className="text-sm text-muted-foreground">
                    Escolha um template existente para criar um novo agendamento
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/templates'}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Gerenciar Templates
                </Button>
              </div>

              {/* Filtros */}
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="disc">DISC</SelectItem>
                    <SelectItem value="psicossocial">Psicossocial</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">Carregando templates...</p>
                  </div>
                ) : filteredTemplates.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Nenhum template encontrado</p>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || typeFilter !== 'all'
                        ? 'Tente ajustar os filtros de busca'
                        : 'Crie templates na página de Templates'
                      }
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/templates'}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Ir para Templates
                    </Button>
                  </div>
                ) : (
                  filteredTemplates.map(template => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg line-clamp-2">
                            {template.title}
                          </CardTitle>
                          <Badge className={getTemplateTypeColor(template.type)}>
                            {getTemplateTypeLabel(template.type)}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-3">
                          {template.description || 'Sem descrição disponível'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Perguntas:</span>
                            <span>{template.questions?.length || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Tempo estimado:</span>
                            <span>{template.estimated_time_minutes || 30} min</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="mr-2 h-3 w-3" />
                              Visualizar
                            </Button>
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
                  ))
                )}
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
        {schedulingType === 'collective' ? (
          <CollectiveSchedulingWorkflow 
            isOpen={isSchedulingOpen}
            onClose={() => setIsSchedulingOpen(false)}
          />
        ) : (
          <SchedulingWorkflow 
            isOpen={isSchedulingOpen}
            onClose={() => setIsSchedulingOpen(false)}
            schedulingType={schedulingType}
          />
        )}
      </div>
    </TooltipProvider>
  );
}