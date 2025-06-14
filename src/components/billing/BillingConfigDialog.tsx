
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BillingConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BillingConfigDialog({ isOpen, onClose }: BillingConfigDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações de Faturamento</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center text-muted-foreground">
          Configurações de faturamento serão implementadas em breve
        </div>
      </DialogContent>
    </Dialog>
  );
}
