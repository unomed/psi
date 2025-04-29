
import { supabase } from "@/integrations/supabase/client";

export async function deleteChecklistTemplate(templateId: string): Promise<void> {
  const { error: questionsDeleteError } = await supabase
    .from('questions')
    .delete()
    .eq('template_id', templateId);

  if (questionsDeleteError) {
    console.error("Error deleting template questions:", questionsDeleteError);
    throw questionsDeleteError;
  }

  const { error: templateDeleteError } = await supabase
    .from('checklist_templates')
    .delete()
    .eq('id', templateId);

  if (templateDeleteError) {
    console.error("Error deleting checklist template:", templateDeleteError);
    throw templateDeleteError;
  }
}
