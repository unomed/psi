
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock } from "lucide-react";

interface Assessment {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  dueDate?: Date;
  completedAt?: Date;
  description?: string;
}

interface AssessmentCardProps {
  assessment: Assessment;
  showActions?: boolean;
}

export function AssessmentCard({ assessment, showActions = true }: AssessmentCardProps) {
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
}
