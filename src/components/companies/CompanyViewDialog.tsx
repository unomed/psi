
import { CompanyData } from "./CompanyCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CompanyViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  company: CompanyData | null;
}

export function CompanyViewDialog({
  isOpen,
  onOpenChange,
  company,
}: CompanyViewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Empresa</DialogTitle>
          <DialogDescription>
            Visualize os dados completos da empresa.
          </DialogDescription>
        </DialogHeader>
        {company && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="font-medium text-muted-foreground">Nome</h3>
              <p>{company.name}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-muted-foreground">CNPJ</h3>
              <p>{company.cnpj}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-muted-foreground">Endereço</h3>
              <p>{company.address}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-muted-foreground">Cidade</h3>
              <p>{company.city}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-muted-foreground">Estado</h3>
              <p>{company.state}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-muted-foreground">Setor</h3>
              <p>{company.industry || "Não informado"}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-muted-foreground">Nome do Contato</h3>
              <p>{company.contactName}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-muted-foreground">Email do Contato</h3>
              <p>{company.contactEmail}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-muted-foreground">Telefone do Contato</h3>
              <p>{company.contactPhone}</p>
            </div>
            {company.notes && (
              <div className="col-span-2 space-y-1">
                <h3 className="font-medium text-muted-foreground">Observações</h3>
                <p>{company.notes}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
