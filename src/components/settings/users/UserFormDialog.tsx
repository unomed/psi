
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BasicUserInfo } from "./form-sections/BasicUserInfo";
import { CompanySection } from "./form-sections/CompanySection";
import { useCompanySelection } from "@/hooks/users/useCompanySelection";
import type { User } from "@/hooks/users/types";

const userFormSchema = z.object({
  email: z.string().email("Email inválido"),
  full_name: z.string().min(1, "Nome é obrigatório"),
  role: z.enum(["superadmin", "admin", "evaluator"], {
    required_error: "Selecione uma função",
  }),
  companyIds: z.array(z.string()).optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  user?: User;
  title: string;
}

export function UserFormDialog({ 
  open, 
  onClose, 
  onSubmit, 
  user, 
  title 
}: UserFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      role: user?.role as "superadmin" | "admin" | "evaluator" || "evaluator",
      companyIds: [],
    },
  });

  const { 
    companies,
    selectedCompanies,
    searchQuery,
    setSearchQuery,
    handleToggleCompany,
    setError
  } = useCompanySelection(user, form);

  const handleSubmit = async (data: UserFormData) => {
    setError(null);
    
    try {
      setIsSubmitting(true);
      
      // Garantir que superadmin tenha acesso a todas as empresas
      const finalCompanyIds = data.role === 'superadmin' 
        ? companies.map(c => c.id) 
        : selectedCompanies;
      
      await onSubmit({
        ...data,
        companyIds: finalCompanyIds,
      });
      
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <BasicUserInfo form={form} />
            
            <CompanySection
              companies={companies}
              selectedCompanies={selectedCompanies}
              onToggleCompany={handleToggleCompany}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
