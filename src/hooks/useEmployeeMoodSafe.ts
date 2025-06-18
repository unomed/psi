
import { useState, useCallback } from 'react';

export interface MoodEntry {
  date: string;
  mood: string;
  notes?: string;
}

export function useEmployeeMoodSafe(employeeId: string) {
  const [mood, setMood] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveMood = useCallback(async (moodValue: string, notes?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMood(moodValue);
      console.log(`Mood saved for employee ${employeeId}:`, { mood: moodValue, notes });
      
      return true;
    } catch (err) {
      setError('Erro ao salvar humor');
      console.error('Error saving mood:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  const getMoodHistory = useCallback(async (): Promise<MoodEntry[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data for now
      return [
        { date: new Date().toISOString(), mood: mood || 'neutral' }
      ];
    } catch (err) {
      setError('Erro ao carregar histórico');
      console.error('Error loading mood history:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [mood]);

  return {
    mood,
    isLoading,
    error,
    saveMood,
    getMoodHistory
  };
}
