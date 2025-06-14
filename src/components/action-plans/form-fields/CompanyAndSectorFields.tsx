
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
  
  const validSectors = (sectors || []).filter(sector =>
    sector && sector.id && String(sector.id).trim() !== "" && sector.name && String(sector.name).trim() !== ""
  );
  
  const filteredSectors = selectedCompany 
    ? validSectors.filter(sector => sector.companyId === selectedCompany)
    : validSectors; // Show all valid sectors if no company is selected, or an empty array if validSectors is empty

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
                  {validUserCompanies.map((company) => (
                      <SelectItem key={String(company.companyId)} value={String(company.companyId)}>
                        {company.companyName}
                      </SelectItem>
                  ))}
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
                {filteredSectors.map((sector) => (
                    <SelectItem key={String(sector.id)} value={String(sector.id)}>
                      {sector.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
