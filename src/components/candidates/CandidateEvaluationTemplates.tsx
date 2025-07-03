import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, Users, Clock, CheckCircle, Eye, Mail, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CandidateSchedulingWorkflow } from "./CandidateSchedulingWorkflow";

interface CandidateEvaluationTemplatesProps {
  selectedCompany: string | null;
}

export function CandidateEvaluationTemplates({ selectedCompany }: CandidateEvaluationTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);

  // Buscar avaliações agendadas para candidatos
  const { data: scheduledAssessments = [], isLoading: isLoadingScheduled } = useQuery({
    queryKey: ['scheduled-candidate-assessments', selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return [];
      
      // Primeiro buscar candidatos da empresa
      const { data: candidates, error: candidatesError } = await supabase
        .from('employees')
        .select('id')
        .eq('company_id', selectedCompany)
        .eq('employee_type', 'candidato')
        .eq('status', 'active');
        
      if (candidatesError) throw candidatesError;
      if (!candidates || candidates.length === 0) return [];
      
      const candidateIds = candidates.map(c => c.id);
      
      const { data, error } = await supabase
        .from('scheduled_assessments')
        .select(`
          *,
          employees(
            id,
            name,
            email,
            phone,
            cpf
          ),
          checklist_templates(
            id,
            title,
            type,
            estimated_time_minutes
          )
        `)
        .in('employee_id', candidateIds)
        .order('scheduled_date', { ascending: true });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompany
  });

  // Buscar questionários respondidos por candidatos
  const { data: completedAssessments = [], isLoading: isLoadingCompleted } = useQuery({
    queryKey: ['completed-candidate-assessments', selectedCompany],
    queryFn: async () => {
      if (!selectedCompany) return [];
      
      // Primeiro buscar candidatos da empresa
      const { data: candidates, error: candidatesError } = await supabase
        .from('employees')
        .select('id')
        .eq('company_id', selectedCompany)
        .eq('employee_type', 'candidato')
        .eq('status', 'active');
        
      if (candidatesError) throw candidatesError;
      if (!candidates || candidates.length === 0) return [];
      
      const candidateIds = candidates.map(c => c.id);
      
      const { data, error } = await supabase
        .from('assessment_responses')
        .select(`
          *,
          employees(
            id,
            name,
            email,
            phone,
            cpf
          ),
          checklist_templates(
            id,
            title,
            type
          )
        `)
        .in('employee_id', candidateIds)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompany
  });

  const filteredScheduled = scheduledAssessments.filter((assessment: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      assessment.employees?.name?.toLowerCase().includes(searchLower) ||
      assessment.employees?.email?.toLowerCase().includes(searchLower) ||
      assessment.checklist_templates?.title?.toLowerCase().includes(searchLower)
    );
  });

  const filteredCompleted = completedAssessments.filter((assessment: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      assessment.employees?.name?.toLowerCase().includes(searchLower) ||
      assessment.employees?.email?.toLowerCase().includes(searchLower) ||
      assessment.checklist_templates?.title?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Agendado</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Em Andamento</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-200">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedCompany) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para ver as avaliações de candidatos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Avaliações de Candidatos</h2>
          <p className="text-muted-foreground">
            Gerencie avaliações agendadas e questionários respondidos por candidatos
          </p>
        </div>
        <Button 
          onClick={() => setIsSchedulingOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Nova Avaliação
        </Button>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar por candidato ou avaliação..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="agendados" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agendados" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agendados ({filteredScheduled.length})
          </TabsTrigger>
          <TabsTrigger value="respondidos" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Respondidos ({filteredCompleted.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agendados" className="space-y-4">
          {isLoadingScheduled ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando avaliações agendadas...</p>
            </div>
          ) : filteredScheduled.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Nenhuma avaliação agendada</p>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Nenhum resultado encontrado para sua busca'
                  : 'Agende avaliações para candidatos usando o botão "Nova Avaliação"'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScheduled.map((assessment: any) => (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <CardTitle className="text-lg">{assessment.employees?.name}</CardTitle>
                      </div>
                      {getStatusBadge(assessment.status)}
                    </div>
                    <CardDescription>
                      {assessment.checklist_templates?.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(assessment.scheduled_date)}</span>
                    </div>
                    
                    {assessment.employees?.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{assessment.employees.email}</span>
                      </div>
                    )}
                    
                    {assessment.employees?.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{assessment.employees.phone}</span>
                      </div>
                    )}

                    {assessment.checklist_templates?.estimated_time_minutes && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{assessment.checklist_templates.estimated_time_minutes} min</span>
                      </div>
                    )}

                    {assessment.employee_data && typeof assessment.employee_data === 'object' && 'notes' in assessment.employee_data && (
                      <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        <p className="font-medium">Observações:</p>
                        <p>{String(assessment.employee_data.notes)}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-3 w-3" />
                        Detalhes
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="respondidos" className="space-y-4">
          {isLoadingCompleted ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando questionários respondidos...</p>
            </div>
          ) : filteredCompleted.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Nenhum questionário respondido</p>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'Nenhum resultado encontrado para sua busca'
                  : 'Os questionários respondidos por candidatos aparecerão aqui'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompleted.map((assessment: any) => (
                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <CardTitle className="text-lg">{assessment.employees?.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Concluído
                      </Badge>
                    </div>
                    <CardDescription>
                      {assessment.checklist_templates?.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span>Respondido em {formatDate(assessment.completed_at)}</span>
                    </div>
                    
                    {assessment.employees?.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{assessment.employees.email}</span>
                      </div>
                    )}

                    {assessment.raw_score && (
                      <div className="text-sm">
                        <span className="font-medium">Score: </span>
                        <span className="text-primary">{assessment.raw_score.toFixed(1)}</span>
                      </div>
                    )}

                    {assessment.risk_level && (
                      <div className="text-sm">
                        <span className="font-medium">Nível de Risco: </span>
                        <Badge variant="outline" className={
                          assessment.risk_level === 'baixo' ? 'text-green-600 border-green-200' :
                          assessment.risk_level === 'medio' ? 'text-yellow-600 border-yellow-200' :
                          assessment.risk_level === 'alto' ? 'text-orange-600 border-orange-200' :
                          'text-red-600 border-red-200'
                        }>
                          {assessment.risk_level}
                        </Badge>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-3 w-3" />
                        Ver Resultado
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Relatório
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Agendamento */}
      <CandidateSchedulingWorkflow 
        isOpen={isSchedulingOpen}
        onClose={() => setIsSchedulingOpen(false)}
        selectedCompany={selectedCompany}
      />
    </div>
  );
}