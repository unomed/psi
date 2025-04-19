
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Mock data - this will need to be replaced with real data fetched from the database
const COMPANIES = [
  { id: "comp-1", name: "Empresa A" },
  { id: "comp-2", name: "Empresa B" },
  { id: "comp-3", name: "Empresa C" },
];

interface CompanySelectorProps {
  selectedCompany: string | null;
  onCompanyChange: (companyId: string) => void;
}

export function CompanySelector({
  selectedCompany,
  onCompanyChange,
}: CompanySelectorProps) {
  // Ensure we always have at least one item to select
  const companies = COMPANIES.length > 0 ? COMPANIES : [{ id: "", name: "Nenhuma empresa encontrada" }];
  
  return (
    <div className="space-y-2">
      <Label htmlFor="company">Empresa</Label>
      <Select
        value={selectedCompany || ""}
        onValueChange={onCompanyChange}
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
