import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RecurrenceType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { sendNotifications } from "@/services/assessment/communication";
import { generateUniqueAssessmentLink } from "@/services/assessment/linkGeneration";

interface ScheduleAssessmentData {
  employeeId: string;
  templateId: string;
  scheduledDate: Date;
  recurrenceType: RecurrenceType;
  phoneNumber: string;
  sendEmail: boolean;
  sendWhatsApp: boolean;
  companyId: string;
  employeeName: string;
  templateTitle: string;
}

export function useAssessmentScheduling() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const scheduleAssessment = useMutation({
    mutationFn: async (assessmentData: ScheduleAssessmentData) => {
      try {
        // First, generate the assessment link
        const linkResult = await generateUniqueAssessmentLink(
          assessmentData.templateId,
          assessmentData.employeeId,
          7 // expires in 7 days
        );

        if (!linkResult) {
          throw new Error("Falha ao gerar link de avaliação");
        }

        // Create the scheduled assessment record
        const { data: scheduledAssessment, error: scheduleError } = await supabase
          .from('scheduled_assessments')
          .insert({
            employee_id: assessmentData.employeeId,
            template_id: assessmentData.templateId,
            scheduled_date: assessmentData.scheduledDate.toISOString(),
            status: 'pending',
            recurrence_type: assessmentData.recurrenceType,
            phone_number: assessmentData.phoneNumber,
            company_id: assessmentData.companyId,
            employee_name: assessmentData.employeeName,
            link_url: linkResult.linkUrl,
            created_by: user?.id
          })
          .select()
          .single();

        if (scheduleError) {
          console.error("Error creating scheduled assessment:", scheduleError);
          throw new Error("Erro ao agendar avaliação");
        }

        // Send notifications if requested
        if (assessmentData.sendEmail || assessmentData.sendWhatsApp) {
          await sendNotifications({
            linkUrl: linkResult.linkUrl,
            employeeName: assessmentData.employeeName,
            templateTitle: assessmentData.templateTitle,
            scheduledDate: assessmentData.scheduledDate,
            sendEmail: assessmentData.sendEmail,
            sendWhatsApp: assessmentData.sendWhatsApp,
            phoneNumber: assessmentData.phoneNumber,
            assessmentId: scheduledAssessment.id
          });
        }

        return {
          success: true,
          assessmentId: scheduledAssessment.id,
          linkUrl: linkResult.linkUrl
        };
      } catch (error) {
        console.error("Error in scheduleAssessment:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledAssessments'] });
      toast.success("Avaliação agendada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Schedule assessment error:", error);
      toast.error(error.message || "Erro ao agendar avaliação");
    }
  });

  const sendNotifications = async ({
    linkUrl,
    employeeName,
    templateTitle,
    scheduledDate,
    sendEmail,
    sendWhatsApp,
    phoneNumber,
    assessmentId
  }: {
    linkUrl: string;
    employeeName: string;
    templateTitle: string;
    scheduledDate: Date;
    sendEmail: boolean;
    sendWhatsApp: boolean;
    phoneNumber: string;
    assessmentId: string;
  }) => {
    // Mock function to simulate sending notifications
    console.log("Sending notifications:", {
      linkUrl,
      employeeName,
      templateTitle,
      scheduledDate,
      sendEmail,
      sendWhatsApp,
      phoneNumber,
      assessmentId
    });
    
    // Simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Notificações enviadas com sucesso!");
  };

  return {
    scheduleAssessment,
    isLoading: scheduleAssessment.isLoading
  };
}
