
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useEmployeeMoodSafe } from "@/hooks/useEmployeeMoodSafe";

interface MoodStatsCardProps {
  employeeId: string;
}

export function MoodStatsCard({ employeeId }: MoodStatsCardProps) {
  const { mood, isLoading, error } = useEmployeeMoodSafe(employeeId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Humor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Humor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Mock data for demonstration
  const mockStats = {
    currentMood: mood || 'neutral',
    weeklyAverage: 7.2,
    monthlyTrend: 'up',
    streakDays: 5
  };

  const getTrendIcon = () => {
    switch (mockStats.monthlyTrend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMoodColor = (moodValue: string) => {
    const moodColors: Record<string, string> = {
      'muito_feliz': 'bg-green-100 text-green-800',
      'feliz': 'bg-green-50 text-green-700',
      'neutro': 'bg-gray-100 text-gray-800',
      'triste': 'bg-yellow-100 text-yellow-800',
      'muito_triste': 'bg-red-100 text-red-800'
    };
    return moodColors[moodValue] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Estatísticas de Humor
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Humor Atual</p>
          <Badge className={getMoodColor(mockStats.currentMood)}>
            {mockStats.currentMood}
          </Badge>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Média Semanal</p>
          <p className="text-lg font-semibold">{mockStats.weeklyAverage}/10</p>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-1">Sequência Atual</p>
          <p className="text-sm text-gray-600">{mockStats.streakDays} dias consecutivos</p>
        </div>
      </CardContent>
    </Card>
  );
}
