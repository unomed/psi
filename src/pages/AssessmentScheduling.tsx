
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Users, FileText } from "lucide-react";
import { SchedulingWorkflow } from "@/components/assessment-scheduling/SchedulingWorkflow";
import { ScheduledAssessmentsList } from "@/components/assessment-scheduling/ScheduledAssessmentsList";
import { AssessmentMetrics } from "@/components/assessment-scheduling/AssessmentMetrics";
import { useAuth } from "@/contexts/AuthContext";

export default function AssessmentScheduling() {
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agendamento de Avaliações</h1>
          <p className="text-muted-foreground">
            Gerencie e agende avaliações psicossociais para funcionários
          </p>
        </div>
        <Button onClick={() => setIsSchedulingOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Avaliação
        </Button>
      </div>

      {/* Métricas */}
      <AssessmentMetrics />

      {/* Lista de avaliações agendadas */}
      <ScheduledAssessmentsList />

      {/* Modal de agendamento */}
      <SchedulingWorkflow 
        isOpen={isSchedulingOpen}
        onClose={() => setIsSchedulingOpen(false)}
      />
    </div>
  );
}
