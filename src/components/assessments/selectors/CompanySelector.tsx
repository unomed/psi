
import React from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface CompanySelectorProps {
  selectedCompany: string | null;
  onCompanyChange: (companyId: string) => void;
}

export function CompanySelector({
  selectedCompany,
  onCompanyChange,
}: CompanySelectorProps) {
  const { userRole, userCompanies: authUserCompanies } = useAuth(); // Renamed to avoid conflict
  const { companies: allCompanies, isLoading } = useCompanies();

  const companiesForUser = userRole === 'superadmin' 
    ? allCompanies 
    : allCompanies.filter(company => 
        authUserCompanies.some(userCompany => userCompany.companyId === company.id)
      );

  const validCompanies = (companiesForUser || []).filter(company => 
    company && 
    company.id !== null &&
    company.id !== undefined &&
    String(company.id).trim() !== "" &&
    company.name && 
    String(company.name).trim() !== ""
  );
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Empresa</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="company">Empresa</Label>
      <Select
        value={selectedCompany || "no-company-selected"}
        onValueChange={onCompanyChange}
      >
        <SelectTrigger id="company">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {validCompanies.length > 0 ? (
            validCompanies.map((company) => (
              <SelectItem key={String(company.id)} value={String(company.id)}>
                {company.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-companies-available" disabled>
              Nenhuma empresa disponível
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
