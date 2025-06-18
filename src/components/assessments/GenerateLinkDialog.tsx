import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { ChecklistTemplate } from "@/types";
import { useEmployees } from "@/hooks/useEmployees";
import { useAuth } from "@/hooks/useAuth";

interface GenerateLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployeeId: string | null;
  selectedTemplate: ChecklistTemplate | null;
  generatedLink: string;
}

export function GenerateLinkDialog({
  isOpen,
  onClose,
  selectedEmployeeId,
  selectedTemplate,
  generatedLink
}: GenerateLinkDialogProps) {
  const { userCompanies } = useAuth();
  const companyId = userCompanies.length > 0 ? String(userCompanies[0].companyId) : undefined;
  const { employees } = useEmployees({ companyId });
  
  const getSelectedEmployeeName = () => {
    if (!selectedEmployeeId) return "";
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    return employee?.name || "";
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link para Avaliação</DialogTitle>
          <DialogDescription>
            Copie e compartilhe o link com o funcionário para que ele possa responder à avaliação.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Funcionário</Label>
            <p className="text-sm">{getSelectedEmployeeName()}</p>
          </div>
          <div className="space-y-2">
            <Label>Modelo de Checklist</Label>
            <p className="text-sm">{selectedTemplate?.title}</p>
          </div>
          <div className="space-y-2">
            <Label>Link de Avaliação</Label>
            <div className="flex space-x-2">
              <Input readOnly value={generatedLink} className="flex-1" />
              <Button size="sm" onClick={handleCopyLink}>
                <ClipboardList className="h-4 w-4" />
                <span className="sr-only">Copiar</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Este link permitirá que o funcionário responda à avaliação sem necessidade de login.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
