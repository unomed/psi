
import { toast } from "sonner";
import { ChecklistTemplate } from "@/types";
import { createGeneratedLink } from "@/services/assessmentHandlerService";

export function useLinkOperations({
  selectedEmployee,
  selectedTemplate,
  setGeneratedLink,
  setIsLinkDialogOpen
}: {
  selectedEmployee: string | null;
  selectedTemplate: ChecklistTemplate | null;
  setGeneratedLink: (link: string) => void;
  setIsLinkDialogOpen: (isOpen: boolean) => void;
}) {
  const handleGenerateLink = () => {
    if (!selectedEmployee || !selectedTemplate) {
      toast.error("Selecione um funcionário e um modelo de checklist para gerar o link.");
      return;
    }
    
    const newLink = createGeneratedLink(selectedTemplate.id, selectedEmployee);
    setGeneratedLink(newLink);
    setIsLinkDialogOpen(true);
  };

  return { handleGenerateLink };
}
