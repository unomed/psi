
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
  const { userRole, userCompanies: authUserCompanies } = useAuth();
  const { companies: allCompanies, isLoading } = useCompanies();

  const companiesForUser = userRole === 'superadmin'
    ? allCompanies
    : (allCompanies || []).filter(company =>
        (authUserCompanies || []).some(userCompany => userCompany.companyId === company.id)
      );

  const baseValidCompanies = (companiesForUser || []).filter(company =>
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
          {baseValidCompanies.length > 0 ? (
            baseValidCompanies.map((company) => {
              const companyIdStr = String(company.id);
              if (companyIdStr.trim() === "") {
                console.error("[Assessments/CompanySelector] Attempting to render SelectItem with empty value for company:", company);
                return null;
              }
              return (
                <SelectItem key={companyIdStr} value={companyIdStr}>
                  {company.name}
                </SelectItem>
              );
            }).filter(Boolean)
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

