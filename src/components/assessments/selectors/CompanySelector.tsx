
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { mockCompanies } from "../mock/assessmentMockData";

interface CompanySelectorProps {
  selectedCompany: string | null;
  onCompanyChange: (value: string) => void;
}

export function CompanySelector({ selectedCompany, onCompanyChange }: CompanySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="company">Empresa</Label>
      <Select onValueChange={onCompanyChange} value={selectedCompany || undefined}>
        <SelectTrigger id="company">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {mockCompanies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
