
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NewSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewSubscriptionDialog({ isOpen, onClose }: NewSubscriptionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Assinatura</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center text-muted-foreground">
          Formulário de nova assinatura será implementado em breve
        </div>
      </DialogContent>
    </Dialog>
  );
}
