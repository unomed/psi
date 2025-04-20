
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CalendarClock, CheckCircle } from "lucide-react";
import { ScheduledAssessmentsList } from "./ScheduledAssessmentsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScheduledAssessment } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface AssessmentTabsProps {
  companyId?: string | null;
}

export function AssessmentTabs({ companyId }: AssessmentTabsProps) {
  const { userRole } = useAuth();
  
  const { data: scheduledAssessments = [], isLoading } = useQuery({
    queryKey: ['scheduledAssessments', companyId],
    queryFn: async () => {
      try {
        // Iniciar a consulta
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
            checklist_templates (
              title
            )
          `);
          
        // Se um ID de empresa for fornecido, filtrar os funcionários pelo ID da empresa
        if (companyId && userRole !== 'superadmin') {
          query = query.in('employee_id', 
            supabase
              .from('employees')
              .select('id')
              .eq('company_id', companyId)
          );
        }
        
        // Ordenar e executar a consulta
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
            employees: {
              name: item.employee_name || 'Funcionário não encontrado',
              email: '',
              phone: ''
            },
            checklist_templates: item.checklist_templates
          } as ScheduledAssessment;
        });
      } catch (error) {
        console.error("Error in assessment fetching process:", error);
        toast.error("Erro ao carregar avaliações agendadas");
        return [];
      }
    }
  });

  const scheduledItems = scheduledAssessments.filter(
    assessment => assessment.status === 'scheduled'
  );

  const completedItems = scheduledAssessments.filter(
    assessment => assessment.status === 'completed'
  );

  if (isLoading) {
    return <div>Carregando avaliações...</div>;
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            Agendado ({scheduledItems.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Concluído ({completedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="pt-4">
          <ScheduledAssessmentsList 
            assessments={scheduledItems}
            type="scheduled"
          />
        </TabsContent>

        <TabsContent value="completed" className="pt-4">
          <ScheduledAssessmentsList 
            assessments={completedItems}
            type="completed"
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
