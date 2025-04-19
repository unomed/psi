
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useEmployeeValidation() {
  const validateEmployee = async (selectedEmployee: string | null) => {
    if (!selectedEmployee) {
      return null;
    }

    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('id, name')
      .eq('id', selectedEmployee)
      .single();

    if (employeeError || !employeeData) {
      console.error("Erro ao verificar funcionário:", employeeError);
      toast.error(`Funcionário não encontrado: ${employeeError?.message || "Nenhum registro encontrado"}`);
      return null;
    }

    return employeeData;
  };

  return { validateEmployee };
}
