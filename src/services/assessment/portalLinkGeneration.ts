
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function generateEmployeePortalLink(
  employeeId: string,
  assessmentId: string
): Promise<{ linkUrl: string; portalToken: string } | null> {
  try {
    // Generate unique portal token
    const portalToken = crypto.randomUUID().replace(/-/g, '');
    
    // Generate the portal URL with employee and assessment parameters
    const linkUrl = `https://avaliacao.unomed.med.br/employee-portal?employee=${employeeId}&assessment=${assessmentId}&token=${portalToken}`;
    
    console.log("Portal link generated:", linkUrl);
    
    return { linkUrl, portalToken };
  } catch (error) {
    console.error("Error generating portal link:", error);
    toast.error("Erro ao gerar link do portal");
    return null;
  }
}

export async function validatePortalAccess(
  employeeId: string, 
  assessmentId: string, 
  token: string
): Promise<boolean> {
  try {
    // Verify that the assessment exists and belongs to the employee
    const { data: assessment, error } = await supabase
      .from('scheduled_assessments')
      .select('employee_id, status')
      .eq('id', assessmentId)
      .eq('employee_id', employeeId)
      .single();
    
    if (error || !assessment) {
      console.error("Assessment not found or doesn't belong to employee:", error);
      return false;
    }
    
    // Check if assessment is still valid (not completed)
    if (assessment.status === 'completed') {
      console.log("Assessment already completed");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error validating portal access:", error);
    return false;
  }
}
