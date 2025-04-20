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

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      role: user?.role as "superadmin" | "admin" | "evaluator" || "evaluator",
      companyIds: [],
    },
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');
        
        if (error) {
          console.error('Error fetching companies:', error);
        } else if (data) {
          setCompanies(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

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
          } else if (data) {
            const companyIds = data.map(item => item.company_id);
            setSelectedCompanies(companyIds);
            form.setValue('companyIds', companyIds);
          }
        } catch (error) {
          console.error('Unexpected error fetching user companies:', error);
        }
      };

      fetchUserCompanies();
    }
  }, [user, form]);

  const handleToggleCompany = (companyId: string) => {
    let updatedCompanies: string[];
    
    if (selectedCompanies.includes(companyId)) {
      updatedCompanies = selectedCompanies.filter(id => id !== companyId);
    } else {
      updatedCompanies = [...selectedCompanies, companyId];
    }
    
    setSelectedCompanies(updatedCompanies);
    form.setValue('companyIds', updatedCompanies);
  };

  const handleSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit({
        ...data,
        companyIds: selectedCompanies,
      });
      onClose();
      form.reset();
      setSelectedCompanies([]);
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
            
            <CompanySelection
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
