
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function generateAssessmentLinkFromId(assessmentId: string) {
  try {
    const { data: assessment, error: assessmentError } = await supabase
      .from('scheduled_assessments')
      .select('employee_id, template_id')
      .eq('id', assessmentId)
      .single();

    if (assessmentError) throw assessmentError;

    const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const { data: link, error: linkError } = await supabase
      .from('assessment_links')
      .insert({
        template_id: assessment.template_id,
        employee_id: assessment.employee_id,
        token,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (linkError) throw linkError;

    const { error: updateError } = await supabase
      .from('scheduled_assessments')
      .update({
        link_url: `${window.location.origin}/avaliacao/${token}`,
        status: 'sent'
      })
      .eq('id', assessmentId);

    if (updateError) throw updateError;

    return link;
  } catch (error) {
    console.error("Error generating assessment link:", error);
    throw error;
  }
}

export async function sendAssessmentEmail(assessmentId: string) {
  try {
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
  } catch (error) {
    console.error("Error sending assessment email:", error);
    throw error;
  }
}
