
import { supabase } from "@/integrations/supabase/client";
import { ScheduledAssessment } from "@/types";

export function generateAssessmentLink(templateId: string, employeeId: string): string {
  const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  return `${window.location.origin}/avaliacao/${token}`;
}

export async function fetchScheduledAssessments(): Promise<ScheduledAssessment[]> {
  const { data, error } = await supabase
    .from('scheduled_assessments')
    .select('*')
    .order('scheduled_date', { ascending: true });

  if (error) {
    console.error("Error fetching scheduled assessments:", error);
    throw error;
  }

  return data.map(assessment => ({
    id: assessment.id,
    employeeId: assessment.employee_id,
    templateId: assessment.template_id,
    scheduledDate: new Date(assessment.scheduled_date),
    sentAt: assessment.sent_at ? new Date(assessment.sent_at) : null,
    completedAt: assessment.completed_at ? new Date(assessment.completed_at) : null,
    nextScheduledDate: assessment.next_scheduled_date ? new Date(assessment.next_scheduled_date) : null,
    linkUrl: assessment.link_url || "",
    status: assessment.status as "scheduled" | "sent" | "completed",
    recurrenceType: assessment.recurrence_type as "none" | "monthly" | "semiannual" | "annual" | undefined,
    phoneNumber: assessment.phone_number
  }));
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

export async function sendAssessmentEmail(assessmentId: string): Promise<void> {
  const { error } = await supabase
    .from('scheduled_assessments')
    .update({ 
      status: 'sent',
      sent_at: new Date().toISOString()
    })
    .eq('id', assessmentId);

  if (error) {
    console.error("Error sending assessment email:", error);
    throw error;
  }
}
