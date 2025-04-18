
import { usePeriodicitySettings, PeriodicityType } from "@/hooks/settings/usePeriodicitySettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const formSchema = z.object({
  defaultPeriodicity: z.enum(["monthly", "quarterly", "semiannual", "annual"] as const),
  riskHighPeriodicity: z.enum(["monthly", "quarterly", "semiannual", "annual"] as const),
  riskMediumPeriodicity: z.enum(["monthly", "quarterly", "semiannual", "annual"] as const),
  riskLowPeriodicity: z.enum(["monthly", "quarterly", "semiannual", "annual"] as const),
});

type FormValues = z.infer<typeof formSchema>;

export default function PeriodicitySettings() {
  const { settings, isLoading, updateSettings } = usePeriodicitySettings();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultPeriodicity: "annual" as PeriodicityType,
      riskHighPeriodicity: "quarterly" as PeriodicityType,
      riskMediumPeriodicity: "semiannual" as PeriodicityType,
      riskLowPeriodicity: "annual" as PeriodicityType,
    }
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        defaultPeriodicity: settings.default_periodicity as PeriodicityType,
        riskHighPeriodicity: settings.risk_high_periodicity as PeriodicityType,
        riskMediumPeriodicity: settings.risk_medium_periodicity as PeriodicityType,
        riskLowPeriodicity: settings.risk_low_periodicity as PeriodicityType,
      });
    }
  }, [settings, form]);

  function onSubmit(values: FormValues) {
    updateSettings(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Periodicidade</CardTitle>
        <CardDescription>
          Configure a frequência padrão das avaliações por nível de risco
        </CardDescription>
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
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a periodicidade" />
                      </SelectTrigger>
                    </FormControl>
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
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a periodicidade" />
                      </SelectTrigger>
                    </FormControl>
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
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a periodicidade" />
                      </SelectTrigger>
                    </FormControl>
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
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a periodicidade" />
                      </SelectTrigger>
                    </FormControl>
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

            <Button type="submit" className="w-full">Salvar Configurações</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
