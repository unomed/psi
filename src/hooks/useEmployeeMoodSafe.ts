
import { useSafeState, useSafeEffect } from './useSafeReact';
import { supabase } from '@/integrations/supabase/client';
import { MoodLog, MoodStats } from '@/types/employee-auth';

export function useEmployeeMoodSafe(employeeId: string) {
  const [todayMood, setTodayMood] = useSafeState<MoodLog | null>(null);
  const [moodStats, setMoodStats] = useSafeState<MoodStats | null>(null);
  const [loading, setLoading] = useSafeState(true);

  const loadTodayMood = async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('employee_mood_logs')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('log_date', today)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar humor do dia:', error);
        return;
      }

      if (data) {
        setTodayMood({
          id: data.id,
          employeeId: data.employee_id,
          moodScore: data.mood_score,
          moodEmoji: data.mood_emoji,
          moodDescription: data.mood_description,
          logDate: data.log_date,
          createdAt: data.created_at
        });
      }
    } catch (error) {
      console.error('Erro ao carregar humor:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoodStats = async () => {
    if (!employeeId) return;

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from('employee_mood_logs')
        .select('mood_score, log_date')
        .eq('employee_id', employeeId)
        .gte('log_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('log_date', { ascending: true });

      if (error) {
        console.error('Erro ao carregar estatísticas de humor:', error);
        return;
      }

      if (data && data.length > 0) {
        const scores = data.map(log => log.mood_score);
        const avgMood = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        
        // Calculate trend
        const recentScores = scores.slice(-7); // Last 7 days
        const olderScores = scores.slice(-14, -7); // Previous 7 days
        
        let moodTrend: 'melhorando' | 'piorando' | 'estável' = 'estável';
        if (recentScores.length > 0 && olderScores.length > 0) {
          const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
          const olderAvg = olderScores.reduce((sum, score) => sum + score, 0) / olderScores.length;
          
          if (recentAvg > olderAvg + 0.2) {
            moodTrend = 'melhorando';
          } else if (recentAvg < olderAvg - 0.2) {
            moodTrend = 'piorando';
          }
        }

        setMoodStats({
          avgMood,
          moodTrend,
          totalLogs: data.length,
          moodDistribution: {}
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const saveMood = async (score: number, emoji: string, description: string) => {
    if (!employeeId) return { success: false };

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('employee_mood_logs')
        .insert({
          employee_id: employeeId,
          mood_score: score,
          mood_emoji: emoji,
          mood_description: description,
          log_date: today
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar humor:', error);
        return { success: false };
      }

      if (data) {
        setTodayMood({
          id: data.id,
          employeeId: data.employee_id,
          moodScore: data.mood_score,
          moodEmoji: data.mood_emoji,
          moodDescription: data.mood_description,
          logDate: data.log_date,
          createdAt: data.created_at
        });
        
        // Reload stats
        loadMoodStats();
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao salvar humor:', error);
      return { success: false };
    }
  };

  useSafeEffect(() => {
    loadTodayMood();
    loadMoodStats();
  }, [employeeId]);

  return {
    todayMood,
    moodStats,
    loading,
    saveMood
  };
}
