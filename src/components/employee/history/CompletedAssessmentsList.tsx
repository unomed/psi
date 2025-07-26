import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
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
  template?: AssessmentTemplate;
  response_data?: Record<string, string | number | boolean>;
  raw_score?: number;
}

interface CompletedAssessmentsListProps {
  employeeId: string;
}

export function CompletedAssessmentsList({ employeeId }: CompletedAssessmentsListProps) {
  const [assessments, setAssessments] = useState<CompletedAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para calcular nível de risco baseado no raw_score (mesma lógica do sistema)
  const calculateRiskLevel = (rawScore: number | null, riskLevel: string | null) => {
    if (riskLevel && riskLevel.toLowerCase() !== 'null') {
      return riskLevel;
    }
    
    if (rawScore !== null && rawScore !== undefined) {
      if (rawScore >= 80) return 'Crítico';
      if (rawScore >= 60) return 'Alto';
      if (rawScore >= 40) return 'Médio';
      return 'Baixo';
    }
    
    return 'Não avaliado';
  };

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
        
        // Buscar avaliações concluídas na tabela assessment_responses (fonte única da verdade)
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessment_responses')
          .select(`
            id,
            template_id,
            employee_id,
            employee_name,
            completed_at,
            raw_score,
            risk_level,
            classification,
            dominant_factor,
            factors_scores,
            checklist_templates!inner(
              title,
              type,
              description
            )
          `)
          .eq('employee_id', employeeId)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false });

        if (assessmentError) {
          console.error("[CompletedAssessmentsList] Erro ao buscar avaliações:", assessmentError);
          setError("Erro ao carregar avaliações concluídas.");
          setLoading(false);
          return;
        }

        // Processar os dados diretos do assessment_responses
        if (assessmentData && assessmentData.length > 0) {
          const processedAssessments = assessmentData.map((assessment: any) => {
            return {
              id: assessment.id,
              template_id: assessment.template_id,
              employee_id: assessment.employee_id,
              employee_name: assessment.employee_name || 'Nome não disponível',
              status: 'completed',
              completed_at: assessment.completed_at,
              scheduled_date: assessment.completed_at,
              risk_level: calculateRiskLevel(assessment.raw_score, assessment.risk_level),
              template: {
                title: assessment.checklist_templates?.title || 'Título não disponível',
                type: assessment.checklist_templates?.type || 'Tipo não disponível',
                description: assessment.checklist_templates?.description
              },
              response_data: {
                raw_score: assessment.raw_score,
                dominant_factor: assessment.dominant_factor,
                classification: assessment.classification
              },
              raw_score: assessment.raw_score
            };
          });

          console.log("[CompletedAssessmentsList] Dados de avaliações processados:", processedAssessments);
          setAssessments(processedAssessments);
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

  // Função para determinar a cor do badge com base no nível de risco
  const getRiskBadgeColor = (riskLevel: string): string => {
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
      case 'crítico':
        return 'bg-red-200 text-red-900 hover:bg-red-200';
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
        const riskLevel = assessment.risk_level || 'Não avaliado';
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
                  {assessment.raw_score && (
                    <span className="text-sm text-gray-500">
                      Score: {assessment.raw_score}
                    </span>
                  )}
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
                  <span>Data: {new Date(assessment.completed_at).toLocaleDateString('pt-BR')}</span>
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