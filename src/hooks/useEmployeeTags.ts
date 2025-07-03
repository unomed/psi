
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { EmployeeTag, EmployeeTagType } from "@/types/tags";

export function useEmployeeTags(employeeId?: string) {
  const queryClient = useQueryClient();

  const { data: employeeTags = [], isLoading } = useQuery({
    queryKey: ['employee-tags', employeeId],
    queryFn: async (): Promise<EmployeeTag[]> => {
      if (!employeeId) return [];
      
      console.log("[useEmployeeTags] Buscando tags para funcionário:", employeeId);
      
      const { data, error } = await supabase
        .from('employee_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('employee_id', employeeId);

      if (error) {
        console.error("Error fetching employee tags:", error);
        toast.error(`Erro ao carregar tags: ${error.message}`);
        throw error;
      }

      console.log("[useEmployeeTags] Tags encontradas:", data);
      return data || [];
    },
    enabled: !!employeeId
  });

  const addEmployeeTag = useMutation({
    mutationFn: async ({ employeeId, tagTypeId, acquiredDate, notes }: {
      employeeId: string;
      tagTypeId: string;
      acquiredDate?: string;
      notes?: string;
    }) => {
      console.log("[useEmployeeTags] Tentando adicionar tag:", { employeeId, tagTypeId });
      
      // Se o tagTypeId é temporário, significa que precisamos criar o tipo primeiro
      if (tagTypeId.startsWith('temp-')) {
        throw new Error('Tipo de tag temporário não suportado. Use o sistema de gerenciamento de tags.');
      }
      
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
        console.error("Error adding employee tag:", error);
        toast.error(`Erro ao adicionar tag: ${error.message}`);
        throw error;
      }

      console.log("[useEmployeeTags] Tag adicionada com sucesso:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-tags'] });
      toast.success('Tag adicionada com sucesso');
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
    }
  });

  const removeEmployeeTag = useMutation({
    mutationFn: async (tagId: string) => {
      console.log("[useEmployeeTags] Tentando remover tag:", tagId);
      
      const { error } = await supabase
        .from('employee_tags')
        .delete()
        .eq('id', tagId);

      if (error) {
        console.error("Error removing employee tag:", error);
        toast.error(`Erro ao remover tag: ${error.message}`);
        throw error;
      }

      console.log("[useEmployeeTags] Tag removida com sucesso");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-tags'] });
      toast.success('Tag removida com sucesso');
    },
    onError: (error: any) => {
      console.error("Remove mutation error:", error);
    }
  });

  return {
    employeeTags,
    isLoading,
    addEmployeeTag,
    removeEmployeeTag
  };
}

export function useTagTypes() {
  const { data: tagTypes = [], isLoading } = useQuery({
    queryKey: ['tag-types'],
    queryFn: async (): Promise<EmployeeTagType[]> => {
      console.log("[useTagTypes] Buscando tipos de tags...");
      
      const { data, error } = await supabase
        .from('employee_tag_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error("Error fetching tag types:", error);
        toast.error(`Erro ao carregar tipos de tags: ${error.message}`);
        throw error;
      }

      console.log("[useTagTypes] Tipos encontrados:", data);
      return data || [];
    }
  });

  return {
    tagTypes,
    isLoading
  };
}
