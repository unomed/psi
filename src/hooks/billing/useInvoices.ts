
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "@/types/billing";

export function useInvoices(companyId?: string) {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices', companyId],
    queryFn: async (): Promise<Invoice[]> => {
      let query = supabase
        .from('invoices')
        .select(`
          *,
          companies (name, cnpj)
        `)
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching invoices:', error);
        throw error;
      }

      // Type cast the data to match our TypeScript interface
      return (data || []).map(invoice => ({
        ...invoice,
        status: invoice.status as Invoice['status']
      }));
    }
  });

  return {
    invoices,
    isLoading
  };
}
