
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PurchaseCreditsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseCreditsDialog({ isOpen, onClose }: PurchaseCreditsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comprar Créditos</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center text-muted-foreground">
          Compra de créditos será implementada em breve
        </div>
      </DialogContent>
    </Dialog>
  );
}
