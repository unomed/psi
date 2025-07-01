
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

interface CompetencyGap {
  category: string;
  missingTags: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  impact: string;
  recommendations: string[];
}

interface TrainingNeed {
  tagName: string;
  priority: number;
  estimatedTimeHours: number;
  suggestedResources: string[];
  deadline: string;
}

export function useCompetencyGapAnalysis(employeeId?: string, roleId?: string) {
  // Buscar dados completos do funcionário
  const { data: analysisData, isLoading } = useQuery({
    queryKey: ['competency-gap-analysis', employeeId, roleId],
    queryFn: async () => {
      if (!employeeId || !roleId) return null;

      // Buscar tags obrigatórias da função
      const { data: requiredTags, error: reqError } = await supabase
        .from('role_required_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('role_id', roleId);

      if (reqError) throw reqError;

      // Buscar tags atuais do funcionário
      const { data: currentTags, error: currentError } = await supabase
        .from('employee_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('employee_id', employeeId);

      if (currentError) throw currentError;

      // Buscar estatísticas de outros funcionários na mesma função
      const { data: roleStats, error: statsError } = await supabase
        .from('employees')
        .select(`
          id,
          employee_tags:employee_tags(
            tag_type_id,
            tag_type:employee_tag_types(*)
          )
        `)
        .eq('role_id', roleId)
        .neq('id', employeeId);

      if (statsError) throw statsError;

      return {
        requiredTags: requiredTags || [],
        currentTags: currentTags || [],
        roleStats: roleStats || []
      };
    },
    enabled: !!employeeId && !!roleId
  });

  // Análise de gaps
  const competencyGaps = useMemo<CompetencyGap[]>(() => {
    if (!analysisData) return [];

    const currentTagIds = new Set(analysisData.currentTags.map(t => t.tag_type_id));
    const gaps: CompetencyGap[] = [];

    // Agrupar gaps por categoria
    const gapsByCategory: Record<string, any[]> = {};

    analysisData.requiredTags.forEach(reqTag => {
      if (!currentTagIds.has(reqTag.tag_type_id)) {
        const category = reqTag.tag_type.category || 'general';
        if (!gapsByCategory[category]) {
          gapsByCategory[category] = [];
        }
        gapsByCategory[category].push(reqTag.tag_type);
      }
    });

    // Criar gaps estruturados
    Object.entries(gapsByCategory).forEach(([category, missingTags]) => {
      const severity = missingTags.length > 3 ? 'critical' : 
                      missingTags.length > 2 ? 'high' : 
                      missingTags.length > 1 ? 'medium' : 'low';

      gaps.push({
        category,
        missingTags: missingTags.map(tag => tag.name),
        severity,
        impact: `Faltam ${missingTags.length} competências obrigatórias em ${category}`,
        recommendations: [
          'Iniciar treinamento focado',
          'Definir plano de desenvolvimento',
          'Acompanhamento semanal'
        ]
      });
    });

    return gaps;
  }, [analysisData]);

  // Análise preditiva de necessidades de treinamento
  const trainingNeeds = useMemo<TrainingNeed[]>(() => {
    if (!analysisData) return [];

    const needs: TrainingNeed[] = [];
    const currentTagIds = new Set(analysisData.currentTags.map(t => t.tag_type_id));

    // Calcular necessidades baseadas em gaps obrigatórios
    analysisData.requiredTags.forEach(reqTag => {
      if (!currentTagIds.has(reqTag.tag_type_id)) {
        const priority = reqTag.is_mandatory ? 100 : 70;
        
        needs.push({
          tagName: reqTag.tag_type.name,
          priority,
          estimatedTimeHours: 20, // Estimativa base
          suggestedResources: [
            'Curso online especializado',
            'Mentoria interna',
            'Certificação profissional'
          ],
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
        });
      }
    });

    // Calcular frequência de tags na função para sugerir desenvolvimentos
    const tagFrequency: Record<string, number> = {};
    analysisData.roleStats.forEach(emp => {
      emp.employee_tags?.forEach((tag: any) => {
        tagFrequency[tag.tag_type_id] = (tagFrequency[tag.tag_type_id] || 0) + 1;
      });
    });

    // Adicionar necessidades baseadas em análise de mercado
    Object.entries(tagFrequency).forEach(([tagId, frequency]) => {
      if (!currentTagIds.has(tagId) && frequency > analysisData.roleStats.length * 0.5) {
        const tagType = analysisData.roleStats
          .flatMap(emp => emp.employee_tags || [])
          .find((tag: any) => tag.tag_type_id === tagId)?.tag_type;

        if (tagType) {
          needs.push({
            tagName: tagType.name,
            priority: Math.round((frequency / analysisData.roleStats.length) * 80),
            estimatedTimeHours: 15,
            suggestedResources: [
              'Workshop prático',
              'Projeto interno',
              'Curso de atualização'
            ],
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 dias
          });
        }
      }
    });

    return needs.sort((a, b) => b.priority - a.priority);
  }, [analysisData]);

  return {
    competencyGaps,
    trainingNeeds,
    isLoading,
    totalGaps: competencyGaps.reduce((sum, gap) => sum + gap.missingTags.length, 0),
    criticalGaps: competencyGaps.filter(gap => gap.severity === 'critical').length
  };
}
