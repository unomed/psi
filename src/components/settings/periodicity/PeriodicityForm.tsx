
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PeriodicityType } from "@/types/settings";

interface PeriodicityFormProps {
  defaultValues: FormValues;
  onSubmit: (values: FormValues) => void;
}

export interface FormValues {
  defaultPeriodicity: PeriodicityType;
  riskHighPeriodicity: PeriodicityType;
  riskMediumPeriodicity: PeriodicityType;
  riskLowPeriodicity: PeriodicityType;
}

const PERIODICITY_OPTIONS = [
  { value: "monthly", label: "Mensal" },
  { value: "quarterly", label: "Trimestral" },
  { value: "semiannual", label: "Semestral" },
  { value: "annual", label: "Anual" }
];

export function PeriodicityForm({ defaultValues, onSubmit }: PeriodicityFormProps) {
  const form = useForm<FormValues>({
    defaultValues
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="defaultPeriodicity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Periodicidade Padrão</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || "monthly"}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a periodicidade" />
                </SelectTrigger>
                <SelectContent>
                  {PERIODICITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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
              <Select onValueChange={field.onChange} value={field.value || "monthly"}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a periodicidade" />
                </SelectTrigger>
                <SelectContent>
                  {PERIODICITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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
              <Select onValueChange={field.onChange} value={field.value || "quarterly"}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a periodicidade" />
                </SelectTrigger>
                <SelectContent>
                  {PERIODICITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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
              <Select onValueChange={field.onChange} value={field.value || "annual"}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a periodicidade" />
                </SelectTrigger>
                <SelectContent>
                  {PERIODICITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
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
  );
}
