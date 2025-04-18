
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, Copy, Share2, Phone } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { ChecklistTemplate, ScheduledAssessment } from "@/types";
import { mockEmployees } from "./AssessmentSelectionForm";

interface ShareAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: ScheduledAssessment | null;
  templates: ChecklistTemplate[];
}

export function ShareAssessmentDialog({
  isOpen,
  onClose,
  assessment,
  templates
}: ShareAssessmentDialogProps) {
  
  const getSelectedEmployeeName = () => {
    if (!assessment) return "";
    const employee = mockEmployees.find(emp => emp.id === assessment.employeeId);
    return employee?.name || "";
  };

  const getTemplateName = () => {
    if (!assessment) return "";
    const template = templates.find(t => t.id === assessment.templateId);
    return template?.title || "";
  };

  const handleCopyLink = () => {
    if (!assessment) return;
    
    navigator.clipboard.writeText(assessment.linkUrl);
    toast.success("Link copiado para a área de transferência!");
  };

  const handleShareWhatsApp = () => {
    if (!assessment || !assessment.phoneNumber) {
      toast.error("Número de telefone não disponível");
      return;
    }
    
    const message = `Olá ${getSelectedEmployeeName()}, aqui está o link para sua avaliação "${getTemplateName()}": ${assessment.linkUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = assessment.phoneNumber.replace(/\D/g, '');
    
    // Format for WhatsApp web API
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open in a new tab
    window.open(whatsappUrl, '_blank');
  };

  if (!assessment) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar Avaliação</DialogTitle>
          <DialogDescription>
            Compartilhe o link da avaliação com o funcionário.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Funcionário</Label>
            <p className="text-sm">{getSelectedEmployeeName()}</p>
          </div>
          <div className="space-y-2">
            <Label>Modelo de Checklist</Label>
            <p className="text-sm">{getTemplateName()}</p>
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <p className="text-sm">{assessment.phoneNumber || "Não cadastrado"}</p>
          </div>
          <div className="space-y-2">
            <Label>Link de Avaliação</Label>
            <div className="flex space-x-2">
              <Input readOnly value={assessment.linkUrl} className="flex-1" />
              <Button size="sm" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copiar</span>
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Fechar
          </Button>
          <Button 
            onClick={handleShareWhatsApp} 
            className="sm:w-auto w-full"
            disabled={!assessment.phoneNumber}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
