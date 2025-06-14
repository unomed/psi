
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { useCompanies } from "@/hooks/useCompanies";
import { UserFormData } from "../types";

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
          <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-3">
            {companies.map((company) => (
              <div key={company.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`company-${company.id}`}
                  checked={field.value?.includes(company.id) || false}
                  onCheckedChange={(checked) => {
                    const currentValues = field.value || [];
                    if (checked) {
                      field.onChange([...currentValues, company.id]);
                    } else {
                      field.onChange(currentValues.filter(id => id !== company.id));
                    }
                  }}
                />
                <label
                  htmlFor={`company-${company.id}`}
                  className="text-sm cursor-pointer"
                >
                  {company.name}
                </label>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
