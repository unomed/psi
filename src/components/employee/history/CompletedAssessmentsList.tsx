import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AssessmentTemplate {
  title: string;
  type: string;
  description?: string;
}

interface CompletedAssessment {
  id: string;
  template_id: string;
  employee_id: string;
  employee_name: string;
  status: string;
  completed_at: string;
  scheduled_date: string;
  risk_level?: string;
  templates?: AssessmentTemplate;
  template?: AssessmentTemplate;
  response_data?: Record<string, string | number | boolean>;
}

interface CompletedAssessmentsListProps {
  employeeId: string;
}

export function CompletedAssessmentsList({ employeeId }: CompletedAssessmentsListProps) {
  const [assessments, setAssessments] = useState<CompletedAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletedAssessments = async () => {
      setLoading(true);
      setError(null);
      setAssessments([]);

      if (!employeeId) {
        console.error("[CompletedAssessmentsList] ID do funcionário não fornecido");
        setError("ID do funcionário não fornecido");
        setLoading(false);
        return;
      }

      try {
        console.log("[CompletedAssessmentsList] Buscando avaliações concluídas para o funcionário:", employeeId);
        
        // Verificar se as colunas risk_level e completed_at existem
        console.log("[CompletedAssessmentsList] Verificando se as colunas risk_level e completed_at existem");
        
        // Buscar avaliações concluídas com as novas colunas
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('scheduled_assessments')
          .select(`
            id,
            template_id,
            employee_id,
            employee_name,
            status,
            scheduled_date,
            completed_at,
            risk_level,
            templates:checklist_templates(
              title,
              type,
              description
            )
          `)
          .eq('employee_id', employeeId)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false });
        
        // Converter para o tipo correto
        const typedAssessmentData = assessmentData as unknown as CompletedAssessment[];

        if (assessmentError) {
          console.error("[CompletedAssessmentsList] Erro ao buscar avaliações:", assessmentError);
          setError("Erro ao carregar avaliações concluídas.");
          setLoading(false);
          return;
        }

        // Processar os dados para incluir as respostas
        if (typedAssessmentData && typedAssessmentData.length > 0) {
          const assessmentsWithResponses = await Promise.all(
            typedAssessmentData.map(async (assessment: CompletedAssessment) => {
              // Buscar as respostas para cada avaliação com o nível de risco
              // Usar any para evitar erros de tipagem enquanto as colunas são adicionadas
              const { data: responseData, error: responseError } = await supabase
                .from('assessment_responses')
                .select('response_data, risk_level, completed_at')
                .eq('template_id', assessment.template_id)
                .eq('employee_id', assessment.employee_id)
                .order('completed_at', { ascending: false })
                .limit(1)
                .single() as { data: any, error: any };
                
              console.log(`[CompletedAssessmentsList] Resposta para avaliação ${assessment.id}:`, responseData);

              if (responseError) {
                console.error("[CompletedAssessmentsList] Erro ao buscar respostas:", responseError);
              }

              // Converter response_data para o tipo correto
              const responseDataTyped = responseData?.response_data as Record<string, string | number | boolean> || {};
              
              // Usar o nível de risco da resposta se disponível, ou manter o da avaliação agendada
              const riskLevel = responseData?.risk_level || assessment.risk_level;
              console.log(`[CompletedAssessmentsList] Nível de risco para avaliação ${assessment.id}:`, riskLevel);
              
              const completedAssessment: CompletedAssessment = {
                ...assessment,
                response_data: responseDataTyped,
                template: assessment.templates,
                risk_level: riskLevel
              };
              
              return completedAssessment;
            })
          );

          console.log("[CompletedAssessmentsList] Avaliações processadas com sucesso:", assessmentsWithResponses.length);
          setAssessments(assessmentsWithResponses);
        } else {
          console.log("[CompletedAssessmentsList] Nenhuma avaliação concluída encontrada");
          setAssessments([]);
        }
      } catch (err) {
        console.error("[CompletedAssessmentsList] Erro ao buscar avaliações:", err);
        setError("Ocorreu um erro ao carregar as avaliações concluídas.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedAssessments();
  }, [employeeId]);

  // Função para obter o nível de risco da avaliação
  const getRiskLevel = (assessment: CompletedAssessment): string => {
    console.log("[CompletedAssessmentsList] Verificando nível de risco para:", assessment.id);
    
    // Usar o nível de risco armazenado no banco de dados
    if (assessment.risk_level && assessment.risk_level !== "null" && assessment.risk_level !== "undefined") {
      console.log("[CompletedAssessmentsList] Nível de risco encontrado na avaliação:", assessment.risk_level);
      return assessment.risk_level;
    }
    
    // Tentar calcular o nível de risco com base nas respostas (escala Likert 1-5)
    if (assessment.response_data && Object.keys(assessment.response_data).length > 0) {
      const numericResponses = Object.values(assessment.response_data)
        .filter(value => !isNaN(Number(value)))
        .map(value => Number(value));

      if (numericResponses.length > 0) {
        const average = numericResponses.reduce((sum, value) => sum + value, 0) / numericResponses.length;
        console.log("[CompletedAssessmentsList] Média calculada:", average);
        
        // Determinar nível de risco com base na média (escala Likert 1-5)
        // Convertendo para porcentagem para compatibilidade com as análises psicossociais
        const scorePercent = (average - 1) / 4 * 100; // Converte 1-5 para 0-100%
        
        let calculatedRisk = "Não avaliado";
        if (scorePercent >= 80) {
          calculatedRisk = "Alto";
        } else if (scorePercent >= 60) {
          calculatedRisk = "Médio";
        } else {
          calculatedRisk = "Baixo";
        }
        
        console.log("[CompletedAssessmentsList] Score percentual:", scorePercent, "Nível de risco calculado:", calculatedRisk);
        return calculatedRisk;
      }
    }
    
    // Caso não tenha sido definido (compatibilidade com dados antigos)
    console.log("[CompletedAssessmentsList] Não foi possível determinar o nível de risco");
    return "Não avaliado";
  };

  // Função para determinar a cor do badge com base no nível de risco
  const getRiskBadgeColor = (riskLevel: string): string => {
    console.log("[CompletedAssessmentsList] Determinando cor para nível de risco:", riskLevel);
    
    if (!riskLevel) {
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
    
    const normalizedRiskLevel = riskLevel.toLowerCase().trim();
    
    switch (normalizedRiskLevel) {
      case 'baixo':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'médio':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'alto':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">Você ainda não concluiu nenhuma avaliação.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => {
        const riskLevel = getRiskLevel(assessment);
        const riskBadgeColor = getRiskBadgeColor(riskLevel);
        
        return (
          <Card key={assessment.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 p-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">
                  {assessment.template?.title || "Avaliação"}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={riskBadgeColor}>
                    {riskLevel}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  <span>Concluído {assessment.completed_at && formatDistanceToNow(new Date(assessment.completed_at), { addSuffix: true, locale: ptBR })}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Agendado para: {new Date(assessment.scheduled_date).toLocaleDateString('pt-BR')}</span>
                </div>
                {assessment.template?.description && (
                  <p className="text-sm text-gray-600 mt-2">{assessment.template.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
