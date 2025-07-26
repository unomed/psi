import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEmployeeAuthNative } from "@/contexts/EmployeeAuthNative";

interface EmployeeAssessmentFormProps {
  assessmentId?: string;
  employeeId: string;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'text' | 'scale';
  options?: { value: string; label: string }[];
}

interface ChecklistTemplate {
  id: string;
  title: string;
  description?: string;
  type: string;
  scale_type?: string;
  questions: {
    id: string;
    question_text: string;
    target_factor?: string;
    weight?: number;
  }[];
}

interface ScheduledAssessment {
  id: string;
  template_id: string;
  status: string;
}

// Função auxiliar para determinar o tipo de pergunta com base no tipo de escala
function determineQuestionType(scaleType: string): 'multiple_choice' | 'text' | 'scale' {
  switch (scaleType) {
    case 'yes_no':
    case 'likert':
    case 'frequency':
    case 'psicossocial':
      return 'multiple_choice';
    default:
      return 'multiple_choice';
  }
}

// Função auxiliar para gerar opções com base no tipo de escala
function getOptionsForQuestionType(scaleType: string): { value: string; label: string }[] {
  switch (scaleType) {
    case 'yes_no':
      return [
        { value: 'sim', label: 'Sim' },
        { value: 'nao', label: 'Não' }
      ];
    case 'likert':
      return [
        { value: '1', label: 'Discordo totalmente' },
        { value: '2', label: 'Discordo parcialmente' },
        { value: '3', label: 'Neutro' },
        { value: '4', label: 'Concordo parcialmente' },
        { value: '5', label: 'Concordo totalmente' }
      ];
    case 'frequency':
      return [
        { value: '1', label: 'Nunca' },
        { value: '2', label: 'Raramente' },
        { value: '3', label: 'Às vezes' },
        { value: '4', label: 'Frequentemente' },
        { value: '5', label: 'Sempre' }
      ];
    case 'psicossocial':
      return [
        { value: '1', label: 'Nunca' },
        { value: '2', label: 'Raramente' },
        { value: '3', label: 'Às vezes' },
        { value: '4', label: 'Frequentemente' },
        { value: '5', label: 'Sempre' }
      ];
    default:
      return [
        { value: '1', label: 'Opção 1' },
        { value: '2', label: 'Opção 2' },
        { value: '3', label: 'Opção 3' },
        { value: '4', label: 'Opção 4' },
        { value: '5', label: 'Opção 5' }
      ];
  }
}

export function EmployeeAssessmentForm({ assessmentId, employeeId }: EmployeeAssessmentFormProps) {
  const navigate = useNavigate();
  const { session } = useEmployeeAuthNative();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<ScheduledAssessment | null>(null);
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!assessmentId || !employeeId) return;

    const fetchAssessment = async () => {
      try {
        console.log(`[EmployeeAssessmentForm] Carregando avaliação: ${assessmentId} para funcionário: ${employeeId}`);
        
        console.log(`[EmployeeAssessmentForm] Buscando avaliação: ${assessmentId} para funcionário: ${employeeId}`);
        
        // Primeiro, buscar a avaliação agendada
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('scheduled_assessments')
          .select(`
            id,
            template_id,
            status
          `)
          .eq('id', assessmentId)
          .eq('employee_id', employeeId)
          .single();
          
        if (assessmentError || !assessmentData) {
          console.error("[EmployeeAssessmentForm] Erro ao carregar avaliação:", assessmentError);
          toast.error("Erro ao carregar avaliação. Por favor, tente novamente.");
          return;
        }
        
        console.log("[EmployeeAssessmentForm] Avaliação encontrada:", assessmentData);
        
        // Agora, buscar o template com as perguntas
        const { data: templateData, error: templateError } = await supabase
          .from('checklist_templates')
          .select(`
            *,
            questions(*)
          `)
          .eq('id', assessmentData.template_id)
          .single();
          
        if (templateError || !templateData) {
          console.error("[EmployeeAssessmentForm] Erro ao carregar template:", templateError);
          toast.error("Erro ao carregar questionário. Por favor, tente novamente.");
          return;
        }
        
        console.log("[EmployeeAssessmentForm] Template encontrado:", templateData);

        // Combinar os dados da avaliação e do template
        setAssessment(assessmentData);
        setTemplate(templateData);
        
        // Extrair perguntas do template
        console.log("Template completo:", templateData);
        console.log("Perguntas do template:", templateData.questions);
        
        // Determinar o tipo de escala e opções com base no tipo de template
        const questionType = 'multiple_choice';
        let options = [];
        
        // Determinar opções com base no tipo de template
        if (templateData.type === 'disc') {
          options = [
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5' }
          ];
        } else if (templateData.scale_type && templateData.scale_type.includes('yes_no')) {
          options = [
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' }
          ];
        } else if (templateData.scale_type && templateData.scale_type.includes('likert')) {
          options = [
            { value: '1', label: 'Discordo totalmente' },
            { value: '2', label: 'Discordo parcialmente' },
            { value: '3', label: 'Neutro' },
            { value: '4', label: 'Concordo parcialmente' },
            { value: '5', label: 'Concordo totalmente' }
          ];
        } else if (templateData.type === 'psicossocial' || (templateData.scale_type && templateData.scale_type.includes('psicossocial'))) {
          options = [
            { value: '1', label: '1 - Nunca/Quase nunca' },
            { value: '2', label: '2 - Raramente' },
            { value: '3', label: '3 - Às vezes' },
            { value: '4', label: '4 - Frequentemente' },
            { value: '5', label: '5 - Sempre/Quase sempre' }
          ];
        } else {
          options = [
            { value: '1', label: 'Opção 1' },
            { value: '2', label: 'Opção 2' },
            { value: '3', label: 'Opção 3' },
            { value: '4', label: 'Opção 4' },
            { value: '5', label: 'Opção 5' }
          ];
        }
        
        // Formatar as perguntas para o formato esperado pelo componente
        const formattedQuestions: Question[] = templateData.questions.map(q => ({
          id: q.id,
          text: q.question_text,
          type: questionType as 'multiple_choice',
          options: options
        }));
        
        console.log("Perguntas formatadas:", formattedQuestions);
        setQuestions(formattedQuestions);
        
        // Inicializar respostas vazias
        const initialAnswers: Record<string, string> = {};
        formattedQuestions.forEach((q: Question) => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
      } catch (error) {
        console.error("[EmployeeAssessmentForm] Erro ao carregar dados:", error);
        toast.error("Erro ao carregar questionário. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId, employeeId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Função para calcular o nível de risco com base nas respostas
  const calculateRiskLevel = (): string => {
    // Calcular média das respostas numéricas
    const numericResponses = Object.values(answers)
      .filter(value => !isNaN(Number(value)))
      .map(value => Number(value));

    console.log("[EmployeeAssessmentForm] Respostas numéricas:", numericResponses);

    if (numericResponses.length === 0) {
      console.log("[EmployeeAssessmentForm] Nenhuma resposta numérica encontrada");
      return "Não avaliado";
    }

    const average = numericResponses.reduce((sum, value) => sum + value, 0) / numericResponses.length;
    console.log("[EmployeeAssessmentForm] Média das respostas:", average);

    // Determinar nível de risco com base na média
    let riskLevel = "Não avaliado";
    if (average <= 2) {
      riskLevel = "Baixo";
    } else if (average <= 3.5) {
      riskLevel = "Médio";
    } else {
      riskLevel = "Alto";
    }
    
    console.log("[EmployeeAssessmentForm] Nível de risco calculado:", riskLevel);
    return riskLevel;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se todas as perguntas foram respondidas
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      toast.error(`Por favor, responda todas as ${unansweredQuestions.length} perguntas restantes.`);
      return;
    }
    
    if (!template) {
      toast.error("Erro: Template não encontrado.");
      return;
    }

    setSubmitting(true);
    try {
      console.log("[EmployeeAssessmentForm] Enviando respostas:", answers);
      console.log("[EmployeeAssessmentForm] Dados da sessão:", session?.employee);

      // Calcular o nível de risco
      const riskLevel = calculateRiskLevel();
      console.log("[EmployeeAssessmentForm] Nível de risco calculado:", riskLevel);
      
      // Usar APENAS os campos que existem na tabela assessment_responses
      const responsePayload = {
        template_id: template.id,
        employee_id: employeeId,
        response_data: answers,
        completed_at: new Date().toISOString()
      };
      
      console.log("[EmployeeAssessmentForm] Payload corrigido:", responsePayload);
      
      try {
        const { data: responseData, error: responseError } = await supabase
          .from('assessment_responses')
          .insert(responsePayload);

        if (responseError) {
          console.error("[EmployeeAssessmentForm] Erro ao salvar respostas:", responseError);
          throw responseError;
        }

        console.log("[EmployeeAssessmentForm] Resposta salva com sucesso:", responseData);
      } catch (error) {
        console.error("[EmployeeAssessmentForm] Erro ao salvar respostas:", error);
        toast.error("Erro ao salvar suas respostas. Tente novamente.");
        setSubmitting(false);
        return;
      }

      // Atualizar o status da avaliação para 'completed' com as novas colunas
      const updatePayload = {
        status: 'completed',
        completed_at: new Date().toISOString(),
        risk_level: riskLevel
      };
      
      try {
        const { error: updateError } = await supabase
          .from('scheduled_assessments')
          .update(updatePayload)
          .eq('id', assessmentId);

        if (updateError) {
          console.error("[EmployeeAssessmentForm] Erro ao atualizar status:", updateError);
          // Não falhar completamente se apenas a atualização de status falhar
        }
      } catch (error) {
        console.error("[EmployeeAssessmentForm] Erro ao atualizar status da avaliação:", error);
        // Não falhar completamente se apenas a atualização de status falhar
      }

      toast.success("Avaliação concluída com sucesso!");
      
      // Redirecionar para página de sucesso
      navigate('/portal/assessment/success');
    } catch (error) {
      console.error("[EmployeeAssessmentForm] Erro ao salvar respostas:", error);
      toast.error("Erro ao salvar respostas. Por favor, tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assessment || !template) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Avaliação não encontrada ou sem permissão para acessá-la.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/portal')}
            className="mt-4"
          >
            Voltar ao Portal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{template.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questions.length === 0 ? (
              <p className="text-center text-gray-500">Este questionário não possui perguntas.</p>
            ) : (
              questions.map((question, index) => (
                <div key={question.id} className="mb-6 last:mb-0">
                  <p className="font-medium mb-3">{index + 1}. {question.text}</p>
                  <div className="flex flex-col space-y-2">
                    {question.options?.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.value}
                          checked={answers[question.id] === option.value}
                          onChange={() => handleAnswerChange(question.id, option.value)}
                          className="accent-primary h-4 w-4"
                        />
                        <span className="text-sm md:text-base">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            )}
            
            <div className="pt-6">
              <Button 
                onClick={handleSubmit} 
                disabled={submitting || questions.length === 0}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : "Enviar Respostas"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
