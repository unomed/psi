
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, FileText, Sparkles, Heart } from "lucide-react";
import { useEmployeeAssessments } from "@/hooks/useEmployeeAssessments";
import { WellnessCard } from "./modern/WellnessCard";
import { DailyHealthMessage } from "./modern/DailyHealthMessage";
import { ModernMoodSelector } from "./modern/ModernMoodSelector";
import { QuestionnaireStatsCard } from "./modern/QuestionnaireStatsCard";

interface Assessment {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  dueDate?: Date;
  completedAt?: Date;
  description?: string;
}

interface EmployeeSimpleDashboardProps {
  employeeId: string;
  employeeName: string;
  companyName?: string;
}

export function EmployeeSimpleDashboard({
  employeeId,
  employeeName,
  companyName = "Empresa"
}: EmployeeSimpleDashboardProps) {
  const { assessments, loading } = useEmployeeAssessments(employeeId);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Convert assessments to Assessment interface
  const convertedAssessments: Assessment[] = assessments.map(assessment => ({
    id: assessment.id,
    title: assessment.title || assessment.template_name || 'Avaliação sem título',
    status: assessment.status,
    dueDate: assessment.dueDate,
    completedAt: assessment.completedAt,
    description: assessment.description
  }));

  // Separate assessments by status
  const pendingAssessments = convertedAssessments.filter(a => a.status === 'pending');
  const completedAssessments = convertedAssessments.filter(a => a.status === 'completed');

  const stats = [
    {
      title: "Avaliações Pendentes",
      value: pendingAssessments.length,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Avaliações Concluídas",
      value: completedAssessments.length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total de Avaliações",
      value: convertedAssessments.length,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ];

  const AssessmentCard = ({ assessment, showActions = true }: { assessment: Assessment; showActions?: boolean }) => {
    const getStatusIcon = () => {
      return assessment.status === 'completed' ? CheckCircle : Clock;
    };

    const getStatusColor = () => {
      return assessment.status === 'completed' ? 'text-green-600' : 'text-orange-600';
    };

    const StatusIcon = getStatusIcon();

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{assessment.title}</CardTitle>
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-5 w-5 ${getStatusColor()}`} />
              <Badge variant={assessment.status === 'completed' ? 'default' : 'secondary'}>
                {assessment.status === 'completed' ? 'Concluída' : 'Pendente'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {assessment.description && (
            <p className="text-sm text-gray-600 mb-3">{assessment.description}</p>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Calendar className="h-4 w-4" />
            {assessment.status === 'completed' && assessment.completedAt ? (
              <span>Concluída em {assessment.completedAt.toLocaleDateString()}</span>
            ) : assessment.dueDate ? (
              <span>Prazo: {assessment.dueDate.toLocaleDateString()}</span>
            ) : (
              <span>Sem prazo definido</span>
            )}
          </div>

          {showActions && assessment.status === 'pending' && (
            <Button size="sm" className="w-full">
              Iniciar Avaliação
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {employeeName}!
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao seu portal de avaliações - {companyName}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className={`${stat.bgColor} border-none`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Health Check */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DailyHealthMessage />
              <ModernMoodSelector />
            </div>

            {/* Pending Assessments */}
            {pendingAssessments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    Avaliações Pendentes
                    <Badge variant="secondary">{pendingAssessments.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingAssessments.map((assessment) => (
                      <AssessmentCard
                        key={assessment.id}
                        assessment={assessment}
                        showActions={true}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completed Assessments */}
            {completedAssessments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Avaliações Concluídas
                    <Badge variant="outline">{completedAssessments.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedAssessments.slice(0, 3).map((assessment) => (
                      <AssessmentCard
                        key={assessment.id}
                        assessment={assessment}
                        showActions={false}
                      />
                    ))}
                    {completedAssessments.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        E mais {completedAssessments.length - 3} avaliações concluídas...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {convertedAssessments.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma avaliação encontrada
                  </h3>
                  <p className="text-gray-500">
                    Você não possui avaliações pendentes ou concluídas no momento.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuestionnaireStatsCard employeeId={employeeId} />
            <WellnessCard />
          </div>
        </div>
      </div>
    </div>
  );
}
