
import { supabase } from "@/integrations/supabase/client";

export interface DashboardMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  calculation_date: string;
  metadata?: Record<string, any>;
}

export interface DashboardAnalytics {
  risk_trend: Array<{
    date: string;
    high_risk: number;
    critical_risk: number;
    total: number;
  }>;
  sector_breakdown: Array<{
    sector_name: string;
    high_risk_count: number;
    critical_risk_count: number;
    total_analyses: number;
  }>;
  action_effectiveness: Array<{
    risk_level: string;
    total_plans: number;
    completed_plans: number;
    completion_rate: number;
  }>;
  generated_at: string;
}

export interface SectorBenchmark {
  id: string;
  industry_sector: string;
  risk_category: string;
  benchmark_score: number;
  percentile_25: number;
  percentile_50: number;
  percentile_75: number;
  percentile_90: number;
  sample_size: number;
  data_source: string;
}

export class DashboardAnalyticsService {
  
  static async getCompanyMetrics(companyId: string, calculationDate?: string): Promise<DashboardMetric[]> {
    try {
      const { data, error } = await supabase.rpc('calculate_psychosocial_metrics', {
        p_company_id: companyId,
        p_calculation_date: calculationDate || new Date().toISOString().split('T')[0]
      });

      if (error) throw error;

      // Convert the function result to our interface format
      return (data || []).map((item: any, index: number) => ({
        id: `metric-${index}`,
        metric_name: item.metric_name,
        metric_value: item.metric_value,
        metric_unit: item.metric_unit,
        calculation_date: calculationDate || new Date().toISOString().split('T')[0],
        metadata: {}
      }));
    } catch (error) {
      console.error('Error getting company metrics:', error);
      throw error;
    }
  }

  static async getDashboardAnalytics(companyId: string, periodDays: number = 30): Promise<DashboardAnalytics> {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_analytics', {
        p_company_id: companyId,
        p_period_days: periodDays
      });

      if (error) throw error;

      return data || {
        risk_trend: [],
        sector_breakdown: [],
        action_effectiveness: [],
        generated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting dashboard analytics:', error);
      throw error;
    }
  }

  static async getSectorBenchmarks(industrySector?: string): Promise<SectorBenchmark[]> {
    try {
      let query = supabase
        .from('sector_benchmarks')
        .select('*')
        .order('industry_sector');

      if (industrySector) {
        query = query.eq('industry_sector', industrySector);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting sector benchmarks:', error);
      throw error;
    }
  }

  static async saveMetric(companyId: string, metric: Partial<DashboardMetric>): Promise<void> {
    try {
      const { error } = await supabase
        .from('psychosocial_metrics')
        .insert({
          company_id: companyId,
          metric_type: 'custom',
          metric_name: metric.metric_name,
          metric_value: metric.metric_value,
          metric_unit: metric.metric_unit || 'count',
          calculation_date: metric.calculation_date || new Date().toISOString().split('T')[0],
          metadata: metric.metadata || {}
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving metric:', error);
      throw error;
    }
  }

  static async getHistoricalMetrics(
    companyId: string, 
    metricType: string, 
    startDate: string, 
    endDate: string
  ): Promise<DashboardMetric[]> {
    try {
      const { data, error } = await supabase
        .from('psychosocial_metrics')
        .select('*')
        .eq('company_id', companyId)
        .eq('metric_type', metricType)
        .gte('calculation_date', startDate)
        .lte('calculation_date', endDate)
        .order('calculation_date');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting historical metrics:', error);
      throw error;
    }
  }

  static async getRiskTrendAnalysis(companyId: string, periodDays: number = 90): Promise<any[]> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);

      const { data, error } = await supabase
        .from('psychosocial_risk_analysis')
        .select(`
          evaluation_date,
          exposure_level,
          category,
          risk_score
        `)
        .eq('company_id', companyId)
        .gte('evaluation_date', startDate.toISOString().split('T')[0])
        .lte('evaluation_date', endDate.toISOString().split('T')[0])
        .order('evaluation_date');

      if (error) throw error;

      // Group by date and calculate trend metrics
      const trendData = (data || []).reduce((acc: any, analysis: any) => {
        const date = analysis.evaluation_date;
        if (!acc[date]) {
          acc[date] = {
            date,
            total: 0,
            high_risk: 0,
            critical_risk: 0,
            avg_score: 0,
            scores: []
          };
        }

        acc[date].total += 1;
        acc[date].scores.push(analysis.risk_score);
        
        if (analysis.exposure_level === 'alto') {
          acc[date].high_risk += 1;
        } else if (analysis.exposure_level === 'critico') {
          acc[date].critical_risk += 1;
        }

        return acc;
      }, {});

      // Calculate averages and format result
      return Object.values(trendData).map((day: any) => ({
        ...day,
        avg_score: day.scores.reduce((a: number, b: number) => a + b, 0) / day.scores.length,
        high_risk_percentage: (day.high_risk / day.total) * 100,
        critical_risk_percentage: (day.critical_risk / day.total) * 100
      }));
    } catch (error) {
      console.error('Error getting risk trend analysis:', error);
      throw error;
    }
  }
}
