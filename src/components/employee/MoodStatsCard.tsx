
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEmployeeMood } from '@/hooks/useEmployeeMood';
import { MOOD_OPTIONS } from '@/types/employee-auth';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface MoodStatsCardProps {
  employeeId: string;
}

export function MoodStatsCard({ employeeId }: MoodStatsCardProps) {
  const { moodStats, loading } = useEmployeeMood(employeeId);

  if (loading || !moodStats) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-gray-600" />
            Estatísticas do Humor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-3"></div>
            <p className="text-gray-600">Carregando estatísticas...</p>
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
        return 'text-green-600 bg-green-50';
      case 'piorando':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const averageScore = parseFloat(moodStats.avgMood?.toFixed(1) || '0');
  const averagePercentage = (averageScore / 5) * 100;

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-gray-100 border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <BarChart3 className="mr-2 h-5 w-5 text-slate-600" />
          Estatísticas do Humor
        </CardTitle>
        <CardDescription className="text-slate-600">
          Últimos 30 dias • {moodStats.totalLogs} registros
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Humor Médio */}
        <div className="bg-white/60 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Humor Médio</span>
            <span className="text-2xl font-bold text-slate-800">{averageScore}/5</span>
          </div>
          <Progress value={averagePercentage} className="h-3" />
        </div>

        {/* Tendência */}
        <div className={`flex items-center gap-3 p-3 rounded-lg ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-medium">
            Seu humor está {moodStats.moodTrend}
          </span>
        </div>

        {/* Distribuição do Humor */}
        <div>
          <h4 className="text-sm font-medium mb-4 text-gray-900">Distribuição do Humor</h4>
          <div className="space-y-3">
            {MOOD_OPTIONS.map((mood) => {
              const count = moodStats.moodDistribution?.[mood.score.toString()] || 0;
              const percentage = moodStats.totalLogs > 0 ? (count / moodStats.totalLogs) * 100 : 0;
              
              return (
                <div key={mood.score} className="bg-white/40 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{mood.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-800">{mood.description}</span>
                        <span className="text-xs text-gray-600 bg-white/60 px-2 py-1 rounded">
                          {count} vez{count !== 1 ? 'es' : ''}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
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
