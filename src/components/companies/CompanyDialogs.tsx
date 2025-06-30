
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CompanyForm } from "@/components/forms/CompanyForm";

interface CompanyDialogsProps {
  open: boolean;
  isEditMode: boolean;
  selectedCompany: any;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

export function CompanyDialogs({
  open,
  isEditMode,
  selectedCompany,
  onSubmit,
  onClose
}: CompanyDialogsProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Editar Empresa" : "Nova Empresa"}
          </DialogTitle>
        </DialogHeader>
        <CompanyForm
          onSubmit={onSubmit}
          onClose={onClose}
          initialData={selectedCompany}
          isEdit={isEditMode}
        />
      </DialogContent>
    </Dialog>
  );
}
