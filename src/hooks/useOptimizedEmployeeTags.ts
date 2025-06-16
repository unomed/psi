
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCallback, useMemo } from "react";
import type { EmployeeTag, EmployeeTagType } from "@/types/tags";

// Cache otimizado com invalidação inteligente
const TAG_CACHE_TIME = 5 * 60 * 1000; // 5 minutos
const TAG_STALE_TIME = 2 * 60 * 1000; // 2 minutos

interface UseOptimizedEmployeeTagsOptions {
  employeeId?: string;
  realTimeUpdates?: boolean;
  enableCache?: boolean;
}

export function useOptimizedEmployeeTags({
  employeeId,
  realTimeUpdates = true,
  enableCache = true
}: UseOptimizedEmployeeTagsOptions) {
  const queryClient = useQueryClient();

  // Query otimizada com cache inteligente
  const { data: employeeTags = [], isLoading, error } = useQuery({
    queryKey: ['optimized-employee-tags', employeeId],
    queryFn: async (): Promise<EmployeeTag[]> => {
      if (!employeeId) return [];
      
      console.log("[useOptimizedEmployeeTags] Buscando tags para funcionário:", employeeId);
      
      const { data, error } = await supabase
        .from('employee_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching optimized employee tags:", error);
        toast.error(`Erro ao carregar tags: ${error.message}`);
        throw error;
      }

      console.log("[useOptimizedEmployeeTags] Tags encontradas:", data);
      return data || [];
    },
    enabled: !!employeeId,
    staleTime: enableCache ? TAG_STALE_TIME : 0,
    gcTime: enableCache ? TAG_CACHE_TIME : 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  // Invalidação otimizada
  const invalidateEmployeeTags = useCallback(() => {
    queryClient.invalidateQueries({ 
      queryKey: ['optimized-employee-tags', employeeId],
      exact: true 
    });
    // Também invalidar queries relacionadas
    queryClient.invalidateQueries({ 
      queryKey: ['employee-tags'],
      exact: false 
    });
  }, [queryClient, employeeId]);

  // Mutation otimizada com cache update
  const addEmployeeTag = useMutation({
    mutationFn: async ({ tagTypeId, acquiredDate, notes }: {
      tagTypeId: string;
      acquiredDate?: string;
      notes?: string;
    }) => {
      if (!employeeId) throw new Error('Employee ID is required');
      
      console.log("[useOptimizedEmployeeTags] Adicionando tag:", { employeeId, tagTypeId });
      
      const { data, error } = await supabase
        .from('employee_tags')
        .insert({
          employee_id: employeeId,
          tag_type_id: tagTypeId,
          acquired_date: acquiredDate,
          notes
        })
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .single();

      if (error) {
        console.error("Error adding optimized employee tag:", error);
        throw error;
      }

      return data;
    },
    onMutate: async ({ tagTypeId }) => {
      // Cancelar queries em andamento
      await queryClient.cancelQueries({ queryKey: ['optimized-employee-tags', employeeId] });
      
      // Snapshot do estado anterior
      const previousTags = queryClient.getQueryData<EmployeeTag[]>(['optimized-employee-tags', employeeId]);
      
      // Update otimista (opcional)
      if (enableCache && previousTags) {
        const optimisticTag: EmployeeTag = {
          id: `temp-${Date.now()}`,
          employee_id: employeeId!,
          tag_type_id: tagTypeId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tag_type: { 
            id: tagTypeId, 
            name: 'Carregando...', 
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };
        
        queryClient.setQueryData(
          ['optimized-employee-tags', employeeId], 
          [...previousTags, optimisticTag]
        );
      }
      
      return { previousTags };
    },
    onError: (error: any, variables, context) => {
      // Reverter para estado anterior em caso de erro
      if (context?.previousTags) {
        queryClient.setQueryData(['optimized-employee-tags', employeeId], context.previousTags);
      }
      console.error("Add tag mutation error:", error);
      toast.error(`Erro ao adicionar tag: ${error.message}`);
    },
    onSuccess: (data) => {
      invalidateEmployeeTags();
      toast.success('Tag adicionada com sucesso');
      console.log("[useOptimizedEmployeeTags] Tag adicionada:", data);
    }
  });

  const removeEmployeeTag = useMutation({
    mutationFn: async (tagId: string) => {
      console.log("[useOptimizedEmployeeTags] Removendo tag:", tagId);
      
      const { error } = await supabase
        .from('employee_tags')
        .delete()
        .eq('id', tagId);

      if (error) {
        console.error("Error removing optimized employee tag:", error);
        throw error;
      }
    },
    onMutate: async (tagId) => {
      await queryClient.cancelQueries({ queryKey: ['optimized-employee-tags', employeeId] });
      
      const previousTags = queryClient.getQueryData<EmployeeTag[]>(['optimized-employee-tags', employeeId]);
      
      // Update otimista
      if (enableCache && previousTags) {
        queryClient.setQueryData(
          ['optimized-employee-tags', employeeId],
          previousTags.filter(tag => tag.id !== tagId)
        );
      }
      
      return { previousTags };
    },
    onError: (error: any, variables, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(['optimized-employee-tags', employeeId], context.previousTags);
      }
      console.error("Remove tag mutation error:", error);
      toast.error(`Erro ao remover tag: ${error.message}`);
    },
    onSuccess: () => {
      invalidateEmployeeTags();
      toast.success('Tag removida com sucesso');
    }
  });

  // Métricas de performance
  const performanceMetrics = useMemo(() => ({
    tagsCount: employeeTags.length,
    isOptimized: enableCache,
    hasRealTime: realTimeUpdates,
    cacheStatus: queryClient.getQueryState(['optimized-employee-tags', employeeId])?.status
  }), [employeeTags.length, enableCache, realTimeUpdates, queryClient, employeeId]);

  // Funcionalidades avançadas
  const tagStatistics = useMemo(() => {
    const categoryStats = employeeTags.reduce((acc, tag) => {
      const category = tag.tag_type?.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTags: employeeTags.length,
      categoriesCount: Object.keys(categoryStats).length,
      categoryDistribution: categoryStats,
      hasExpiredTags: employeeTags.some(tag => 
        tag.expiry_date && new Date(tag.expiry_date) < new Date()
      )
    };
  }, [employeeTags]);

  return {
    employeeTags,
    isLoading,
    error,
    addEmployeeTag,
    removeEmployeeTag,
    invalidateEmployeeTags,
    performanceMetrics,
    tagStatistics
  };
}

// Hook otimizado para tipos de tags com cache global
export function useOptimizedTagTypes() {
  const { data: tagTypes = [], isLoading } = useQuery({
    queryKey: ['optimized-tag-types'],
    queryFn: async (): Promise<EmployeeTagType[]> => {
      console.log("[useOptimizedTagTypes] Buscando tipos de tags...");
      
      const { data, error } = await supabase
        .from('employee_tag_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error("Error fetching optimized tag types:", error);
        throw error;
      }

      console.log("[useOptimizedTagTypes] Tipos encontrados:", data);
      return data || [];
    },
    staleTime: TAG_STALE_TIME * 2, // Tipos mudam menos frequentemente
    gcTime: TAG_CACHE_TIME * 2,
    refetchOnWindowFocus: false
  });

  // Estatísticas dos tipos de tags
  const typeStatistics = useMemo(() => {
    const categoryStats = tagTypes.reduce((acc, type) => {
      const category = type.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTypes: tagTypes.length,
      categoriesCount: Object.keys(categoryStats).length,
      categoryDistribution: categoryStats
    };
  }, [tagTypes]);

  return {
    tagTypes,
    isLoading,
    typeStatistics
  };
}
