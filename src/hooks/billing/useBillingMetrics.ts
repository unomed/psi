
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BillingMetrics {
  monthlyRevenue: number;
  revenueGrowth: number;
  activeSubscriptions: number;
  newSubscriptions: number;
  totalEmployees: number;
  averageTicket: number;
  totalInvoices: number;
  pendingInvoices: number;
  totalCreditsBalance: number;
}

export function useBillingMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['billingMetrics'],
    queryFn: async (): Promise<BillingMetrics> => {
      try {
        // Buscar dados reais do banco
        const currentMonth = new Date();
        const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        
        // Revenue do mês atual
        const { data: currentMonthBilling } = await supabase
          .from('assessment_billing_records')
          .select('amount_charged')
          .gte('created_at', `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-01`)
          .eq('billing_status', 'charged');

        // Revenue do mês passado
        const { data: lastMonthBilling } = await supabase
          .from('assessment_billing_records')
          .select('amount_charged')
          .gte('created_at', `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}-01`)
          .lt('created_at', `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-01`)
          .eq('billing_status', 'charged');

        const monthlyRevenue = currentMonthBilling?.reduce((sum, record) => sum + Number(record.amount_charged), 0) || 0;
        const lastMonthRevenue = lastMonthBilling?.reduce((sum, record) => sum + Number(record.amount_charged), 0) || 0;
        const revenueGrowth = lastMonthRevenue > 0 ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

        // Empresas ativas com billing
        const { data: activeCompanies } = await supabase
          .from('company_billing')
          .select('company_id')
          .not('billing_plan_id', 'is', null);

        // Novas empresas este mês
        const { data: newCompanies } = await supabase
          .from('company_billing')
          .select('company_id')
          .gte('created_at', `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-01`);

        // Total de funcionários
        const { count: totalEmployees } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true });

        // Faturas
        const { data: invoices } = await supabase
          .from('invoices')
          .select('status, total_amount');

        const totalInvoices = invoices?.length || 0;
        const pendingInvoices = invoices?.filter(inv => inv.status === 'pending').length || 0;

        // Saldo total de créditos
        const { data: creditBalances } = await supabase
          .from('company_billing')
          .select('assessment_credit_balance');

        const totalCreditsBalance = creditBalances?.reduce((sum, cb) => sum + (cb.assessment_credit_balance || 0), 0) || 0;

        // Ticket médio
        const totalRevenue = invoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0;
        const averageTicket = activeCompanies?.length ? totalRevenue / activeCompanies.length : 0;

        return {
          monthlyRevenue,
          revenueGrowth,
          activeSubscriptions: activeCompanies?.length || 0,
          newSubscriptions: newCompanies?.length || 0,
          totalEmployees: totalEmployees || 0,
          averageTicket,
          totalInvoices,
          pendingInvoices,
          totalCreditsBalance
        };
      } catch (error) {
        console.error("Error fetching billing metrics:", error);
        return {
          monthlyRevenue: 0,
          revenueGrowth: 0,
          activeSubscriptions: 0,
          newSubscriptions: 0,
          totalEmployees: 0,
          averageTicket: 0,
          totalInvoices: 0,
          pendingInvoices: 0,
          totalCreditsBalance: 0
        };
      }
    }
  });

  return { metrics, isLoading };
}
