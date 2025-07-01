
import { useQuery } from "@tanstack/react-query";
import { DashboardAnalyticsService } from "@/services/analytics/dashboardAnalyticsService";

export function useDashboardAnalytics(companyId?: string, periodDays: number = 30) {
  const { 
    data: analytics, 
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['dashboard-analytics', companyId, periodDays],
    queryFn: () => {
      if (!companyId) throw new Error('Company ID is required');
      return DashboardAnalyticsService.getDashboardAnalytics(companyId, periodDays);
    },
    enabled: !!companyId,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const {
    data: metrics,
    isLoading: metricsLoading
  } = useQuery({
    queryKey: ['company-metrics', companyId],
    queryFn: () => {
      if (!companyId) throw new Error('Company ID is required');
      return DashboardAnalyticsService.getCompanyMetrics(companyId);
    },
    enabled: !!companyId,
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
  });

  const {
    data: riskTrend,
    isLoading: trendLoading
  } = useQuery({
    queryKey: ['risk-trend', companyId, periodDays],
    queryFn: () => {
      if (!companyId) throw new Error('Company ID is required');
      return DashboardAnalyticsService.getRiskTrendAnalysis(companyId, periodDays);
    },
    enabled: !!companyId,
  });

  return {
    analytics,
    metrics,
    riskTrend,
    isLoading: isLoading || metricsLoading || trendLoading,
    error,
    refetch
  };
}

export function useSectorBenchmarks(industrySector?: string) {
  return useQuery({
    queryKey: ['sector-benchmarks', industrySector],
    queryFn: () => DashboardAnalyticsService.getSectorBenchmarks(industrySector),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useHistoricalMetrics(
  companyId?: string, 
  metricType?: string, 
  startDate?: string, 
  endDate?: string
) {
  return useQuery({
    queryKey: ['historical-metrics', companyId, metricType, startDate, endDate],
    queryFn: () => {
      if (!companyId || !metricType || !startDate || !endDate) {
        throw new Error('All parameters are required');
      }
      return DashboardAnalyticsService.getHistoricalMetrics(companyId, metricType, startDate, endDate);
    },
    enabled: !!(companyId && metricType && startDate && endDate),
  });
}
