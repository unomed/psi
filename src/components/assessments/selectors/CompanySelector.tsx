
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
  const { userRole, userCompanies } = useAuth();
  const { companies: allCompanies, isLoading } = useCompanies();

  // Se o usuário for superadmin, mostrar todas as empresas
  // Caso contrário, mostrar apenas as empresas associadas ao usuário
  const availableCompanies = userRole === 'superadmin' 
    ? allCompanies 
    : allCompanies.filter(company => 
        userCompanies.some(userCompany => userCompany.companyId === company.id)
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
        value={selectedCompany || ""}
        onValueChange={onCompanyChange}
      >
        <SelectTrigger id="company">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {availableCompanies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
