import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CompanyForm } from "./CompanyForm";
import { CompanyData } from "@/types";
import { toast } from "sonner";
import { CompanyFormProps } from "@/components/forms/types";

interface EditCompanyDialogProps {
  company: CompanyData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCompanyDialog({ company, isOpen, onClose, onSuccess }: EditCompanyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CompanyData) => {
    setIsSubmitting(true);
    try {
      // Simule uma chamada à API para atualizar a empresa
      console.log("Dados da empresa a serem atualizados:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simula um atraso na API

      toast.success("Empresa atualizada com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar a empresa:", error);
      toast.error("Erro ao atualizar a empresa. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
        </DialogHeader>
        <CompanyForm
          onSubmit={handleSubmit}
          onClose={onClose} // CORRIGIDO - agora onClose existe no tipo
          initialData={company}
          isEdit={true}
        />
      </DialogContent>
    </Dialog>
  );
}

interface CreateCompanyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCompanyDialog({ isOpen, onClose, onSuccess }: CreateCompanyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CompanyData) => {
    setIsSubmitting(true);
    try {
      // Simule uma chamada à API para criar a empresa
      console.log("Dados da empresa a serem criados:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simula um atraso na API

      toast.success("Empresa criada com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao criar a empresa:", error);
      toast.error("Erro ao criar a empresa. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Empresa</DialogTitle>
        </DialogHeader>
        <CompanyForm
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
