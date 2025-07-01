
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCallback, useMemo } from "react";
import type { EmployeeTag } from "@/types/tags";

// Cache otimizado com invalidação inteligente
const TAG_CACHE_TIME = 5 * 60 * 1000; // 5 minutos
const TAG_STALE_TIME = 2 * 60 * 1000; // 2 minutos

interface UseOptimizedEmployeeTagsCoreOptions {
  employeeId?: string;
  realTimeUpdates?: boolean;
  enableCache?: boolean;
}

export function useOptimizedEmployeeTagsCore({
  employeeId,
  realTimeUpdates = true,
  enableCache = true
}: UseOptimizedEmployeeTagsCoreOptions) {
  const queryClient = useQueryClient();

  // Query otimizada com cache inteligente
  const { data: employeeTags = [], isLoading, error } = useQuery({
    queryKey: ['optimized-employee-tags', employeeId],
    queryFn: async (): Promise<EmployeeTag[]> => {
      if (!employeeId) return [];
      
      console.log("[useOptimizedEmployeeTagsCore] Buscando tags para funcionário:", employeeId);
      
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

      console.log("[useOptimizedEmployeeTagsCore] Tags encontradas:", data);
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
      
      console.log("[useOptimizedEmployeeTagsCore] Adicionando tag:", { employeeId, tagTypeId });
      
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
      console.log("[useOptimizedEmployeeTagsCore] Tag adicionada:", data);
    }
  });

  const removeEmployeeTag = useMutation({
    mutationFn: async (tagId: string) => {
      console.log("[useOptimizedEmployeeTagsCore] Removendo tag:", tagId);
      
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

  return {
    employeeTags,
    isLoading,
    error,
    addEmployeeTag,
    removeEmployeeTag,
    invalidateEmployeeTags,
    performanceMetrics
  };
}
