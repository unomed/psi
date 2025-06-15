import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Mail } from "lucide-react";
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
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/contexts/AuthContext";

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
  const { userCompanies } = useAuth();
  const companyId = userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined;
  const { employees } = useEmployees({ companyId });
  
  const getSelectedEmployeeName = () => {
    if (!assessment) return "";
    const employee = employees.find(emp => emp.id === assessment.employeeId);
    return employee?.name || "";
  };

  const getTemplateName = () => {
    if (!assessment) return "";
    const template = templates.find(t => t.id === assessment.templateId);
    return template?.title || "";
  };

  const handleCopyLink = () => {
    if (!assessment || !assessment.linkUrl) {
      toast.error("Link não disponível");
      return;
    }
    
    navigator.clipboard.writeText(assessment.linkUrl);
    toast.success("Link copiado para a área de transferência!");
  };

  const handleSendEmail = () => {
    if (!assessment) return;
    
    // Implementar envio de email
    toast.success("Email será enviado em breve!");
    onClose();
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
            Compartilhe o link da avaliação com o funcionário ou envie por email.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Funcionário</Label>
            <p className="text-sm font-medium">{getSelectedEmployeeName()}</p>
          </div>
          <div className="space-y-2">
            <Label>Modelo de Checklist</Label>
            <p className="text-sm">{getTemplateName()}</p>
          </div>
          {assessment.linkUrl && (
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
          )}
          {!assessment.linkUrl && (
            <div className="text-sm text-muted-foreground">
              Link ainda não foi gerado para esta avaliação.
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Fechar
          </Button>
          {assessment.linkUrl && (
            <Button 
              onClick={handleSendEmail} 
              className="sm:w-auto w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Enviar por Email
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
