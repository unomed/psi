
import { supabase } from "@/integrations/supabase/client";
import { AssessmentStatus, ScheduledAssessment, RecurrenceType } from "@/types";
import { toast } from "sonner";
import { getPeriodicityForRiskLevel } from "@/utils/assessmentUtils";

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

export async function generateAssessmentLink(assessmentId: string) {
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
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days expiration
      })
      .select()
      .single();

    if (linkError) throw linkError;

    // Update assessment with link and status
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

export async function sendAssessmentEmail(assessmentId: string, email: string) {
  try {
    const { data: assessment, error: assessmentError } = await supabase
      .from('scheduled_assessments')
      .select('*, checklist_templates(title)')
      .eq('id', assessmentId)
      .single();

    if (assessmentError) throw assessmentError;

    // First generate/get the link
    let link = assessment.link_url;
    if (!link) {
      await generateAssessmentLink(assessmentId);
      const { data: updatedAssessment } = await supabase
        .from('scheduled_assessments')
        .select('link_url')
        .eq('id', assessmentId)
        .single();
      link = updatedAssessment?.link_url;
    }

    // Store email record
    const { error: emailError } = await supabase
      .from('assessment_emails')
      .insert({
        scheduled_assessment_id: assessmentId,
        subject: `Avaliação: ${assessment.checklist_templates?.title}`,
        body: `Você foi convidado para realizar uma avaliação. Acesse o link: ${link}`,
        recipient_email: email
      });

    if (emailError) throw emailError;

    // Update assessment status
    const { error: updateError } = await supabase
      .from('scheduled_assessments')
      .update({ status: 'sent' })
      .eq('id', assessmentId);

    if (updateError) throw updateError;

    toast.success("Email enviado com sucesso!");
    return true;
  } catch (error) {
    console.error("Error sending assessment email:", error);
    toast.error("Erro ao enviar email");
    throw error;
  }
}

// Add the missing functions for AssessmentPage
export async function fetchAssessmentByToken(token: string) {
  try {
    // Find the assessment link by token
    const { data: linkData, error: linkError } = await supabase
      .from('assessment_links')
      .select('*')
      .eq('token', token)
      .single();

    if (linkError) {
      if (linkError.code === 'PGRST116') {
        return { error: "Link de avaliação não encontrado ou expirado", template: null, assessmentId: null };
      }
      throw linkError;
    }

    // Check if the link has expired
    if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
      return { error: "Link de avaliação expirado", template: null, assessmentId: null };
    }

    // Check if the link has already been used
    if (linkData.used_at) {
      return { error: "Link de avaliação já foi utilizado", template: null, assessmentId: null };
    }

    // Fetch the assessment template
    const { data: template, error: templateError } = await supabase
      .from('checklist_templates')
      .select('*')
      .eq('id', linkData.template_id)
      .single();

    if (templateError) {
      return { error: "Modelo de avaliação não encontrado", template: null, assessmentId: null };
    }

    // Get assessment ID from scheduled_assessments
    const { data: assessmentData } = await supabase
      .from('scheduled_assessments')
      .select('id')
      .eq('template_id', linkData.template_id)
      .eq('employee_id', linkData.employee_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return { 
      template, 
      error: null, 
      assessmentId: assessmentData?.id || null,
      linkId: linkData.id
    };
  } catch (error) {
    console.error("Error fetching assessment by token:", error);
    return { error: "Erro ao buscar avaliação", template: null, assessmentId: null };
  }
}

export async function submitAssessmentResult(resultData: Omit<any, "id" | "completedAt">) {
  try {
    // Insert the assessment result
    const { data: result, error } = await supabase
      .from('assessment_responses')
      .insert({
        template_id: resultData.templateId,
        employee_id: resultData.employeeId,
        employee_name: resultData.employeeName,
        response_data: resultData.responses,
        factors_scores: resultData.factorsScores,
        dominant_factor: resultData.dominantFactor,
        notes: resultData.notes
      })
      .select()
      .single();

    if (error) {
      return { error: "Erro ao salvar resultado da avaliação", result: null };
    }

    // Update the assessment link as used
    if (resultData.linkId) {
      await supabase
        .from('assessment_links')
        .update({ used_at: new Date().toISOString() })
        .eq('id', resultData.linkId);
    }

    // Update scheduled assessment as completed if assessmentId is provided
    if (resultData.assessmentId) {
      await supabase
        .from('scheduled_assessments')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', resultData.assessmentId);
    }

    return { result, error: null };
  } catch (error) {
    console.error("Error submitting assessment result:", error);
    return { error: "Erro ao enviar resultado da avaliação", result: null };
  }
}
