
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Settings, Save, RotateCcw } from "lucide-react";
import { usePsychosocialRiskConfig } from "@/hooks/usePsychosocialRiskConfig";
import { PsychosocialRiskConfig, DEFAULT_CONFIG } from "@/services/riskManagement/psychosocialRiskConfig";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { RiskErrorBoundary } from "./error-boundary/RiskErrorBoundary";

const configSchema = z.object({
  threshold_low: z.number().min(0).max(100),
  threshold_medium: z.number().min(0).max(100),
  threshold_high: z.number().min(0).max(100),
  periodicidade_dias: z.number().min(30).max(365),
  prazo_acao_critica_dias: z.number().min(1).max(30),
  prazo_acao_alta_dias: z.number().min(1).max(90),
  auto_generate_plans: z.boolean(),
  notification_enabled: z.boolean(),
}).refine((data) => data.threshold_low < data.threshold_medium, {
  message: "Threshold baixo deve ser menor que o médio",
  path: ["threshold_medium"],
}).refine((data) => data.threshold_medium < data.threshold_high, {
  message: "Threshold médio deve ser menor que o alto",
  path: ["threshold_high"],
});

type ConfigFormData = z.infer<typeof configSchema>;

interface PsychosocialRiskConfigFormProps {
  companyId?: string;
}

export function PsychosocialRiskConfigForm({ companyId }: PsychosocialRiskConfigFormProps) {
  const { config, isLoading, updateConfig } = usePsychosocialRiskConfig(companyId);

  const form = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: config || DEFAULT_CONFIG,
  });

  React.useEffect(() => {
    if (config) {
      form.reset(config);
    }
  }, [config, form]);

  const onSubmit = (data: ConfigFormData) => {
    if (!config) return;
    
    const updatedConfig: PsychosocialRiskConfig = {
      ...config,
      ...data,
    };

    updateConfig.mutate(updatedConfig);
  };

  const handleResetToDefault = () => {
    form.reset(DEFAULT_CONFIG);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Risco Psicossocial
          </CardTitle>
          <CardDescription>
            Configure os parâmetros para análise e geração automática de planos de ação conforme NR-01
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton lines={6} />
        </CardContent>
      </Card>
    );
  }

  return (
    <RiskErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Risco Psicossocial
          </CardTitle>
          <CardDescription>
            Configure os parâmetros para análise e geração automática de planos de ação conforme NR-01
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Thresholds de Risco */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Limites de Classificação de Risco</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="threshold_low"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risco Baixo (máx.)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Score máximo para risco baixo</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="threshold_medium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risco Médio (máx.)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Score máximo para risco médio</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="threshold_high"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risco Alto (máx.)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Score máximo para risco alto</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Periodicidade */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Periodicidade e Prazos</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="periodicidade_dias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Periodicidade de Avaliação</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Dias entre avaliações</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prazo_acao_critica_dias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo Ação Crítica</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Dias para ação em risco crítico</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prazo_acao_alta_dias"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo Ação Alta</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Dias para ação em risco alto</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Automações */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Automações</h4>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="auto_generate_plans"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Geração Automática de Planos</FormLabel>
                          <FormDescription>
                            Gerar planos de ação automaticamente para riscos altos e críticos
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                          <FormLabel className="text-base">Notificações Automáticas</FormLabel>
                          <FormDescription>
                            Enviar notificações quando riscos críticos forem identificados
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetToDefault}
                  disabled={updateConfig.isPending}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restaurar Padrão
                </Button>
                <Button
                  type="submit"
                  disabled={updateConfig.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateConfig.isPending ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </RiskErrorBoundary>
  );
}
