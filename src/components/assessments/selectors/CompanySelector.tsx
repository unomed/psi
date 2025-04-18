
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useCompanies } from "@/hooks/useCompanies";

interface CompanySelectorProps {
  selectedCompany: string | null;
  onCompanyChange: (value: string) => void;
}

export function CompanySelector({ selectedCompany, onCompanyChange }: CompanySelectorProps) {
  const { companies, isLoading } = useCompanies();

  return (
    <div className="space-y-2">
      <Label htmlFor="company">Empresa</Label>
      <Select 
        onValueChange={onCompanyChange} 
        value={selectedCompany || undefined}
        disabled={isLoading}
      >
        <SelectTrigger id="company">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
