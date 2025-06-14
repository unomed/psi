
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { UserFormData } from "../types";
import { CompanySelection } from "./CompanySelection";
import { useCompanySelection } from "@/hooks/users/useCompanySelection";

interface CompanySectionProps {
  form: UseFormReturn<UserFormData>;
  user?: any;
}

export function CompanySection({ form, user }: CompanySectionProps) {
  const role = form.watch("role");
  
  const {
    companies,
    selectedCompanies,
    searchQuery,
    setSearchQuery,
    handleToggleCompany,
  } = useCompanySelection(user, form);

  if (role === "superadmin") {
    return (
      <div className="text-sm text-muted-foreground p-3 bg-muted rounded">
        Super Administradores têm acesso a todas as empresas automaticamente.
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name="companyIds"
      render={({ field }) => (
        <FormItem>
          <CompanySelection
            companies={companies}
            selectedCompanies={selectedCompanies}
            onToggleCompany={handleToggleCompany}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
