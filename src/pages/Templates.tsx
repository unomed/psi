import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Plus, Search, Filter, FileText, Users, Brain, TrendingUp, Eye, Edit, Calendar } from "lucide-react";
import { ChecklistTemplateWorkflow } from "@/components/checklists/ChecklistTemplateWorkflow";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CompanySelectorReal } from "@/components/dashboard/CompanySelectorReal";

export default function Templates() {
  const { userRole, userCompanies } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(() => {
    if (userRole !== 'superadmin' && userCompanies.length > 0) {
      return userCompanies[0].companyId;
    }
    return null;
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates', selectedCompanyId],
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
      return data || [];
    },
    enabled: !!selectedCompanyId || userRole === 'superadmin'
  });

  // Categorizar templates
  const categorizeTemplates = (templates: any[]) => {
    return {
      candidatos: templates.filter(t => 
        t.type === 'disc' || 
        t.title.toLowerCase().includes('candidato') ||
        t.title.toLowerCase().includes('entrevista') ||
        t.description?.toLowerCase().includes('seleção')
      ),
      funcionarios: templates.filter(t => 
        t.type === 'psicossocial' ||
        t.title.toLowerCase().includes('psicossocial') ||
        t.title.toLowerCase().includes('nr-01') ||
        t.title.toLowerCase().includes('funcionário')
      ),
      avaliacao360: templates.filter(t => 
        t.title.toLowerCase().includes('360') ||
        t.title.toLowerCase().includes('colegas') ||
        t.title.toLowerCase().includes('gestor') ||
        t.title.toLowerCase().includes('liderança')
      ),
      outros: templates.filter(t => 
        t.type === 'custom' && 
        !t.title.toLowerCase().includes('candidato') &&
        !t.title.toLowerCase().includes('psicossocial') &&
        !t.title.toLowerCase().includes('360')
      )
    };
  };

  const categorizedTemplates = categorizeTemplates(templates);

  // Filtrar templates
  const getFilteredTemplates = () => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = categorizedTemplates[categoryFilter as keyof typeof categorizedTemplates] || [];
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    return filtered;
  };

  const filteredTemplates = getFilteredTemplates();

  const handleCreateTemplate = async (templateData: any) => {
    try {
      const { data, error } = await supabase
        .from('checklist_templates')
        .insert([{
          ...templateData,
          company_id: selectedCompanyId,
          is_standard: false
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success("Template criado com sucesso!");
      setIsCreateDialogOpen(false);
      return true;
    } catch (error) {
      console.error("Erro ao criar template:", error);
      toast.error("Erro ao criar template");
      return false;
    }
  };

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

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId || null);
  };

  if (!selectedCompanyId && userRole !== 'superadmin') {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para gerenciar templates</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Templates de Avaliação</h1>
            <p className="text-muted-foreground">
              Crie, edite e gerencie templates para diferentes tipos de avaliação
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.href = '/agendamentos'}>
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Avaliações
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Template
            </Button>
          </div>
        </div>

        {/* Company Selector */}
        <CompanySelectorReal
          selectedCompanyId={selectedCompanyId}
          onCompanyChange={handleCompanyChange}
        />

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
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="candidatos">Candidatos</SelectItem>
              <SelectItem value="funcionarios">Funcionários</SelectItem>
              <SelectItem value="avaliacao360">Avaliação 360°</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
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

        {/* Templates por Categoria */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-slate-50 p-1 rounded-lg">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-blue-200 data-[state=active]:text-blue-800 data-[state=active]:border-blue-300 transition-all duration-200"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="candidatos"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100 data-[state=active]:to-green-200 data-[state=active]:text-green-800 data-[state=active]:border-green-300 transition-all duration-200"
            >
              <Users className="h-4 w-4 mr-2" />
              Candidatos
            </TabsTrigger>
            <TabsTrigger 
              value="funcionarios"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-100 data-[state=active]:to-purple-200 data-[state=active]:text-purple-800 data-[state=active]:border-purple-300 transition-all duration-200"
            >
              <Brain className="h-4 w-4 mr-2" />
              Funcionários
            </TabsTrigger>
            <TabsTrigger 
              value="avaliacao360"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-orange-200 data-[state=active]:text-orange-800 data-[state=active]:border-orange-300 transition-all duration-200"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              360°
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Candidatos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {categorizedTemplates.candidatos.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Templates para seleção</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {categorizedTemplates.funcionarios.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Templates psicossociais</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avaliação 360°</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {categorizedTemplates.avaliacao360.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Templates de feedback</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {templates.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Templates disponíveis</p>
                </CardContent>
              </Card>
            </div>

            {/* Templates Filtrados */}
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
                    {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all'
                      ? 'Tente ajustar os filtros de busca'
                      : 'Crie seu primeiro template de avaliação'
                    }
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Template
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
                        
                        {template.company_id ? (
                          <Badge variant="outline" className="text-xs">
                            Template da empresa
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Template padrão
                          </Badge>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="mr-2 h-3 w-3" />
                            Visualizar
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => window.location.href = `/templates/${template.id}/edit`}
                          >
                            <Edit className="mr-2 h-3 w-3" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Tabs por categoria */}
          {Object.entries(categorizedTemplates).map(([category, categoryTemplates]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTemplates.map((template: any) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Badge className={getTemplateTypeColor(template.type)}>
                          {getTemplateTypeLabel(template.type)}
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-3 w-3" />
                            Ver
                          </Button>
                          <Button size="sm">
                            <Edit className="mr-2 h-3 w-3" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Dialog de criação */}
        <ChecklistTemplateWorkflow
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateTemplate}
        />
      </div>
    </TooltipProvider>
  );
}