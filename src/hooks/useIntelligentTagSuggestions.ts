
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import type { EmployeeTagType } from "@/types/tags";

interface TagSuggestion {
  tagType: EmployeeTagType;
  confidence: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export function useIntelligentTagSuggestions(roleId?: string, employeeId?: string) {
  // Buscar tags obrigatórias da função
  const { data: requiredTags = [] } = useQuery({
    queryKey: ['role-required-tags', roleId],
    queryFn: async () => {
      if (!roleId) return [];
      
      const { data, error } = await supabase
        .from('role_required_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('role_id', roleId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!roleId
  });

  // Buscar tags que o funcionário já possui
  const { data: currentTags = [] } = useQuery({
    queryKey: ['employee-current-tags', employeeId],
    queryFn: async () => {
      if (!employeeId) return [];
      
      const { data, error } = await supabase
        .from('employee_tags')
        .select('tag_type_id')
        .eq('employee_id', employeeId);

      if (error) throw error;
      return data.map(t => t.tag_type_id);
    },
    enabled: !!employeeId
  });

  // Buscar estatísticas de tags por função (para IA)
  const { data: roleTagStats = [] } = useQuery({
    queryKey: ['role-tag-statistics', roleId],
    queryFn: async () => {
      if (!roleId) return [];
      
      // Simular análise de IA baseada em outros funcionários da mesma função
      const { data: otherEmployees, error } = await supabase
        .from('employees')
        .select(`
          id,
          employee_tags:employee_tags(
            tag_type_id,
            tag_type:employee_tag_types(*)
          )
        `)
        .eq('role_id', roleId)
        .neq('id', employeeId || '');

      if (error) throw error;

      // Calcular frequência de tags por função
      const tagFrequency: Record<string, { count: number; tagType: any }> = {};
      
      otherEmployees?.forEach(emp => {
        emp.employee_tags?.forEach((tag: any) => {
          const tagId = tag.tag_type_id;
          if (!tagFrequency[tagId]) {
            tagFrequency[tagId] = { count: 0, tagType: tag.tag_type };
          }
          tagFrequency[tagId].count++;
        });
      });

      return Object.entries(tagFrequency).map(([tagId, data]) => ({
        tagId,
        frequency: data.count / (otherEmployees?.length || 1),
        tagType: data.tagType
      }));
    },
    enabled: !!roleId
  });

  // Gerar sugestões inteligentes
  const suggestions = useMemo<TagSuggestion[]>(() => {
    const suggestions: TagSuggestion[] = [];
    const currentTagIds = new Set(currentTags);

    // 1. Tags obrigatórias em falta (prioridade alta)
    requiredTags.forEach(reqTag => {
      if (!currentTagIds.has(reqTag.tag_type_id)) {
        suggestions.push({
          tagType: reqTag.tag_type,
          confidence: 0.95,
          reason: `Tag obrigatória para a função ${reqTag.tag_type.name}`,
          priority: 'high'
        });
      }
    });

    // 2. Tags frequentes na função (IA baseada em padrões)
    roleTagStats
      .filter(stat => !currentTagIds.has(stat.tagId) && stat.frequency > 0.6)
      .forEach(stat => {
        const confidence = Math.min(0.9, stat.frequency + 0.2);
        suggestions.push({
          tagType: stat.tagType,
          confidence,
          reason: `${Math.round(stat.frequency * 100)}% dos funcionários desta função possuem esta competência`,
          priority: stat.frequency > 0.8 ? 'high' : 'medium'
        });
      });

    // 3. Tags complementares (baseado em análise de gaps)
    roleTagStats
      .filter(stat => !currentTagIds.has(stat.tagId) && stat.frequency > 0.3 && stat.frequency <= 0.6)
      .forEach(stat => {
        suggestions.push({
          tagType: stat.tagType,
          confidence: 0.6,
          reason: `Competência valorizada na função (${Math.round(stat.frequency * 100)}% dos colegas possuem)`,
          priority: 'low'
        });
      });

    return suggestions.sort((a, b) => {
      // Ordenar por prioridade e depois por confiança
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.confidence - a.confidence;
    });
  }, [requiredTags, currentTags, roleTagStats]);

  return {
    suggestions,
    isLoading: false // As queries individuais já têm seus próprios isLoading
  };
}
