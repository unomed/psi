
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyFilter } from '@/hooks/useCompanyFilter';

interface CompanyMoodData {
  totalEmployees: number;
  logsToday: number;
  avgMoodToday: number;
  avgMoodWeek: number;
  moodTrend: 'melhorando' | 'piorando' | 'estável';
  moodDistribution: Record<string, number>;
  sectorMoodData: Array<{
    sectorName: string;
    avgMood: number;
    totalLogs: number;
  }>;
}

export function useCompanyMoodAnalytics() {
  const [moodData, setMoodData] = useState<CompanyMoodData | null>(null);
  const [loading, setLoading] = useState(true);
  const { getCompanyFilter } = useCompanyFilter();

  useEffect(() => {
    loadMoodAnalytics();
  }, [getCompanyFilter()]);

  const loadMoodAnalytics = async () => {
    try {
      const companyId = getCompanyFilter();
      if (!companyId) return;

      // Buscar logs de humor dos funcionários da empresa
      const { data: moodLogs, error } = await supabase
        .from('employee_mood_logs')
        .select(`
          *,
          employees!inner(
            id,
            name,
            company_id,
            sector_id,
            sectors(name)
          )
        `)
        .eq('employees.company_id', companyId)
        .gte('log_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (error) throw error;

      // Processar dados
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const logsToday = moodLogs?.filter(log => log.log_date === today) || [];
      const logsThisWeek = moodLogs?.filter(log => log.log_date >= weekAgo) || [];
      const logsLastWeek = moodLogs?.filter(log => 
        log.log_date >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] &&
        log.log_date < weekAgo
      ) || [];

      const avgMoodToday = logsToday.length > 0 
        ? logsToday.reduce((sum, log) => sum + log.mood_score, 0) / logsToday.length 
        : 0;

      const avgMoodThisWeek = logsThisWeek.length > 0
        ? logsThisWeek.reduce((sum, log) => sum + log.mood_score, 0) / logsThisWeek.length
        : 0;

      const avgMoodLastWeek = logsLastWeek.length > 0
        ? logsLastWeek.reduce((sum, log) => sum + log.mood_score, 0) / logsLastWeek.length
        : 0;

      let moodTrend: 'melhorando' | 'piorando' | 'estável' = 'estável';
      if (avgMoodThisWeek > avgMoodLastWeek) moodTrend = 'melhorando';
      else if (avgMoodThisWeek < avgMoodLastWeek) moodTrend = 'piorando';

      // Distribuição de humor
      const moodDistribution: Record<string, number> = {};
      [1, 2, 3, 4, 5].forEach(score => {
        moodDistribution[score.toString()] = moodLogs?.filter(log => log.mood_score === score).length || 0;
      });

      // Dados por setor
      const sectorMoodMap = new Map();
      moodLogs?.forEach(log => {
        const sectorName = log.employees?.sectors?.name || 'Sem setor';
        if (!sectorMoodMap.has(sectorName)) {
          sectorMoodMap.set(sectorName, { scores: [], count: 0 });
        }
        const sectorData = sectorMoodMap.get(sectorName);
        sectorData.scores.push(log.mood_score);
        sectorData.count++;
      });

      const sectorMoodData = Array.from(sectorMoodMap.entries()).map(([sectorName, data]) => ({
        sectorName,
        avgMood: data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length,
        totalLogs: data.count
      }));

      // Contar total de funcionários da empresa
      const { count: totalEmployees } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .eq('status', 'active');

      setMoodData({
        totalEmployees: totalEmployees || 0,
        logsToday: logsToday.length,
        avgMoodToday,
        avgMoodWeek: avgMoodThisWeek,
        moodTrend,
        moodDistribution,
        sectorMoodData
      });

    } catch (error) {
      console.error('Erro ao carregar analytics de humor:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    moodData,
    loading,
    refresh: loadMoodAnalytics
  };
}
