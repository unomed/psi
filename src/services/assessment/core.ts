
import { supabase } from "@/integrations/supabase/client";
import { AssessmentStatus, ScheduledAssessment, RecurrenceType } from "@/types";

export async function createScheduledAssessment(data: {
  employeeId: string;
  templateId: string;
  scheduledDate: Date;
  recurrenceType?: RecurrenceType;
  phoneNumber?: string;
}) {
  try {
    const { data: assessment, error } = await supabase
      .from('scheduled_assessments')
      .insert({
        employee_id: data.employeeId,
        template_id: data.templateId,
        scheduled_date: data.scheduledDate.toISOString(),
        recurrence_type: data.recurrenceType,
        phone_number: data.phoneNumber,
        status: "scheduled" as AssessmentStatus,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return assessment;
  } catch (error) {
    console.error("Error creating assessment:", error);
    throw error;
  }
}

export async function saveScheduledAssessment(
  assessment: Omit<ScheduledAssessment, "id">
): Promise<string> {
  const { data, error } = await supabase
    .from('scheduled_assessments')
    .insert({
      employee_id: assessment.employeeId,
      template_id: assessment.templateId,
      scheduled_date: assessment.scheduledDate.toISOString(),
      status: assessment.status,
      recurrence_type: assessment.recurrenceType,
      next_scheduled_date: assessment.nextScheduledDate?.toISOString(),
      phone_number: assessment.phoneNumber,
      link_url: assessment.linkUrl,
      sent_at: assessment.sentAt?.toISOString(),
      completed_at: assessment.completedAt?.toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving scheduled assessment:", error);
    throw error;
  }

  return data.id;
}
