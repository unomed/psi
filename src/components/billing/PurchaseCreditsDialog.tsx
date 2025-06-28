
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PurchaseCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PurchaseCreditsDialog({ open, onOpenChange }: PurchaseCreditsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comprar Créditos</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center text-muted-foreground">
          Formulário de compra de créditos será implementado em breve
        </div>
      </DialogContent>
    </Dialog>
  );
}
