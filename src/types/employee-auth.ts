
export interface EmployeeAuth {
  employeeId: string;
  employeeName: string;
  companyId: string;
  companyName: string;
  isValid: boolean;
}

export interface EmployeeSession {
  employee: EmployeeAuth;
  isAuthenticated: boolean;
}

export interface MoodLog {
  id: string;
  employeeId: string;
  moodScore: number;
  moodEmoji: string;
  moodDescription: string;
  logDate: string;
  createdAt: string;
}

export interface MoodStats {
  avgMood: number;
  moodTrend: 'melhorando' | 'piorando' | 'estável';
  totalLogs: number;
  moodDistribution: Record<string, number>;
}

export const MOOD_OPTIONS = [
  { 
    score: 1, 
    emoji: "😢", 
    description: "Muito mal", 
    color: "#ef4444" 
  },
  { 
    score: 2, 
    emoji: "😞", 
    description: "Mal", 
    color: "#f97316" 
  },
  { 
    score: 3, 
    emoji: "😐", 
    description: "Regular", 
    color: "#eab308" 
  },
  { 
    score: 4, 
    emoji: "😊", 
    description: "Bem", 
    color: "#3b82f6" 
  },
  { 
    score: 5, 
    emoji: "😄", 
    description: "Muito bem", 
    color: "#22c55e" 
  },
] as const;
