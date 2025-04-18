import { usePeriodicitySettings } from "@/hooks/settings/usePeriodicitySettings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  defaultPeriodicity: z.enum(["monthly", "quarterly", "semiannual", "annual"]),
  riskHighPeriodicity: z.enum(["monthly", "quarterly", "semiannual", "annual"]),
  riskMediumPeriodicity: z.enum(["monthly", "quarterly", "semiannual", "annual"]),
  riskLowPeriodicity: z.enum(["monthly", "quarterly", "semiannual", "annual"]),
});

export default function PeriodicitySettings() {
  const { settings, isLoading, updateSettings } = usePeriodicitySettings();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultPeriodicity: settings?.default_periodicity || "annual",
      riskHighPeriodicity: settings?.risk_high_periodicity || "quarterly",
      riskMediumPeriodicity: settings?.risk_medium_periodicity || "semiannual",
      riskLowPeriodicity: settings?.risk_low_periodicity || "annual",
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateSettings({
      default_periodicity: values.defaultPeriodicity,
      risk_high_periodicity: values.riskHighPeriodicity,
      risk_medium_periodicity: values.riskMediumPeriodicity,
      risk_low_periodicity: values.riskLowPeriodicity
    });
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
