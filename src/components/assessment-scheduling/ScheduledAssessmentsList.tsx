
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AssessmentItem } from './AssessmentItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from 'sonner';

interface ScheduledAssessmentsListProps {
  companyId?: string;
}

export function ScheduledAssessmentsList({ companyId }: ScheduledAssessmentsListProps) {
  const { userRole, userCompanies } = useAuth();
  const [generatingLink, setGeneratingLink] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  const { data: scheduledAssessments, isLoading, refetch } = useQuery({
    queryKey: ['scheduledAssessments', companyId],
    queryFn: async () => {
      try {
        let query = supabase
          .from('scheduled_assessments')
          .select(`
            id,
            employee_id,
            employee_name,
            template_id,
            scheduled_date,
            status,
            completed_at,
            phone_number,
            link_url,
            sent_at,
            company_id,
            checklist_templates (
              title
            )
          `);

        if (companyId && userRole !== 'superadmin') {
          query = query.eq('company_id', companyId);
        }

        const { data, error } = await query.order('scheduled_date', { ascending: false });

        if (error) {
          console.error("Error fetching scheduled assessments:", error);
          toast.error("Erro ao carregar avaliações agendadas");
          return [];
        }

        return data.map(item => {
          return {
            id: item.id,
            employeeId: item.employee_id,
            templateId: item.template_id,
            scheduledDate: new Date(item.scheduled_date),
            status: item.status,
            sentAt: item.sent_at ? new Date(item.sent_at) : null,
            completedAt: item.completed_at ? new Date(item.completed_at) : null,
            phoneNumber: item.phone_number || undefined,
            linkUrl: item.link_url || '',
            company_id: item.company_id,
            employees: {
              name: item.employee_name || 'Funcionário não encontrado',
              email: '',
              phone: ''
            },
            checklist_templates: item.checklist_templates
          };
        });
      } catch (error) {
        console.error("Error in assessment fetching process:", error);
        toast.error("Erro ao carregar avaliações agendadas");
        return [];
      }
    },
    enabled: !!companyId
  });

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      sent: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: "Agendada",
      sent: "Enviada",
      completed: "Concluída",
      overdue: "Em Atraso"
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleGenerateLink = async (assessment: any) => {
    // Implement generate link logic here
  };

  const handleCopyLink = async (linkUrl: string) => {
    // Implement copy link logic here
  };

  const handleSendEmail = async (assessmentId: string) => {
    // Implement send email logic here
  };

  const handleDeleteAssessment = async (assessmentId: string) => {
    // Implement delete assessment logic here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações Agendadas</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : scheduledAssessments && scheduledAssessments.length > 0 ? (
          <div className="space-y-4">
            {scheduledAssessments.map(assessment => (
              <AssessmentItem
                key={assessment.id}
                assessment={assessment}
                userCompanies={userCompanies}
                generatingLink={generatingLink}
                sendingEmail={sendingEmail}
                onGenerateLink={handleGenerateLink}
                onCopyLink={handleCopyLink}
                onSendEmail={handleSendEmail}
                onEditAssessment={() => { }}
                onDeleteAssessment={handleDeleteAssessment}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma avaliação agendada"
            description="Agende avaliações para seus funcionários."
          />
        )}
      </CardContent>
    </Card>
  );
}
