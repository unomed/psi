
import React from "react";  // Add this import
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePeriodicityConfiguration, PeriodicityType } from "@/hooks/settings/usePeriodicityConfiguration";

interface FormValues {
  defaultPeriodicity: PeriodicityType;
  riskHighPeriodicity: PeriodicityType;
  riskMediumPeriodicity: PeriodicityType;
  riskLowPeriodicity: PeriodicityType;
}

export default function PeriodicitySettings() {
  const { settings, isLoading, updateSettings } = usePeriodicityConfiguration();
  
  const form = useForm<FormValues>({
    defaultValues: {
      defaultPeriodicity: "annual",
      riskHighPeriodicity: "quarterly",
      riskMediumPeriodicity: "semiannual",
      riskLowPeriodicity: "annual"
    }
  });

  React.useEffect(() => {
    if (settings) {
      form.reset({
        defaultPeriodicity: settings.default_periodicity as PeriodicityType,
        riskHighPeriodicity: settings.risk_high_periodicity as PeriodicityType,
        riskMediumPeriodicity: settings.risk_medium_periodicity as PeriodicityType,
        riskLowPeriodicity: settings.risk_low_periodicity as PeriodicityType,
      });
    }
  }, [settings, form]);

  const onSubmit = (values: FormValues) => {
    updateSettings({
      default_periodicity: values.defaultPeriodicity,
      risk_high_periodicity: values.riskHighPeriodicity,
      risk_medium_periodicity: values.riskMediumPeriodicity,
      risk_low_periodicity: values.riskLowPeriodicity
    });
  };

  if (isLoading) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Periodicidade</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="defaultPeriodicity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periodicidade Padrão</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a periodicidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="semiannual">Semestral</SelectItem>
                      <SelectItem value="annual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riskHighPeriodicity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periodicidade para Risco Alto</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a periodicidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="semiannual">Semestral</SelectItem>
                      <SelectItem value="annual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riskMediumPeriodicity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periodicidade para Risco Médio</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a periodicidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="semiannual">Semestral</SelectItem>
                      <SelectItem value="annual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riskLowPeriodicity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periodicidade para Risco Baixo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a periodicidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="semiannual">Semestral</SelectItem>
                      <SelectItem value="annual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Salvar Configurações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
