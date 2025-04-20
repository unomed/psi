
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "@/hooks/useUsers";
import { supabase } from "@/integrations/supabase/client";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Search } from "lucide-react";

interface Company {
  id: string;
  name: string;
}

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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      role: user?.role as "superadmin" | "admin" | "evaluator" || "evaluator",
      companyIds: [],
    },
  });

  // Fetch all companies
  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');
      
      if (error) {
        console.error('Error fetching companies:', error);
      } else if (data) {
        setCompanies(data);
        setFilteredCompanies(data);
      }
    };

    fetchCompanies();
  }, []);

  // Filter companies based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(company => 
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  // Fetch user's companies if editing
  useEffect(() => {
    if (user?.id) {
      const fetchUserCompanies = async () => {
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="email@exemplo.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome do usuário" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="evaluator">Avaliador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Empresas</FormLabel>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar empresas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 mb-2"
                />
              </div>
              <div className="border rounded-md p-3 space-y-2 max-h-60 overflow-y-auto">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <div key={company.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`company-${company.id}`} 
                        checked={selectedCompanies.includes(company.id)}
                        onCheckedChange={() => handleToggleCompany(company.id)}
                      />
                      <label 
                        htmlFor={`company-${company.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {company.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "Nenhuma empresa encontrada" : "Nenhuma empresa disponível"}
                  </p>
                )}
              </div>
            </div>

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
