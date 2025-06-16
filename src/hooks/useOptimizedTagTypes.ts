
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";
import type { EmployeeTagType } from "@/types/tags";

// Cache otimizado com invalidação inteligente
const TAG_CACHE_TIME = 5 * 60 * 1000; // 5 minutos
const TAG_STALE_TIME = 2 * 60 * 1000; // 2 minutos

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
