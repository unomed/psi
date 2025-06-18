
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useEmployeeMoodSafe } from "@/hooks/useEmployeeMoodSafe";

interface MoodStatsCardProps {
  employeeId: string;
}

export function MoodStatsCard({ employeeId }: MoodStatsCardProps) {
  // Check React availability first
  if (typeof React === 'undefined' || !React) {
    console.warn('[MoodStatsCard] React not available');
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Sistema temporariamente indisponível.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { moodStats, loading } = useEmployeeMoodSafe(employeeId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!moodStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Registre seu humor diariamente para ver estatísticas.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (moodStats.moodTrend) {
      case 'melhorando':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'piorando':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Estatísticas de Humor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Humor médio</span>
          <span className="font-medium">{moodStats.avgMood.toFixed(1)}/5</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Tendência</span>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="text-sm font-medium capitalize">{moodStats.moodTrend}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Registros</span>
          <span className="font-medium">{moodStats.totalLogs}</span>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 text-center">
            Últimos 30 dias
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
