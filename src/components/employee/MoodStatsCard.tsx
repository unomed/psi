
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEmployeeMood } from '@/hooks/useEmployeeMood';
import { MOOD_OPTIONS } from '@/types/employee-auth';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MoodStatsCardProps {
  employeeId: string;
}

export function MoodStatsCard({ employeeId }: MoodStatsCardProps) {
  const { moodStats, loading } = useEmployeeMood(employeeId);

  if (loading || !moodStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📊 Estatísticas do Humor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            Carregando estatísticas...
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (moodStats.moodTrend) {
      case 'melhorando':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'piorando':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (moodStats.moodTrend) {
      case 'melhorando':
        return 'text-green-600';
      case 'piorando':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const averageScore = parseFloat(moodStats.avgMood?.toFixed(1) || '0');
  const averagePercentage = (averageScore / 5) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Estatísticas do Humor</CardTitle>
        <CardDescription>
          Últimos 30 dias • {moodStats.totalLogs} registros
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Humor Médio</span>
            <span className="text-2xl font-bold">{averageScore}/5</span>
          </div>
          <Progress value={averagePercentage} className="h-2" />
        </div>

        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            Seu humor está {moodStats.moodTrend}
          </span>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Distribuição do Humor</h4>
          <div className="space-y-2">
            {MOOD_OPTIONS.map((mood) => {
              const count = moodStats.moodDistribution?.[mood.score.toString()] || 0;
              const percentage = moodStats.totalLogs > 0 ? (count / moodStats.totalLogs) * 100 : 0;
              
              return (
                <div key={mood.score} className="flex items-center gap-3">
                  <span className="text-lg">{mood.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">{mood.description}</span>
                      <span className="text-xs text-muted-foreground">
                        {count} vez{count !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
