import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/types/employee';

interface EmployeeMoodData {
  employeeId: string;
  avgMood: number | null;
  totalLogs: number;
  lastMoodDate: string | null;
  lastMoodEmoji: string | null;
  lastMoodDescription: string | null;
}

export function useEmployeesWithMood(employees: Employee[] | undefined) {
  const [employeeMoods, setEmployeeMoods] = useState<Record<string, EmployeeMoodData>>({});
  const [loading, setLoading] = useState(false);
  const lastEmployeeIds = useRef<string>('');

  const fetchEmployeeMoods = async () => {
    if (!employees || employees.length === 0) {
      console.log('useEmployeesWithMood: No employees provided');
      setEmployeeMoods({});
      return;
    }

    const employeeIds = employees.map(emp => emp.id);
    const currentEmployeeIds = employeeIds.join(',');
    
    // Evitar re-fetch se os IDs não mudaram
    if (currentEmployeeIds === lastEmployeeIds.current) {
      return;
    }
    
    lastEmployeeIds.current = currentEmployeeIds;
    setLoading(true);
    
    try {
      console.log('useEmployeesWithMood: Fetching mood data for employees:', employeeIds.length);
      
      // Verificar se há uma sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.warn('useEmployeesWithMood: No active session');
        // Criar estrutura vazia para não quebrar a UI
        const emptyMoodData: Record<string, EmployeeMoodData> = {};
        employees.forEach(employee => {
          emptyMoodData[employee.id] = {
            employeeId: employee.id,
            avgMood: null,
            totalLogs: 0,
            lastMoodDate: null,
            lastMoodEmoji: null,
            lastMoodDescription: null
          };
        });
        setEmployeeMoods(emptyMoodData);
        return;
      }
      
      // Buscar dados de humor dos últimos 30 dias
      const { data: moodLogs, error } = await supabase
        .from('employee_mood_logs')
        .select('employee_id, mood_score, mood_emoji, mood_description, log_date, created_at')
        .in('employee_id', employeeIds)
        .gte('log_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useEmployeesWithMood: Database error:', error);
        // Em caso de erro, definir estrutura vazia em vez de falhar
        const emptyMoodData: Record<string, EmployeeMoodData> = {};
        employees.forEach(employee => {
          emptyMoodData[employee.id] = {
            employeeId: employee.id,
            avgMood: null,
            totalLogs: 0,
            lastMoodDate: null,
            lastMoodEmoji: null,
            lastMoodDescription: null
          };
        });
        setEmployeeMoods(emptyMoodData);
        return;
      }
      
      console.log('useEmployeesWithMood: Mood logs fetched:', moodLogs?.length || 0, 'records');

      // Processar dados por funcionário
      const moodData: Record<string, EmployeeMoodData> = {};
      
      employees.forEach(employee => {
        const employeeLogs = moodLogs?.filter(log => log.employee_id === employee.id) || [];
        
        if (employeeLogs.length > 0) {
          const avgMood = employeeLogs.reduce((sum, log) => sum + log.mood_score, 0) / employeeLogs.length;
          const latestLog = employeeLogs[0];
          
          moodData[employee.id] = {
            employeeId: employee.id,
            avgMood: Number(avgMood.toFixed(1)),
            totalLogs: employeeLogs.length,
            lastMoodDate: latestLog.log_date,
            lastMoodEmoji: latestLog.mood_emoji,
            lastMoodDescription: latestLog.mood_description
          };
        } else {
          moodData[employee.id] = {
            employeeId: employee.id,
            avgMood: null,
            totalLogs: 0,
            lastMoodDate: null,
            lastMoodEmoji: null,
            lastMoodDescription: null
          };
        }
      });

      setEmployeeMoods(moodData);
    } catch (error) {
      console.error('Erro ao buscar dados de humor dos funcionários:', error);
      // Em caso de falha geral, definir estrutura vazia para não quebrar a UI
      const emptyMoodData: Record<string, EmployeeMoodData> = {};
      employees?.forEach(employee => {
        emptyMoodData[employee.id] = {
          employeeId: employee.id,
          avgMood: null,
          totalLogs: 0,
          lastMoodDate: null,
          lastMoodEmoji: null,
          lastMoodDescription: null
        };
      });
      setEmployeeMoods(emptyMoodData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeMoods();
  }, [employees]);

  return {
    employeeMoods,
    loading: loading,
    refetch: fetchEmployeeMoods
  };
}