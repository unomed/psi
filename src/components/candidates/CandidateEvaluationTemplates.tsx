
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Search, Filter, Plus, Eye, Calendar, Users, Brain } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CandidateSchedulingWorkflow } from "./CandidateSchedulingWorkflow";

interface CandidateEvaluationTemplatesProps {
  selectedCompany: string | null;
}

export function CandidateEvaluationTemplates({ selectedCompany }: CandidateEvaluationTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDiscDialogOpen, setIsDiscDialogOpen] = useState(false);
  const [isTemplateSelectionOpen, setIsTemplateSelectionOpen] = useState(false);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [notes, setNotes] = useState("");

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['candidate-templates', selectedCompany],
    queryFn: async () => {
      let query = supabase
        .from('checklist_templates')
        .select('*')
        .eq('is_active', true);

      if (selectedCompany) {
        query = query.or(`company_id.eq.${selectedCompany},company_id.is.null`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompany
  });

  // Buscar candidatos (funcionários com tipo 'candidato')
  const { data: candidates = [] } = useQuery({
    queryKey: ['candidates', selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return [];
      
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, email, cpf')
        .eq('company_id', selectedCompany)
        .eq('employee_type', 'candidato')
        .eq('status', 'active');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompany
  });

  // Filtrar templates adequados para candidatos
  const candidateTemplates = templates.filter(template => {
    const isCandidateRelevant = 
      template.type === 'disc' || 
      template.type === 'custom' ||
      template.title.toLowerCase().includes('candidato') ||
      template.title.toLowerCase().includes('entrevista') ||
      template.description?.toLowerCase().includes('seleção');

    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || template.type === typeFilter;

    return isCandidateRelevant && matchesSearch && matchesType;
  });

  const templateCategories = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'disc', label: 'DISC' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const getTemplateTypeLabel = (type: string) => {
    switch (type) {
      case 'disc': return 'DISC';
      case 'custom': return 'Personalizado';
      default: return type;
    }
  };

  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case 'disc': return 'bg-blue-100 text-blue-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleScheduleDisc = async () => {
    if (selectedCandidates.length === 0) {
      toast.error("Selecione pelo menos um candidato");
      return;
    }

    if (!scheduleDate) {
      toast.error("Selecione uma data para o agendamento");
      return;
    }

    try {
      // Buscar template DISC padrão
      const { data: discTemplate } = await supabase
        .from('checklist_templates')
        .select('id')
        .eq('type', 'disc')
        .eq('is_standard', true)
        .single();

      if (!discTemplate) {
        toast.error("Template DISC padrão não encontrado");
        return;
      }

      // Buscar usuário atual
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData.user?.id;

      // Criar agendamentos para cada candidato
      const schedules = selectedCandidates.map(candidateId => ({
        employee_id: candidateId,
        template_id: discTemplate.id,
        scheduled_date: scheduleDate,
        status: 'scheduled',
        notes: notes || 'Avaliação DISC para candidato',
        created_by: currentUserId
      }));

      const { error } = await supabase
        .from('scheduled_assessments')
        .insert(schedules);

      if (error) throw error;

      toast.success(`Avaliação DISC agendada para ${selectedCandidates.length} candidato(s)`);
      setIsDiscDialogOpen(false);
      setSelectedCandidates([]);
      setScheduleDate("");
      setNotes("");
    } catch (error) {
      console.error('Erro ao agendar avaliação DISC:', error);
      toast.error("Erro ao agendar avaliação DISC");
    }
  };

  if (!selectedCompany) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para ver os templates de avaliação</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Templates de Avaliação para Candidatos</h2>
          <p className="text-muted-foreground">
            Templates específicos para avaliação e seleção de candidatos
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsSchedulingOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Avaliação
          </Button>
          <Button onClick={() => setIsTemplateSelectionOpen(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Novo Template
          </Button>
        </div>
      </div>

      {/* Card destacado para Avaliação DISC Padrão */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-800">Avaliação DISC Padrão</CardTitle>
                <CardDescription className="text-blue-600">
                  Avaliação de perfil comportamental baseada na metodologia DISC
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Recomendado
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Tempo: ~20-30 min</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span>{candidates.length} candidatos disponíveis</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Relatório automático</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">O que avalia:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="bg-red-50 text-red-700 px-2 py-1 rounded">Dominância</div>
                <div className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">Influência</div>
                <div className="bg-green-50 text-green-700 px-2 py-1 rounded">Estabilidade</div>
                <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Conformidade</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                size="lg" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsSchedulingOpen(true)}
                disabled={candidates.length === 0}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Avaliação Completa
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsDiscDialogOpen(true)}
                disabled={candidates.length === 0}
              >
                <Eye className="mr-2 h-4 w-4" />
                Agendamento Rápido
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {templateCategories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">Carregando templates...</p>
          </div>
        ) : candidateTemplates.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum template encontrado</p>
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Crie templates específicos para avaliação de candidatos'
              }
            </p>
          </div>
        ) : (
          candidateTemplates.map(template => (
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
                    <Button size="sm" className="flex-1">
                      <FileText className="mr-2 h-3 w-3" />
                      Usar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas dos Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {candidateTemplates.filter(t => t.type === 'disc').length}
              </p>
              <p className="text-sm text-muted-foreground">Templates DISC</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {candidateTemplates.filter(t => t.type === 'custom').length}
              </p>
              <p className="text-sm text-muted-foreground">Templates Personalizados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {candidateTemplates.filter(t => t.type === 'custom').length}
              </p>
              <p className="text-sm text-muted-foreground">Templates Personalizados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {candidateTemplates.filter(t => !t.company_id).length}
              </p>
              <p className="text-sm text-muted-foreground">Templates Padrão</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Dialog para agendar Avaliação DISC */}
      <Dialog open={isDiscDialogOpen} onOpenChange={setIsDiscDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Agendar Avaliação DISC
            </DialogTitle>
            <DialogDescription>
              Selecione os candidatos e defina a data para a avaliação comportamental DISC
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Seleção de candidatos */}
            <div>
              <Label className="text-base font-medium mb-3 block">
                Candidatos Disponíveis ({candidates.length})
              </Label>
              
              {candidates.length === 0 ? (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-600">Nenhum candidato encontrado</p>
                  <p className="text-sm text-gray-500">
                    Cadastre funcionários com tipo "candidato" para aparecerem aqui
                  </p>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto border rounded-lg">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`p-3 border-b last:border-b-0 cursor-pointer transition-colors ${
                        selectedCandidates.includes(candidate.id)
                          ? 'bg-blue-50 border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedCandidates(prev =>
                          prev.includes(candidate.id)
                            ? prev.filter(id => id !== candidate.id)
                            : [...prev, candidate.id]
                        );
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 border-2 rounded ${
                          selectedCandidates.includes(candidate.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedCandidates.includes(candidate.id) && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Data do agendamento */}
            <div>
              <Label htmlFor="schedule-date" className="text-base font-medium">
                Data do Agendamento
              </Label>
              <Input
                id="schedule-date"
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="mt-1"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="notes" className="text-base font-medium">
                Observações (opcional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Adicione observações sobre a avaliação..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Resumo da seleção */}
            {selectedCandidates.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Resumo do Agendamento</h4>
                <div className="text-sm text-blue-700">
                  <p><strong>{selectedCandidates.length}</strong> candidato(s) selecionado(s)</p>
                  <p><strong>Avaliação:</strong> DISC - Perfil Comportamental</p>
                  <p><strong>Duração estimada:</strong> 20-30 minutos por candidato</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDiscDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleScheduleDisc}
              disabled={selectedCandidates.length === 0 || !scheduleDate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Avaliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Seleção de Template */}
      <Dialog open={isTemplateSelectionOpen} onOpenChange={setIsTemplateSelectionOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Selecionar Template para Candidatos</DialogTitle>
            <DialogDescription>
              Escolha um template para criar avaliações para candidatos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Buscar templates disponíveis */}
            <TemplateSelectionGrid
              selectedCompany={selectedCompany}
              onTemplateSelect={(template) => {
                // Lógica para usar o template selecionado
                console.log('Template selecionado:', template);
                setIsTemplateSelectionOpen(false);
                toast.success(`Template "${template.title}" selecionado para candidatos`);
              }}
              typeFilter="all"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Agendamento Completo */}
      <CandidateSchedulingWorkflow 
        isOpen={isSchedulingOpen}
        onClose={() => setIsSchedulingOpen(false)}
        selectedCompany={selectedCompany}
      />
    </div>
  );
}

// Componente para seleção de templates
function TemplateSelectionGrid({ 
  selectedCompany, 
  onTemplateSelect, 
  typeFilter 
}: { 
  selectedCompany: string | null; 
  onTemplateSelect: (template: any) => void;
  typeFilter: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['candidate-template-selection', selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return [];
      
      let query = supabase
        .from('checklist_templates')
        .select('*')
        .eq('is_active', true);

      query = query.or(`company_id.eq.${selectedCompany},company_id.is.null`);

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompany
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

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtro de busca */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Grid de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum template encontrado</p>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Tente ajustar os filtros de busca'
                : 'Crie templates na página /templates primeiro'
              }
            </p>
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
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onTemplateSelect(template)}
                    >
                      <FileText className="mr-2 h-3 w-3" />
                      Usar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
