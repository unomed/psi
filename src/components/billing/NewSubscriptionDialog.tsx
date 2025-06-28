
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NewSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewSubscriptionDialog({ open, onOpenChange }: NewSubscriptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
