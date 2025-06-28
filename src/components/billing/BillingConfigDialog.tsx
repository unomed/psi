
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BillingConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillingConfigDialog({ open, onOpenChange }: BillingConfigDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
