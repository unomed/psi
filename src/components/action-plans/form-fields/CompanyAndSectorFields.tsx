
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
import type { CompanyData } from '@/components/companies/CompanyCard';

interface Sector {
  id: string;
  name: string;
  companyId: string;
}

interface CompanyAndSectorFieldsProps {
  control: Control<ActionPlanFormData>;
  shouldShowCompanySelect: boolean;
  userCompanies?: CompanyData[];
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
  
  // Filtrar setores pela empresa selecionada
  const filteredSectors = selectedCompany 
    ? sectors.filter(sector => sector.companyId === selectedCompany)
    : sectors;

  return (
    <>
      {shouldShowCompanySelect && (
        <FormField
          control={control}
          name="company_id"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Empresa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userCompanies?.map((company) => (
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
      )}

      <FormField
        control={control}
        name="sector_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Setor</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredSectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
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
