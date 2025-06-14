
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePsychosocialRiskConfig } from "@/hooks/usePsychosocialRiskConfig";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Save, Settings } from "lucide-react";

const configSchema = z.object({
  threshold_low: z.number().min(1, "Deve ser maior que 0").max(100, "Deve ser menor que 100"),
  threshold_medium: z.number().min(1, "Deve ser maior que 0").max(100, "Deve ser menor que 100"),
  threshold_high: z.number().min(1, "Deve ser maior que 0").max(100, "Deve ser menor que 100"),
  periodicidade_dias: z.number().min(1, "Deve ser maior que 0").max(365, "Deve ser menor que 365 dias"),
  prazo_acao_critica_dias: z.number().min(1, "Deve ser maior que 0").max(30, "Deve ser menor que 30 dias"),
  prazo_acao_alta_dias: z.number().min(1, "Deve ser maior que 0").max(90, "Deve ser menor que 90 dias"),
  auto_generate_plans: z.boolean(),
  notification_enabled: z.boolean(),
}).refine((data) => data.threshold_low < data.threshold_medium, {
  message: "Threshold baixo deve ser menor que o médio",
  path: ["threshold_low"],
}).refine((data) => data.threshold_medium < data.threshold_high, {
  message: "Threshold médio deve ser menor que o alto",
  path: ["threshold_medium"],
}).refine((data) => data.prazo_acao_critica_dias < data.prazo_acao_alta_dias, {
  message: "Prazo crítico deve ser menor que o prazo alto",
  path: ["prazo_acao_critica_dias"],
});

type ConfigFormData = z.infer<typeof configSchema>;

interface PsychosocialConfigFormProps {
  companyId: string;
}

export function PsychosocialConfigForm({ companyId }: PsychosocialConfigFormProps) {
  const { config, isLoading, error, updateConfig } = usePsychosocialRiskConfig(companyId);

  const form = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      threshold_low: 25,
      threshold_medium: 50,
      threshold_high: 75,
      periodicidade_dias: 180,
      prazo_acao_critica_dias: 7,
      prazo_acao_alta_dias: 30,
      auto_generate_plans: true,
      notification_enabled: true,
    },
  });

  // Atualizar form quando config carregar
  React.useEffect(() => {
    if (config) {
      form.reset({
        threshold_low: config.threshold_low,
        threshold_medium: config.threshold_medium,
        threshold_high: config.threshold_high,
        periodicidade_dias: config.periodicidade_dias,
        prazo_acao_critica_dias: config.prazo_acao_critica_dias,
        prazo_acao_alta_dias: config.prazo_acao_alta_dias,
        auto_generate_plans: config.auto_generate_plans,
        notification_enabled: config.notification_enabled,
      });
    }
  }, [config, form]);

  const onSubmit = (data: ConfigFormData) => {
    updateConfig.mutate({
      ...config,
      ...data,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar configurações: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações de Risco Psicossocial
        </CardTitle>
        <CardDescription>
          Configure os parâmetros para análise e processamento de riscos psicossociais conforme NR-01
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Thresholds de Risco */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Limites de Classificação de Risco</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="threshold_low"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risco Baixo (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Limite máximo para classificar como risco baixo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="threshold_medium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risco Médio (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Limite máximo para classificar como risco médio
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="threshold_high"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risco Alto (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Limite máximo para classificar como risco alto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Periodicidade */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Periodicidade e Prazos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="periodicidade_dias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Periodicidade de Avaliação (dias)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Intervalo padrão entre avaliações
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prazo_acao_critica_dias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo Ação Crítica (dias)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Prazo para implementar ações em riscos críticos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prazo_acao_alta_dias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo Ação Alta (dias)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Prazo para implementar ações em riscos altos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Automações */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Automações</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="auto_generate_plans"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Geração Automática de Planos
                        </FormLabel>
                        <FormDescription>
                          Gerar automaticamente planos de ação para riscos altos e críticos
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notification_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Notificações Automáticas
                        </FormLabel>
                        <FormDescription>
                          Enviar notificações automáticas para riscos identificados
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateConfig.isPending}
                className="flex items-center gap-2"
              >
                {updateConfig.isPending ? (
                  <LoadingSpinner />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Salvar Configurações
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
