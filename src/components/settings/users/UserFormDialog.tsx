
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCreateUser } from "@/hooks/users/useCreateUser";
import { useUpdateUserRole } from "@/hooks/users/useUpdateUserRole";
import { toast } from "sonner";
import { User } from "@/hooks/users/types";
import { BasicUserInfo } from "./form-sections/BasicUserInfo";
import { CompanySection } from "./form-sections/CompanySection";
import { UserFormData } from "./types";
import { supabase } from "@/integrations/supabase/client";

const userFormSchema = z.object({
  email: z.string().email("Email inválido"),
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  role: z.enum(["superadmin", "admin", "evaluator", "profissionais"]),
  companyIds: z.array(z.string()).optional(),
});

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  mode: "create" | "edit";
}

export function UserFormDialog({ isOpen, onClose, user, mode }: UserFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createUserMutation = useCreateUser();
  const updateUserRoleMutation = useUpdateUserRole();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      role: user?.role || "evaluator",
      companyIds: [],
    },
  });

  // Carregar empresas do usuário quando em modo de edição
  useEffect(() => {
    if (mode === "edit" && user?.id && isOpen) {
      const loadUserCompanies = async () => {
        try {
          console.log("[UserFormDialog] Carregando empresas do usuário:", user.id);
          const { data, error } = await supabase
            .from('user_companies')
            .select('company_id')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('[UserFormDialog] Erro ao carregar empresas:', error);
          } else if (data) {
            const companyIds = data.map(item => item.company_id);
            console.log("[UserFormDialog] Empresas carregadas:", companyIds);
            form.setValue('companyIds', companyIds);
          }
        } catch (error) {
          console.error('[UserFormDialog] Erro inesperado:', error);
        }
      };

      loadUserCompanies();
    }
  }, [mode, user?.id, isOpen, form]);

  // Reset form quando o dialog abre/fecha ou o usuário muda
  useEffect(() => {
    if (isOpen) {
      form.reset({
        email: user?.email || "",
        full_name: user?.full_name || "",
        role: user?.role || "evaluator",
        companyIds: [],
      });
    }
  }, [isOpen, user, form]);

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      console.log("[UserFormDialog] Dados do formulário:", data);
      
      if (mode === "create") {
        await createUserMutation.mutateAsync({
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          companyIds: data.companyIds,
        });
        toast.success("Usuário criado com sucesso!");
      } else {
        await updateUserRoleMutation.mutateAsync({
          userId: user!.id,
          role: data.role,
          companyIds: data.companyIds,
        });
        toast.success("Usuário atualizado com sucesso!");
      }
      onClose();
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast.error("Erro ao salvar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Criar Usuário" : "Editar Usuário"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Preencha os dados para criar um novo usuário."
              : "Edite os dados do usuário."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <BasicUserInfo form={form} mode={mode} />
            <CompanySection form={form} user={user} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
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
