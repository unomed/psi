
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, AlertTriangle, Filter } from 'lucide-react';

interface NR01RiskStatisticsProps {
  riskStats: {
    totalAnalyses: number;
    riskLevels: {
      baixo: number;
      medio: number;
      alto: number;
      critico: number;
    };
  };
  activePlansCount: number;
}

export function NR01RiskStatistics({ riskStats, activePlansCount }: NR01RiskStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">Total de Análises</p>
              <p className="text-2xl font-bold">{riskStats.totalAnalyses}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-sm font-medium">Riscos Críticos</p>
              <p className="text-2xl font-bold text-red-600">{riskStats.riskLevels.critico}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-sm font-medium">Riscos Altos</p>
              <p className="text-2xl font-bold text-orange-600">{riskStats.riskLevels.alto}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">Planos Ativos</p>
              <p className="text-2xl font-bold text-green-600">{activePlansCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
