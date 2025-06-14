
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEmployeeAssessments } from '@/hooks/useEmployeeAssessments';
import { Clock, ExternalLink, Calendar } from 'lucide-react';
import { formatDate } from '@/utils/dateFormat';

interface PendingAssessmentsListProps {
  employeeId: string;
}

export function PendingAssessmentsList({ employeeId }: PendingAssessmentsListProps) {
  const { pendingAssessments, loading } = useEmployeeAssessments(employeeId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📋 Avaliações Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            Carregando avaliações...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingAssessments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>📋 Avaliações Pendentes</CardTitle>
          <CardDescription>
            Suas avaliações programadas aparecerão aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-lg font-medium">Nenhuma avaliação pendente!</p>
            <p className="text-sm text-muted-foreground">
              Você está em dia com suas avaliações.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📋 Avaliações Pendentes</CardTitle>
        <CardDescription>
          {pendingAssessments.length} avaliação(ões) aguardando sua resposta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingAssessments.map((assessment) => (
          <div
            key={assessment.assessmentId}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{assessment.templateTitle}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {assessment.templateDescription}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {assessment.daysRemaining <= 0 ? (
                  <Badge variant="destructive">Vencida</Badge>
                ) : assessment.daysRemaining <= 3 ? (
                  <Badge variant="secondary">Urgente</Badge>
                ) : (
                  <Badge variant="outline">{assessment.daysRemaining} dias</Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Agendada para {formatDate(new Date(assessment.scheduledDate))}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>~15-20 min</span>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => window.open(assessment.linkUrl, '_blank')}
              disabled={!assessment.linkUrl}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Responder Avaliação
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
