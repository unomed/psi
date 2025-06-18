
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Calendar, ExternalLink } from "lucide-react";
import { useEmployeeAssessments } from "@/hooks/useEmployeeAssessments";

interface PendingAssessmentsListProps {
  employeeId: string;
}

export function PendingAssessmentsList({ employeeId }: PendingAssessmentsListProps) {
  const { assessments, loading, error } = useEmployeeAssessments(employeeId);

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
          <p className="text-sm text-red-600">Erro ao carregar avaliações</p>
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
        <Card key={assessment.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium text-gray-900">{assessment.templateTitle}</h4>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Prazo: {new Date(assessment.dueDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ExternalLink className="h-4 w-4 mr-1" />
                Abrir
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
