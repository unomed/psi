
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BillingMetrics {
  monthlyRevenue: number;
  revenueGrowth: number;
  activeSubscriptions: number;
  newSubscriptions: number;
  totalEmployees: number;
  averageTicket: number;
}

export function useBillingMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['billingMetrics'],
    queryFn: async (): Promise<BillingMetrics> => {
      try {
        // For now, return mock data
        // In a real implementation, you would query the actual tables
        const mockMetrics: BillingMetrics = {
          monthlyRevenue: 25000,
          revenueGrowth: 12.5,
          activeSubscriptions: 15,
          newSubscriptions: 3,
          totalEmployees: 450,
          averageTicket: 1666.67
        };

        return mockMetrics;
      } catch (error) {
        console.error("Error fetching billing metrics:", error);
        return {
          monthlyRevenue: 0,
          revenueGrowth: 0,
          activeSubscriptions: 0,
          newSubscriptions: 0,
          totalEmployees: 0,
          averageTicket: 0
        };
      }
    }
  });

  return { metrics, isLoading };
}
