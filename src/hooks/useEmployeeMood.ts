
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoodLog, MoodStats, MOOD_OPTIONS } from '@/types/employee-auth';

export function useEmployeeMood(employeeId: string) {
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [todayMood, setTodayMood] = useState<MoodLog | null>(null);
  const [moodStats, setMoodStats] = useState<MoodStats | null>(null);
  const [loading, setLoading] = useState(false);

  const saveMood = async (moodScore: number, moodEmoji: string, moodDescription: string) => {
    if (!employeeId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('employee_mood_logs')
        .insert({
          employee_id: employeeId,
          mood_score: moodScore,
          mood_emoji: moodEmoji,
          mood_description: moodDescription,
          log_date: new Date().toISOString().split('T')[0],
        });

      if (error) throw error;
      
      setCurrentMood(moodScore);
      
      // Update todayMood with the new mood
      const newMood: MoodLog = {
        id: crypto.randomUUID(),
        employeeId,
        moodScore,
        moodEmoji,
        moodDescription,
        logDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      setTodayMood(newMood);
      
      await fetchMoodStats();
    } catch (error) {
      console.error('Erro ao registrar humor:', error);
    } finally {
      setLoading(false);
    }
  };

  const logMood = saveMood; // Alias for compatibility

  const fetchMoodStats = async () => {
    if (!employeeId) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's mood first
      const { data: todayData, error: todayError } = await supabase
        .from('employee_mood_logs')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('log_date', today)
        .order('created_at', { ascending: false })
        .limit(1);

      if (todayError) throw todayError;

      if (todayData && todayData.length > 0) {
        const mood = todayData[0];
        setTodayMood({
          id: mood.id,
          employeeId: mood.employee_id,
          moodScore: mood.mood_score,
          moodEmoji: mood.mood_emoji,
          moodDescription: mood.mood_description,
          logDate: mood.log_date,
          createdAt: mood.created_at
        });
        setCurrentMood(mood.mood_score);
      } else {
        setTodayMood(null);
        setCurrentMood(null);
      }

      // Fetch general mood stats
      const { data, error } = await supabase
        .from('employee_mood_logs')
        .select('*')
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      if (data && data.length > 0) {
        const avgMood = data.reduce((sum, log) => sum + log.mood_score, 0) / data.length;
        const moodDistribution = data.reduce((acc, log) => {
          acc[log.mood_description] = (acc[log.mood_description] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        let moodTrend: 'melhorando' | 'piorando' | 'estável' = 'estável';
        if (data.length >= 2) {
          const recent = data.slice(0, 5).reduce((sum, log) => sum + log.mood_score, 0) / Math.min(5, data.length);
          const older = data.slice(5, 10).reduce((sum, log) => sum + log.mood_score, 0) / Math.min(5, data.slice(5).length);
          
          if (recent > older + 0.5) moodTrend = 'melhorando';
          else if (recent < older - 0.5) moodTrend = 'piorando';
        }

        setMoodStats({
          avgMood,
          moodTrend,
          totalLogs: data.length,
          moodDistribution
        });
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas de humor:', error);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchMoodStats();
    }
  }, [employeeId]);

  return {
    currentMood,
    todayMood,
    moodStats,
    loading,
    saveMood,
    logMood,
    moodOptions: MOOD_OPTIONS
  };
}
