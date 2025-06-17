
import { useEmployeeAssessments } from "@/hooks/useEmployeeAssessments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PendingAssessmentsListProps {
  employeeId: string;
  highlightAssessmentId?: string | null;
}

export function PendingAssessmentsList({ employeeId, highlightAssessmentId }: PendingAssessmentsListProps) {
  const { pendingAssessments, loading } = useEmployeeAssessments(employeeId);

  const handleStartAssessment = (linkUrl: string) => {
    // Abrir a avaliação na mesma aba
    window.location.href = linkUrl;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Carregando avaliações...</div>
        </CardContent>
      </Card>
    );
  }

  if (!pendingAssessments || pendingAssessments.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma avaliação pendente
            </h3>
            <p>Você não possui avaliações agendadas no momento.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {highlightAssessmentId && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você foi direcionado para uma avaliação específica. Ela está destacada abaixo.
          </AlertDescription>
        </Alert>
      )}
      
      {pendingAssessments.map((assessment) => {
        const isHighlighted = highlightAssessmentId === assessment.assessmentId;
        const daysRemaining = assessment.daysRemaining;
        const isOverdue = daysRemaining < 0;
        const isUrgent = daysRemaining <= 3 && daysRemaining >= 0;

        return (
          <Card 
            key={assessment.assessmentId} 
            className={`transition-all ${
              isHighlighted 
                ? 'ring-2 ring-blue-500 shadow-lg border-blue-200 bg-blue-50' 
                : isOverdue 
                  ? 'border-red-200 bg-red-50' 
                  : isUrgent 
                    ? 'border-yellow-200 bg-yellow-50' 
                    : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {assessment.templateTitle}
                    {isHighlighted && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Nova Avaliação
                      </Badge>
                    )}
                  </CardTitle>
                  {assessment.templateDescription && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {assessment.templateDescription}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(assessment.scheduledDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {isOverdue ? (
                    <Badge variant="destructive">
                      Atrasada ({Math.abs(daysRemaining)} dias)
                    </Badge>
                  ) : isUrgent ? (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Urgente ({daysRemaining} dias restantes)
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      {daysRemaining} dias restantes
                    </Badge>
                  )}
                </div>
                
                <Button 
                  onClick={() => handleStartAssessment(assessment.linkUrl)}
                  variant={isHighlighted ? "default" : "outline"}
                  size="sm"
                  className={isHighlighted ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {isHighlighted ? "Responder Agora" : "Iniciar Avaliação"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
