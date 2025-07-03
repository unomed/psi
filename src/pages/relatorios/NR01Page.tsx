import React, { useState } from 'react';
import { StepenovskiNR01Report } from '@/components/reports/StepenovskiNR01Report';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/reports/DatePickerWithRange';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { DateRange } from '@/types/date';
import { FileText, Shield } from 'lucide-react';

export default function NR01Page() {
  const { userCompanies } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    to: new Date()
  });

  const companies = userCompanies || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Relatórios NR-01
          </h1>
          <p className="text-muted-foreground mt-2">
            Relatórios de conformidade e documentação para fiscalização do trabalho
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Configurações do Relatório
          </CardTitle>
          <CardDescription>
            Selecione a empresa e período para gerar o relatório de conformidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.companyId} value={String(company.companyId)}>
                      {company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período de Avaliação</Label>
              <DatePickerWithRange
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relatório */}
      {selectedCompany && dateRange.from && dateRange.to && (
        <StepenovskiNR01Report
          companyId={selectedCompany}
          periodStart={dateRange.from.toISOString()}
          periodEnd={dateRange.to.toISOString()}
        />
      )}

      {!selectedCompany && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">Selecione uma empresa</h3>
              <p className="text-muted-foreground">
                Escolha uma empresa acima para visualizar o relatório de conformidade NR-01
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}