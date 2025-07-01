
import { supabase } from "@/integrations/supabase/client";

export async function copyTemplateForCompany(
  templateId: string, 
  companyId: string, 
  newTitle?: string
): Promise<string> {
  const { data, error } = await supabase
    .rpc('copy_template_for_company', {
      template_id: templateId,
      company_id: companyId,
      new_title: newTitle
    });

  if (error) {
    console.error("Error copying template:", error);
    throw error;
  }

  return data;
}
