
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CalendarClock, CheckCircle } from "lucide-react";
import { ScheduledAssessmentsList } from "./ScheduledAssessmentsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScheduledAssessment } from "@/types";
import { toast } from "sonner";

export function AssessmentTabs() {
  // Fetch scheduled assessments
  const { data: scheduledAssessments = [], isLoading } = useQuery({
    queryKey: ['scheduledAssessments'],
    queryFn: async () => {
      try {
        // First try to fetch with join
        const { data, error } = await supabase
          .from('scheduled_assessments')
          .select(`
            id,
            employee_id,
            template_id,
            scheduled_date,
            status,
            completed_at,
            phone_number,
            link_url,
            sent_at,
            employees (
              name,
              email,
              phone
            ),
            checklist_templates (
              title
            )
          `)
          .order('scheduled_date', { ascending: false });

        if (error) {
          console.error("Error fetching scheduled assessments with join:", error);
          
          // If error in join, try without join and fetch employee data separately
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('scheduled_assessments')
            .select(`
              id,
              employee_id,
              template_id,
              scheduled_date,
              status,
              completed_at,
              phone_number,
              link_url,
              sent_at
            `)
            .order('scheduled_date', { ascending: false });
          
          if (fallbackError) {
            console.error("Error fetching scheduled assessments:", fallbackError);
            toast.error("Erro ao carregar avaliações agendadas");
            return [];
          }
          
          // Transform the data to match our ScheduledAssessment type
          return fallbackData.map(item => {
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
                name: 'Carregando funcionário...',
                email: '',
                phone: ''
              },
              checklist_templates: {
                title: 'Carregando modelo...'
              }
            } as ScheduledAssessment;
          });
        }

        // Transform the data to match our ScheduledAssessment type
        return data.map(item => {
          // Create a default empty employee object for safe access
          const employeeInfo = {
            name: 'Funcionário não encontrado',
            email: '',
            phone: ''
          };

          // Only try to extract employee data if it exists and is an object
          if (item.employees && typeof item.employees === 'object') {
            const employee = item.employees as { name?: string; email?: string; phone?: string };
            employeeInfo.name = employee.name || 'Funcionário não encontrado';
            employeeInfo.email = employee.email || '';
            employeeInfo.phone = employee.phone || '';
          }

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
            employees: employeeInfo,
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
