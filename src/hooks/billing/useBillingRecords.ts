
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AssessmentBillingRecord } from "@/types/billing";

export function useBillingRecords(companyId?: string) {
  const { data: billingRecords, isLoading } = useQuery({
    queryKey: ['billingRecords', companyId],
    queryFn: async (): Promise<AssessmentBillingRecord[]> => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('assessment_billing_records')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching billing records:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!companyId
  });

  return {
    billingRecords,
    isLoading
  };
}
