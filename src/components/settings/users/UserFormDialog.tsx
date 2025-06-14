
import { useState } from "react";
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

const userFormSchema = z.object({
  email: z.string().email("Email inválido"),
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  role: z.enum(["superadmin", "admin", "evaluator", "profissionais"]),
  companyIds: z.array(z.string()).optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

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

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
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
            <CompanySection form={form} />

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
