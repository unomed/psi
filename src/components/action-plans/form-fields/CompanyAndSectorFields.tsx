
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ActionPlanFormData } from '../schemas/actionPlanSchema';

interface Sector {
  id: string;
  name: string;
  companyId: string;
}

interface UserCompany {
  companyId: string;
  companyName: string;
}

interface CompanyAndSectorFieldsProps {
  control: Control<ActionPlanFormData>;
  shouldShowCompanySelect: boolean;
  userCompanies?: UserCompany[];
  sectors: Sector[];
}

export function CompanyAndSectorFields({
  control,
  shouldShowCompanySelect,
  userCompanies,
  sectors
}: CompanyAndSectorFieldsProps) {
  const selectedCompany = useWatch({
    control,
    name: 'company_id'
  });

  const validUserCompanies = (userCompanies || []).filter(company =>
    company && company.companyId && String(company.companyId).trim() !== "" && company.companyName && String(company.companyName).trim() !== ""
  );

  const validSectorsBase = (sectors || []).filter(sector =>
    sector && sector.id && String(sector.id).trim() !== "" && sector.name && String(sector.name).trim() !== ""
  );

  const filteredSectors = selectedCompany
    ? validSectorsBase.filter(sector => sector.companyId === selectedCompany)
    : validSectorsBase;

  return (
    <>
      {shouldShowCompanySelect && (
        <FormField
          control={control}
          name="company_id"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Empresa</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || "no-company-selected"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {validUserCompanies.map((company) => {
                    const companyIdStr = String(company.companyId);
                    if (companyIdStr.trim() === "") {
                       console.error("[ActionPlans/CompanyAndSectorFields] Attempting to render Company SelectItem with empty value:", company);
                      return null;
                    }
                    return (
                      <SelectItem key={companyIdStr} value={companyIdStr}>
                        {company.companyName}
                      </SelectItem>
                    );
                  }).filter(Boolean)}
                  {validUserCompanies.length === 0 && (
                    <SelectItem value="no-actionplan-companies-available" disabled>Nenhuma empresa disponível</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="sector_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Setor</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "no-sector-selected"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredSectors.map((sector) => {
                   const sectorIdStr = String(sector.id);
                    if (sectorIdStr.trim() === "") {
                      console.error("[ActionPlans/CompanyAndSectorFields] Attempting to render Sector SelectItem with empty value:", sector);
                      return null;
                    }
                  return (
                    <SelectItem key={sectorIdStr} value={sectorIdStr}>
                      {sector.name}
                    </SelectItem>
                  );
                }).filter(Boolean)}
                {filteredSectors.length === 0 && (
                    <SelectItem value="no-actionplan-sectors-available" disabled>Nenhum setor disponível</SelectItem>
                  )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

