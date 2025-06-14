
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
              <Select onValueChange={field.onChange} defaultValue={field.value || "no-company-selected"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userCompanies?.map((company) => {
                    const companyId = company.companyId || `company-fallback-${Date.now()}`;
                    if (!companyId || companyId.trim() === '') {
                      console.error('Empty company ID detected in CompanyAndSectorFields:', company);
                      return null;
                    }
                    return (
                      <SelectItem key={companyId} value={companyId}>
                        {company.companyName || 'Empresa sem nome'}
                      </SelectItem>
                    );
                  }).filter(Boolean)}
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
            <Select onValueChange={field.onChange} defaultValue={field.value || "no-sector-selected"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredSectors.map((sector) => {
                  const sectorId = sector.id || `sector-fallback-${Date.now()}`;
                  if (!sectorId || sectorId.trim() === '') {
                    console.error('Empty sector ID detected in CompanyAndSectorFields:', sector);
                    return null;
                  }
                  return (
                    <SelectItem key={sectorId} value={sectorId}>
                      {sector.name || 'Setor sem nome'}
                    </SelectItem>
                  );
                }).filter(Boolean)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
