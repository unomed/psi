
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useCompanies } from "@/hooks/useCompanies";

interface UserFormData {
  email: string;
  full_name: string;
  role: "superadmin" | "admin" | "evaluator" | "profissionais";
  companyIds?: string[];
}

interface CompanySectionProps {
  form: UseFormReturn<UserFormData>;
}

export function CompanySection({ form }: CompanySectionProps) {
  const { companies } = useCompanies();
  const role = form.watch("role");

  if (role === "superadmin" || !companies) {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="companyIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Empresas</FormLabel>
          <Select onValueChange={(value) => field.onChange([value])} defaultValue={field.value?.[0]}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
