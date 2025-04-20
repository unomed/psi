
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Mail } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";

interface ShareLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
  assessmentLink: string;
  onSendEmail?: () => void;
}

export function ShareLinkDialog({
  isOpen,
  onClose,
  employeeName,
  assessmentLink,
  onSendEmail
}: ShareLinkDialogProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(assessmentLink);
    toast.success("Link copiado para a área de transferência!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar Avaliação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Funcionário</Label>
            <p className="text-sm">{employeeName}</p>
          </div>
          <div className="space-y-2">
            <Label>Link de Avaliação</Label>
            <div className="flex space-x-2">
              <Input readOnly value={assessmentLink} className="flex-1" />
              <Button size="icon" onClick={handleCopyLink}>
                <Link className="h-4 w-4" />
                <span className="sr-only">Copiar link</span>
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {onSendEmail && (
            <Button onClick={onSendEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar por Email
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
