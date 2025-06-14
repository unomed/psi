
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoodLog, MoodStats } from '@/types/employee-auth';
import { toast } from '@/hooks/use-toast';

export function useEmployeeMood(employeeId: string) {
  const [todayMood, setTodayMood] = useState<MoodLog | null>(null);
  const [moodStats, setMoodStats] = useState<MoodStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      loadTodayMood();
      loadMoodStats();
    }
  }, [employeeId]);

  const loadTodayMood = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_mood_logs')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('log_date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (error) throw error;
      setTodayMood(data);
    } catch (error) {
      console.error('Erro ao carregar humor do dia:', error);
    }
  };

  const loadMoodStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_employee_mood_stats', {
        p_employee_id: employeeId,
        p_days: 30
      });

      if (error) throw error;
      if (data && data.length > 0) {
        setMoodStats(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas de humor:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMood = async (moodScore: number, moodEmoji: string, moodDescription: string) => {
    try {
      const { error } = await supabase
        .from('employee_mood_logs')
        .upsert({
          employee_id: employeeId,
          mood_score: moodScore,
          mood_emoji: moodEmoji,
          mood_description: moodDescription,
          log_date: new Date().toISOString().split('T')[0]
        }, {
          onConflict: 'employee_id,log_date'
        });

      if (error) throw error;

      toast({
        title: "Humor registrado!",
        description: `Você está se sentindo ${moodDescription.toLowerCase()} hoje.`
      });

      await loadTodayMood();
      await loadMoodStats();
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao salvar humor:', error);
      toast({
        title: "Erro ao registrar humor",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    }
  };

  return {
    todayMood,
    moodStats,
    loading,
    saveMood,
    refreshMood: loadTodayMood,
    refreshStats: loadMoodStats
  };
}
