
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyBilling, BillingPlan, BulkDiscount } from "@/types/billing";
import { toast } from "sonner";

export function useCompanyBilling(companyId?: string) {
  const queryClient = useQueryClient();

  const { data: companyBilling, isLoading } = useQuery({
    queryKey: ['companyBilling', companyId],
    queryFn: async (): Promise<CompanyBilling | null> => {
      if (!companyId) return null;
      
      const { data, error } = await supabase
        .from('company_billing')
        .select(`
          *,
          billing_plans (*),
          companies (name, cnpj)
        `)
        .eq('company_id', companyId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching company billing:', error);
        throw error;
      }

      if (!data) return null;

      // Type cast the data to match our TypeScript interface
      return {
        ...data,
        billing_plans: data.billing_plans ? {
          ...data.billing_plans,
          type: data.billing_plans.type as BillingPlan['type'],
          bulk_discounts: Array.isArray(data.billing_plans.bulk_discounts) 
            ? data.billing_plans.bulk_discounts as BulkDiscount[]
            : []
        } : undefined
      };
    },
    enabled: !!companyId
  });

  const { data: billingPlans } = useQuery({
    queryKey: ['billingPlans'],
    queryFn: async (): Promise<BillingPlan[]> => {
      const { data, error } = await supabase
        .from('billing_plans')
        .select('*')
        .eq('is_active', true)
        .order('assessment_price');

      if (error) {
        console.error('Error fetching billing plans:', error);
        throw error;
      }

      // Type cast the data to match our TypeScript interface
      return (data || []).map(plan => ({
        ...plan,
        type: plan.type as BillingPlan['type'],
        bulk_discounts: Array.isArray(plan.bulk_discounts) ? plan.bulk_discounts as BulkDiscount[] : []
      }));
    }
  });

  const setupCompanyBillingMutation = useMutation({
    mutationFn: async ({ companyId, planId }: { companyId: string; planId: string }) => {
      const { error } = await supabase
        .from('company_billing')
        .upsert({
          company_id: companyId,
          billing_plan_id: planId,
          assessment_credit_balance: 0
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyBilling'] });
      toast.success('Configuração de cobrança atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error setting up company billing:', error);
      toast.error('Erro ao configurar cobrança da empresa');
    }
  });

  const updateCreditBalanceMutation = useMutation({
    mutationFn: async ({ companyId, credits }: { companyId: string; credits: number }) => {
      const { error } = await supabase
        .from('company_billing')
        .update({ 
          assessment_credit_balance: credits,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', companyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyBilling'] });
      toast.success('Saldo de créditos atualizado!');
    },
    onError: (error) => {
      console.error('Error updating credit balance:', error);
      toast.error('Erro ao atualizar saldo de créditos');
    }
  });

  return {
    companyBilling,
    billingPlans,
    isLoading,
    setupCompanyBilling: setupCompanyBillingMutation.mutate,
    updateCreditBalance: updateCreditBalanceMutation.mutate,
    isSetupLoading: setupCompanyBillingMutation.isPending,
    isUpdateLoading: updateCreditBalanceMutation.isPending
  };
}
