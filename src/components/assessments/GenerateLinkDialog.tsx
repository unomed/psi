
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChecklistTemplate } from "@/types";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface GenerateLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEmployeeId?: string | null;
  selectedTemplate?: ChecklistTemplate | null;
  generatedLink: string;
}

export function GenerateLinkDialog({
  isOpen,
  onClose,
  selectedEmployeeId,
  selectedTemplate,
  generatedLink
}: GenerateLinkDialogProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copiado!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link da Avaliação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Funcionário: {selectedEmployeeId}</p>
          <p>Template: {selectedTemplate?.title || selectedTemplate?.name}</p>
          <div className="flex gap-2">
            <Input value={generatedLink} readOnly />
            <Button onClick={handleCopyLink} size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
