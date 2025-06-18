
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Calendar, Play } from "lucide-react";
import { useEmployeeAssessments } from "@/hooks/useEmployeeAssessments";
import { useNavigate } from "react-router-dom";

interface PendingAssessmentsListProps {
  employeeId: string;
  highlightAssessmentId?: string;
}

export function PendingAssessmentsList({ employeeId, highlightAssessmentId }: PendingAssessmentsListProps) {
  const { assessments, loading, error } = useEmployeeAssessments(employeeId);
  const navigate = useNavigate();

  const handleStartAssessment = (assessmentId: string) => {
    navigate(`/employee-portal/assessment/${assessmentId}`);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-red-600">Erro ao carregar avaliações: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900 mb-2">Nenhuma avaliação pendente</h3>
          <p className="text-sm text-gray-600">
            Você está em dia com suas avaliações!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {assessments.map((assessment) => (
        <Card 
          key={assessment.id}
          className={highlightAssessmentId === assessment.id ? "border-blue-500 bg-blue-50" : ""}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h4 className="font-medium text-gray-900">{assessment.templateTitle}</h4>
                
                {assessment.templateDescription && (
                  <p className="text-sm text-gray-600">{assessment.templateDescription}</p>
                )}
                
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Agendada: {new Date(assessment.scheduledDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  {assessment.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Prazo: {new Date(assessment.dueDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      assessment.status === 'sent' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {assessment.status === 'sent' ? 'Enviada' : 'Agendada'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="ml-4">
                <Button 
                  size="sm" 
                  onClick={() => handleStartAssessment(assessment.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Responder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
