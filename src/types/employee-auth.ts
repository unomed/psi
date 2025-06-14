
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

export interface PendingAssessment {
  assessmentId: string;
  templateTitle: string;
  templateDescription: string;
  scheduledDate: string;
  linkUrl: string;
  daysRemaining: number;
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
  { score: 1, emoji: '😢', description: 'Muito triste', color: '#ef4444' },
  { score: 2, emoji: '😔', description: 'Triste', color: '#f97316' },
  { score: 3, emoji: '😐', description: 'Neutro', color: '#eab308' },
  { score: 4, emoji: '😊', description: 'Feliz', color: '#22c55e' },
  { score: 5, emoji: '😄', description: 'Muito feliz', color: '#16a34a' }
] as const;
