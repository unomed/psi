
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoodLog, MoodStats } from '@/types/employee-auth';
import { showSimpleToast } from '@/components/ui/simple-toast';

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

  const ensureEmployeeSession = async () => {
    try {
      // Reconfigurar a sessão antes de operações críticas
      await supabase.rpc('set_employee_session', {
        employee_id_value: employeeId
      });
    } catch (error) {
      console.error('Erro ao configurar sessão do funcionário:', error);
    }
  };

  const loadTodayMood = async () => {
    try {
      console.log(`[useEmployeeMood] Carregando humor do dia para funcionário: ${employeeId}`);
      
      const { data, error } = await supabase
        .from('employee_mood_logs')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('log_date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (error) {
        console.error('[useEmployeeMood] Erro ao carregar humor do dia:', error);
        throw error;
      }
      
      if (data) {
        // Mapear os dados do banco para o tipo MoodLog
        const moodLog: MoodLog = {
          id: data.id,
          employeeId: data.employee_id,
          moodScore: data.mood_score,
          moodEmoji: data.mood_emoji,
          moodDescription: data.mood_description,
          logDate: data.log_date,
          createdAt: data.created_at
        };
        setTodayMood(moodLog);
        console.log('[useEmployeeMood] Humor do dia carregado:', moodLog);
      } else {
        console.log('[useEmployeeMood] Nenhum humor registrado hoje');
        setTodayMood(null);
      }
    } catch (error) {
      console.error('Erro ao carregar humor do dia:', error);
    }
  };

  const loadMoodStats = async () => {
    try {
      console.log(`[useEmployeeMood] Carregando estatísticas de humor para funcionário: ${employeeId}`);
      
      const { data, error } = await supabase.rpc('get_employee_mood_stats', {
        p_employee_id: employeeId,
        p_days: 30
      });

      if (error) {
        console.error('[useEmployeeMood] Erro ao carregar estatísticas de humor:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        // Mapear os dados do banco para o tipo MoodStats com type safety
        const rawData = data[0];
        const moodTrend = rawData.mood_trend as 'melhorando' | 'piorando' | 'estável';
        const moodDistribution = typeof rawData.mood_distribution === 'string' 
          ? JSON.parse(rawData.mood_distribution) 
          : rawData.mood_distribution as Record<string, number>;
        
        const stats: MoodStats = {
          avgMood: rawData.avg_mood,
          moodTrend,
          totalLogs: rawData.total_logs,
          moodDistribution
        };
        setMoodStats(stats);
        console.log('[useEmployeeMood] Estatísticas de humor carregadas:', stats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas de humor:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMood = async (moodScore: number, moodEmoji: string, moodDescription: string) => {
    try {
      console.log(`[useEmployeeMood] Salvando humor para funcionário: ${employeeId}`, {
        moodScore,
        moodEmoji,
        moodDescription
      });

      // Verificar se já foi registrado humor hoje
      if (todayMood) {
        showSimpleToast({
          message: "Humor já registrado hoje",
          type: "info"
        });
        return { success: false, error: 'Humor já registrado hoje' };
      }

      // Garantir que a sessão esteja configurada
      await ensureEmployeeSession();

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

      if (error) {
        console.error('[useEmployeeMood] Erro ao salvar humor:', error);
        
        // Tratamento específico para erro de RLS
        if (error.code === '42501') {
          console.log('[useEmployeeMood] Erro de RLS detectado, tentando reconfigurar sessão...');
          await ensureEmployeeSession();
          
          // Tentar novamente após reconfigurar
          const { error: retryError } = await supabase
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
          
          if (retryError) {
            throw retryError;
          }
        } else {
          throw error;
        }
      }

      console.log('[useEmployeeMood] Humor salvo com sucesso');

      showSimpleToast({
        message: `Humor registrado! Você está se sentindo ${moodDescription.toLowerCase()} hoje.`,
        type: "success"
      });

      await loadTodayMood();
      await loadMoodStats();
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao salvar humor:', error);
      
      let errorMessage = "Tente novamente mais tarde.";
      if (error.code === '42501') {
        errorMessage = "Erro de autenticação. Faça login novamente.";
      }
      
      showSimpleToast({
        message: `Erro ao registrar humor: ${errorMessage}`,
        type: "error"
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
