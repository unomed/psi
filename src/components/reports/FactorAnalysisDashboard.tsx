/**
 * DASHBOARD DE ANÁLISE DE FATORES DE RISCO
 * Exibe análise detalhada dos 11 fatores psicossociais por setor e função
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  BarChart3, 
  TrendingUp,
  Users,
  Building,
  UserCheck
} from "lucide-react";
import { FactorRiskData } from "@/hooks/reports/useFactorAnalysis";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface FactorAnalysisDashboardProps {
  data: FactorRiskData[];
  isLoading: boolean;
  companyName: string;
}

export function FactorAnalysisDashboard({ data, isLoading, companyName }: FactorAnalysisDashboardProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'baixo': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'alto': return 'bg-orange-100 text-orange-800';
      case 'critico': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelFromScore = (score: number): string => {
    if (score < 25) return 'baixo';
    if (score < 50) return 'medio';
    if (score < 75) return 'alto';
    return 'critico';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Análise de Fatores de Risco Psicossocial</h2>
        <p className="text-muted-foreground">
          Avaliação detalhada dos 11 fatores por setor e função na empresa {companyName}
        </p>
      </div>

      {/* Visão geral dos fatores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((factor, index) => {
          const totalAssessments = factor.overall.baixo + factor.overall.medio + factor.overall.alto + factor.overall.critico;
          const highRiskCount = factor.overall.alto + factor.overall.critico;
          const highRiskPercentage = totalAssessments > 0 ? (highRiskCount / totalAssessments) * 100 : 0;
          const riskLevel = getRiskLevelFromScore(factor.overall.averageScore);
          
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{factor.factorName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{factor.overall.averageScore.toFixed(1)}</span>
                    <Badge className={getRiskLevelColor(riskLevel)}>
                      {riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <Progress value={factor.overall.averageScore} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {totalAssessments} avaliações • {highRiskPercentage.toFixed(1)}% alto risco
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Análise detalhada por fator */}
      {data.map((factor, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {factor.factorName} - Análise Detalhada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Gráfico de distribuição geral */}
              <div>
                <h4 className="text-lg font-medium mb-4">Distribuição Geral</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Baixo', value: factor.overall.baixo, fill: '#22c55e' },
                          { name: 'Médio', value: factor.overall.medio, fill: '#f59e0b' },
                          { name: 'Alto', value: factor.overall.alto, fill: '#f97316' },
                          { name: 'Crítico', value: factor.overall.critico, fill: '#ef4444' }
                        ].filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: 'Baixo', value: factor.overall.baixo, fill: '#22c55e' },
                          { name: 'Médio', value: factor.overall.medio, fill: '#f59e0b' },
                          { name: 'Alto', value: factor.overall.alto, fill: '#f97316' },
                          { name: 'Crítico', value: factor.overall.critico, fill: '#ef4444' }
                        ].filter(item => item.value > 0).map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Análise por setor */}
              <div>
                <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Por Setor
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {factor.bySector
                    .sort((a, b) => b.averageScore - a.averageScore)
                    .map((sector, idx) => {
                      const riskLevel = getRiskLevelFromScore(sector.averageScore);
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <div className="font-medium text-sm">{sector.sectorName}</div>
                            <div className="text-xs text-muted-foreground">
                              Score: {sector.averageScore.toFixed(1)}
                            </div>
                          </div>
                          <Badge className={getRiskLevelColor(riskLevel)}>
                            {riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Análise por função */}
              <div>
                <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Por Função
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {factor.byRole
                    .sort((a, b) => b.averageScore - a.averageScore)
                    .map((role, idx) => {
                      const riskLevel = getRiskLevelFromScore(role.averageScore);
                      return (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <div className="font-medium text-sm">{role.roleName}</div>
                            <div className="text-xs text-muted-foreground">
                              Score: {role.averageScore.toFixed(1)}
                            </div>
                          </div>
                          <Badge className={getRiskLevelColor(riskLevel)}>
                            {riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}