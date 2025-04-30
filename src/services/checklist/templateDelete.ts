
import { supabase } from "@/integrations/supabase/client";

export async function deleteChecklistTemplate(templateId: string): Promise<void> {
  console.log("Deleting checklist template with ID:", templateId);
  
  // First delete related questions
  const { error: questionsDeleteError, count: deletedQuestionsCount } = await supabase
    .from('questions')
    .delete()
    .eq('template_id', templateId)
    .select('count');

  console.log(`Deleted ${deletedQuestionsCount} questions for template ${templateId}`);

  if (questionsDeleteError) {
    console.error("Error deleting template questions:", questionsDeleteError);
    throw questionsDeleteError;
  }

  // Then delete the template itself
  const { error: templateDeleteError, count: deletedTemplateCount } = await supabase
    .from('checklist_templates')
    .delete()
    .eq('id', templateId)
    .select('count');

  console.log(`Deleted template ${templateId}: count = ${deletedTemplateCount}`);

  if (templateDeleteError) {
    console.error("Error deleting checklist template:", templateDeleteError);
    throw templateDeleteError;
  }

  if (deletedTemplateCount === 0) {
    console.warn("No template was deleted. Template might not exist or user doesn't have permission.");
    throw new Error("Falha ao excluir o modelo. Verifique as permissões ou se o modelo ainda existe.");
  }
}
