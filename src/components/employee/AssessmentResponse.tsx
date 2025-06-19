import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { ChecklistResponseForm } from '@/components/checklists/ChecklistResponseForm';
import { supabase } from '@/integrations/supabase/client';
import { useEmployeeAuthNative } from '@/contexts/EmployeeAuthNative';
import { toast } from 'sonner';
import { ChecklistTemplateType } from '@/types/checklist';

interface AssessmentData {
  id: string;
  templateId: string;
  template: {
    id: string;
    title: string;
    description: string;
    type: ChecklistTemplateType;
    scale_type: string;
    questions: any[];
    createdAt: Date;
  };
  scheduledDate: string;
  dueDate?: string;
}

interface ChecklistTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  scale_type: string;
  is_standard: boolean;
  is_active: boolean;
  estimated_time_minutes: number;
  version: number;
  created_at: string;
  updated_at: string;
  createdAt: Date;
  type: ChecklistTemplateType;
  questions: any[];
}

export function AssessmentResponse() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { session } = useEmployeeAuthNative();
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockTemplate: ChecklistTemplate = {
    id: 'mock-template',
    name: 'Avaliação de Bem-estar no Trabalho',
    title: 'Avaliação de Bem-estar no Trabalho',
    description: 'Questionário para avaliar o bem-estar dos funcionários no ambiente de trabalho',
    category: 'psicossocial',
    scale_type: 'likert5',
    is_standard: true,
    is_active: true,
    estimated_time_minutes: 15,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    createdAt: new Date(),
    type: 'psicossocial',
    questions: []
  };

  useEffect(() => {
    if (!assessmentId || !session?.employee?.employeeId) {
      setError('Dados de acesso inválidos');
      setLoading(false);
      return;
    }

    loadAssessment();
  }, [assessmentId, session?.employee?.employeeId]);

  const loadAssessment = async () => {
    try {
      // First, get the scheduled assessment
      const { data: scheduledAssessment, error: scheduledError } = await supabase
        .from('scheduled_assessments')
        .select(`
          id,
          template_id,
          scheduled_date,
          due_date,
          status
        `)
        .eq('id', assessmentId)
        .eq('employee_id', session?.employee?.employeeId)
        .in('status', ['scheduled', 'sent'])
        .single();

      if (scheduledError) {
        console.error('Erro ao carregar avaliação agendada:', scheduledError);
        throw new Error('Avaliação não encontrada ou já foi concluída');
      }

      // Then get the template details
      const { data: template, error: templateError } = await supabase
        .from('checklist_templates')
        .select(`
          id,
          title,
          description,
          type,
          scale_type,
          created_at
        `)
        .eq('id', scheduledAssessment.template_id)
        .single();

      if (templateError) {
        console.error('Erro ao carregar template:', templateError);
        throw new Error('Template de avaliação não encontrado');
      }

      // Get the questions for this template
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('template_id', template.id)
        .order('order_number');

      if (questionsError) {
        console.error('Erro ao carregar perguntas:', questionsError);
        // Don't throw error here, some templates might not have questions in the database
      }

      setAssessment({
        id: scheduledAssessment.id,
        templateId: scheduledAssessment.template_id,
        template: {
          id: template.id,
          title: template.title,
          description: template.description || '',
          type: template.type as ChecklistTemplateType,
          scale_type: template.scale_type,
          questions: questions || [],
          createdAt: new Date(template.created_at)
        },
        scheduledDate: scheduledAssessment.scheduled_date,
        dueDate: scheduledAssessment.due_date
      });
    } catch (error: any) {
      console.error('Erro ao carregar avaliação:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (result: any) => {
    if (!assessment || !session?.employee) {
      toast.error('Dados de sessão inválidos');
      return;
    }

    try {
      setSubmitting(true);
      console.log('Salvando resposta da avaliação:', {
        assessmentId: assessment.id,
        employeeId: session.employee.employeeId,
        templateId: assessment.templateId
      });

      // Salvar resposta na tabela assessment_responses
      const { data: responseData, error: responseError } = await supabase
        .from('assessment_responses')
        .insert({
          template_id: assessment.templateId,
          employee_id: session.employee.employeeId,
          employee_name: session.employee.employeeName,
          response_data: result,
          factors_scores: result.results || {},
          dominant_factor: result.dominantFactor || 'D',
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (responseError) {
        console.error('Erro ao salvar resposta:', responseError);
        throw responseError;
      }

      // Atualizar status do agendamento para 'completed'
      const { error: updateError } = await supabase
        .from('scheduled_assessments')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', assessment.id);

      if (updateError) {
        console.error('Erro ao atualizar status:', updateError);
        // Não falhar aqui, pois a resposta já foi salva
      }

      toast.success('Avaliação concluída com sucesso!');
      
      // Aguardar um pouco e navegar de volta
      setTimeout(() => {
        navigate('/employee-portal', { replace: true });
      }, 1500);

    } catch (error: any) {
      console.error('Erro ao enviar resposta:', error);
      toast.error('Erro ao enviar resposta. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/employee-portal');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando avaliação...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Erro ao Carregar</h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={handleCancel} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Avaliação Não Encontrada</h3>
            <p className="text-sm text-gray-600 mb-4">
              Esta avaliação não existe ou já foi concluída.
            </p>
            <Button onClick={handleCancel} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Enviando Resposta...</h3>
            <p className="text-sm text-gray-600">
              Processando suas respostas. Aguarde um momento.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const templateForResults: ChecklistTemplate = {
    id: template.id,
    name: template.title,
    title: template.title,
    description: template.description || '',
    category: template.type,
    type: template.type,
    scale_type: template.scale_type,
    is_standard: false,
    is_active: true,
    estimated_time_minutes: 0,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    questions: template.questions || [],
    createdAt: new Date()
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button onClick={handleCancel} variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Portal
          </Button>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {assessment.template.title}
            </h1>
            {assessment.template.description && (
              <p className="text-gray-600 mb-4">
                {assessment.template.description}
              </p>
            )}
            <div className="flex gap-4 text-sm text-gray-500">
              <span>
                Agendada: {new Date(assessment.scheduledDate).toLocaleDateString('pt-BR')}
              </span>
              {assessment.dueDate && (
                <span>
                  Prazo: {new Date(assessment.dueDate).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Questionário de Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <ChecklistResponseForm
              template={templateForResults}
              onSubmit={handleSubmitResponse}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
