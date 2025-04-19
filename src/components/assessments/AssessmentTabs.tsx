
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { CalendarClock, CheckCircle } from "lucide-react";
import { ScheduledAssessmentsList } from "./ScheduledAssessmentsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScheduledAssessment } from "@/types";

export function AssessmentTabs() {
  // Fetch scheduled assessments
  const { data: scheduledAssessments = [], isLoading } = useQuery({
    queryKey: ['scheduledAssessments'],
    queryFn: async () => {
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
        console.error("Error fetching scheduled assessments:", error);
        return [];
      }

      return data as ScheduledAssessment[];
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
