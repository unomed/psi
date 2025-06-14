
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Subscription } from "@/types/billing";

export function useSubscriptions() {
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async (): Promise<Subscription[]> => {
      try {
        // For now, return mock data since tables don't exist yet
        const mockSubscriptions: Subscription[] = [
          {
            id: "1",
            company_id: "company-1",
            plan_id: "plan-1",
            billing_cycle: "monthly",
            status: "active",
            start_date: "2024-01-01",
            end_date: null,
            next_billing_date: "2024-02-01",
            trial_end_date: null,
            monthly_amount: 1500,
            created_at: "2024-01-01",
            updated_at: "2024-01-01",
            billing_plans: {
              id: "plan-1",
              name: "Profissional",
              type: "professional",
              price_per_company: 500,
              price_per_employee: 20,
              max_companies: 5,
              max_employees: 250,
              features: ["Relatórios avançados", "Suporte prioritário"],
              description: "Ideal para empresas médias",
              is_active: true,
              created_at: "2024-01-01",
              updated_at: "2024-01-01"
            },
            companies: {
              name: "Tech Solutions Ltda",
              cnpj: "12.345.678/0001-90"
            }
          },
          {
            id: "2", 
            company_id: "company-2",
            plan_id: "plan-2",
            billing_cycle: "monthly",
            status: "trial",
            start_date: "2024-01-15",
            end_date: null,
            next_billing_date: "2024-02-15",
            trial_end_date: "2024-02-15",
            monthly_amount: 800,
            created_at: "2024-01-15",
            updated_at: "2024-01-15",
            billing_plans: {
              id: "plan-2",
              name: "Básico",
              type: "basic",
              price_per_company: 300,
              price_per_employee: 10,
              max_companies: 1,
              max_employees: 50,
              features: ["Relatórios básicos"],
              description: "Para pequenas empresas",
              is_active: true,
              created_at: "2024-01-01",
              updated_at: "2024-01-01"
            },
            companies: {
              name: "Startup Inovadora",
              cnpj: "98.765.432/0001-10"
            }
          }
        ];

        return mockSubscriptions;
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return [];
      }
    }
  });

  return { subscriptions, isLoading };
}
