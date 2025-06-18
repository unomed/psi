
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EmployeeData {
  id: string;
  name: string;
  birth_date: string | null;
  company_id: string;
}

export function useEmployeeData(employeeId: string | null) {
  return useQuery({
    queryKey: ['employee-data', employeeId],
    queryFn: async () => {
      if (!employeeId) {
        console.log('[useEmployeeData] No employeeId provided');
        return null;
      }
      
      console.log(`[useEmployeeData] Carregando dados para funcionário: ${employeeId}`);
      
      const { data, error } = await supabase
        .from('employees')
        .select('id, name, birth_date, company_id')
        .eq('id', employeeId)
        .maybeSingle();

      if (error) {
        console.error('[useEmployeeData] Erro ao buscar dados do funcionário:', error);
        throw error;
      }
      
      if (!data) {
        console.log('[useEmployeeData] Funcionário não encontrado');
        return null;
      }

      // Mapear os dados do banco para o tipo EmployeeData
      const employeeData: EmployeeData = {
        id: data.id,
        name: data.name,
        birth_date: data.birth_date,
        company_id: data.company_id
      };
      
      console.log('[useEmployeeData] Dados do funcionário carregados:', employeeData);
      return employeeData;
    },
    enabled: !!employeeId,
  });
}
