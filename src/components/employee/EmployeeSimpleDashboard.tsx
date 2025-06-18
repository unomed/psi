
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Assessment {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  dueDate: string;
  completedAt?: string;
  description?: string;
}

interface PendingAssessment {
  id: string;
  scheduled_date: string;
  status: string;
  checklist_template: {
    title: string;
    description?: string;
  };
}

interface EmployeeSimpleDashboardProps {
  templateId?: string;
  employeeId?: string;
}

export function EmployeeSimpleDashboard({ templateId, employeeId }: EmployeeSimpleDashboardProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const { data: pendingAssessments, isLoading } = useQuery({
    queryKey: ['employee-assessments', employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      
      const { data, error } = await supabase
        .from('scheduled_assessments')
        .select(`
          id,
          scheduled_date,
          status,
          checklist_template:checklist_templates(title, description)
        `)
        .eq('employee_id', employeeId)
        .eq('status', 'scheduled');

      if (error) throw error;
      return data as PendingAssessment[];
    },
    enabled: !!employeeId
  });

  useEffect(() => {
    if (pendingAssessments) {
      const formattedAssessments: Assessment[] = pendingAssessments.map(assessment => ({
        id: assessment.id,
        title: assessment.checklist_template?.title || 'Avaliação sem título',
        status: assessment.status === 'completed' ? 'completed' : 'pending' as 'pending' | 'completed',
        dueDate: assessment.scheduled_date,
        completedAt: undefined,
        description: assessment.checklist_template?.description || undefined
      }));

      setAssessments(formattedAssessments);
    }
  }, [pendingAssessments]);

  const handleStartAssessment = (assessmentId: string) => {
    toast.success('Iniciando avaliação...');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Portal do Funcionário</h1>
        <p className="text-muted-foreground">
          Suas avaliações e tarefas pendentes
        </p>
      </div>

      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessments">Avaliações</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Avaliações Pendentes
              </CardTitle>
              <CardDescription>Você tem {assessments.filter(a => a.status === 'pending').length} avaliação(ões) pendente(s)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessments.filter(a => a.status === 'pending').map((assessment) => (
                <div key={assessment.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{assessment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Prazo: {new Date(assessment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button onClick={() => handleStartAssessment(assessment.id)}>
                    Iniciar
                  </Button>
                </div>
              ))}
              {assessments.filter(a => a.status === 'pending').length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma avaliação pendente no momento.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Avaliações Concluídas
              </CardTitle>
              <CardDescription>Histórico das suas avaliações concluídas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessments.filter(a => a.status === 'completed').map((assessment) => (
                <div key={assessment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{assessment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Concluída em: {assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <Badge variant="outline">Concluída</Badge>
                  </div>
                </div>
              ))}
              {assessments.filter(a => a.status === 'completed').length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma avaliação concluída ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
              <CardDescription>Informações do seu perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Informações do perfil em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
