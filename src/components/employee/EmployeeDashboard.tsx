
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssessmentResponse } from "./AssessmentResponse";
import { ChecklistTemplate, ScheduledAssessment } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface EmployeeDashboardProps {
  employeeId: string;
}

export function EmployeeDashboard({ employeeId }: EmployeeDashboardProps) {
  const [pendingAssessments, setPendingAssessments] = useState<ScheduledAssessment[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<ChecklistTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingAssessments();
  }, [employeeId]);

  const fetchPendingAssessments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scheduled_assessments')
        .select(`
          *,
          checklist_templates (*)
        `)
        .eq('employee_id', employeeId)
        .eq('status', 'scheduled');

      if (error) throw error;

      const mappedAssessments: ScheduledAssessment[] = (data || []).map(item => ({
        id: item.id,
        employeeId: item.employee_id,
        templateId: item.template_id,
        scheduledDate: new Date(item.scheduled_date),
        status: item.status,
        sentAt: item.sent_at ? new Date(item.sent_at) : null,
        completedAt: item.completed_at ? new Date(item.completed_at) : null,
        linkUrl: item.link_url || '',
        checklist_templates: item.checklist_templates
      }));

      setPendingAssessments(mappedAssessments);
    } catch (err) {
      console.error('Error fetching assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = (templateId: string) => {
    const assessment = pendingAssessments.find(a => a.templateId === templateId);
    if (assessment?.checklist_templates) {
      const templateData = assessment.checklist_templates;
      
      // Create template with proper type handling
      const template: ChecklistTemplate = {
        id: templateData.id || '',
        name: templateData.title || templateData.name || '',
        title: templateData.title || templateData.name || '',
        description: templateData.description || '',
        category: 'default',
        type: templateData.type || 'custom',
        scale_type: templateData.scale_type || 'likert_5',
        is_active: templateData.is_active ?? true,
        is_standard: templateData.is_standard ?? false,
        estimated_time_minutes: templateData.estimated_time_minutes || 15,
        version: typeof templateData.version === 'string' ? parseInt(templateData.version) : (templateData.version || 1),
        created_at: templateData.created_at || new Date().toISOString(),
        updated_at: templateData.updated_at || new Date().toISOString(),
        company_id: templateData.company_id,
        created_by: templateData.created_by,
        cutoff_scores: templateData.cutoff_scores,
        derived_from_id: templateData.derived_from_id,
        instructions: templateData.instructions,
        max_score: templateData.max_score
      };
      
      setActiveAssessment(template);
    }
  };

  const handleCompleteAssessment = () => {
    setActiveAssessment(null);
    fetchPendingAssessments();
  };

  if (activeAssessment) {
    return (
      <AssessmentResponse
        templateId={activeAssessment.id}
        employeeId={employeeId}
        onComplete={handleCompleteAssessment}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Minhas Avaliações Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingAssessments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhuma avaliação pendente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAssessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">
                      {assessment.checklist_templates?.title || 'Avaliação'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Agendada para: {assessment.scheduledDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{assessment.status}</Badge>
                    <Button onClick={() => handleStartAssessment(assessment.templateId)}>
                      Iniciar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
