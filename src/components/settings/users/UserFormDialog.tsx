
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { User } from "@/hooks/users/types";
import { supabase } from "@/integrations/supabase/client";
import { BasicUserInfo } from "./form-sections/BasicUserInfo";
import { CompanySelection } from "./form-sections/CompanySelection";
import { toast } from "sonner";

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

export function UserFormDialog({ open, onClose, onSubmit, user, title }: UserFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      role: user?.role as "superadmin" | "admin" | "evaluator" || "evaluator",
      companyIds: [],
    },
  });

  // Monitor role changes to enforce Super Admin rules
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'role' && value.role === 'superadmin') {
        // Super Admin always has access to all companies
        setSelectedCompanies(companies.map(c => c.id));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, companies]);

  // Fetch all companies when component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');
        
        if (error) {
          console.error('Error fetching companies:', error);
          toast.error('Erro ao carregar empresas');
        } else if (data) {
          setCompanies(data);
          
          // If user is Super Admin, select all companies automatically
          if (user?.role === 'superadmin') {
            setSelectedCompanies(data.map(c => c.id));
          }
        }
      } catch (error) {
        console.error('Unexpected error fetching companies:', error);
        toast.error('Erro inesperado ao carregar empresas');
      }
    };

    fetchCompanies();
  }, [user?.role]);

  // Fetch user's current company assignments when editing
  useEffect(() => {
    if (user?.id) {
      const fetchUserCompanies = async () => {
        try {
          const { data, error } = await supabase
            .from('user_companies')
            .select('company_id')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Error fetching user companies:', error);
            toast.error('Erro ao carregar empresas do usuário');
          } else if (data) {
            const companyIds = data.map(item => item.company_id);
            setSelectedCompanies(companyIds);
            form.setValue('companyIds', companyIds);
          }
        } catch (error) {
          console.error('Unexpected error fetching user companies:', error);
          toast.error('Erro inesperado ao carregar empresas do usuário');
        }
      };

      fetchUserCompanies();
    }
  }, [user, form]);

  const handleToggleCompany = (companyId: string) => {
    let updatedCompanies: string[];
    
    // Se o papel for superadmin, não permitir desmarcar empresas
    if (form.getValues('role') === 'superadmin') {
      toast.info('Super Admin tem acesso a todas as empresas por padrão');
      return;
    }
    
    if (selectedCompanies.includes(companyId)) {
      updatedCompanies = selectedCompanies.filter(id => id !== companyId);
    } else {
      updatedCompanies = [...selectedCompanies, companyId];
    }
    
    setSelectedCompanies(updatedCompanies);
    form.setValue('companyIds', updatedCompanies);
  };

  const handleSubmit = async (data: UserFormData) => {
    setError(null);
    
    // Validar se empresas foram selecionadas para papéis que não são superadmin
    if (data.role !== 'superadmin' && (!selectedCompanies || selectedCompanies.length === 0)) {
      setError("Selecione pelo menos uma empresa para este usuário");
      toast.error("Selecione pelo menos uma empresa para este usuário");
      return;
    }
    
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
      setSelectedCompanies([]);
      setError(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erro ao salvar usuário");
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
            
            <CompanySelection
              companies={companies}
              selectedCompanies={selectedCompanies}
              onToggleCompany={handleToggleCompany}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

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
