
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, Zap, Clock, Bell } from "lucide-react";
import { usePsychosocialAutomation } from "@/hooks/usePsychosocialAutomation";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

const automationConfigSchema = z.object({
  auto_process_enabled: z.boolean(),
  auto_generate_action_plans: z.boolean(),
  notification_enabled: z.boolean(),
  processing_delay_minutes: z.number().min(0).max(60),
  high_risk_immediate_notification: z.boolean(),
  critical_risk_escalation: z.boolean(),
  notification_recipients: z.array(z.string().email()).optional(),
});

type AutomationConfigFormData = z.infer<typeof automationConfigSchema>;

interface AutomationTriggerConfigProps {
  companyId?: string;
}

export function AutomationTriggerConfig({ companyId }: AutomationTriggerConfigProps) {
  const { config, isLoading, updateConfig } = usePsychosocialAutomation(companyId);

  const form = useForm<AutomationConfigFormData>({
    resolver: zodResolver(automationConfigSchema),
    defaultValues: {
      auto_process_enabled: false,
      auto_generate_action_plans: false,
      notification_enabled: false,
      processing_delay_minutes: 5,
      high_risk_immediate_notification: true,
      critical_risk_escalation: true,
      notification_recipients: []
    }
  });

  React.useEffect(() => {
    if (config) {
      form.reset({
        auto_process_enabled: config.auto_process_enabled || false,
        auto_generate_action_plans: config.auto_generate_action_plans || false,
        notification_enabled: config.notification_enabled || false,
        processing_delay_minutes: config.processing_delay_minutes || 5,
        high_risk_immediate_notification: config.high_risk_immediate_notification || true,
        critical_risk_escalation: config.critical_risk_escalation || true,
        notification_recipients: config.notification_recipients || []
      });
    }
  }, [config, form]);

  const onSubmit = (data: AutomationConfigFormData) => {
    updateConfig.mutate(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração de Triggers de Automação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton lines={6} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuração de Triggers de Automação
        </CardTitle>
        <CardDescription>
          Configure quando e como o sistema deve processar automaticamente as avaliações psicossociais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Processamento Automático */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <h4 className="font-medium">Processamento Automático</h4>
              </div>
              
              <FormField
                control={form.control}
                name="auto_process_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ativar Processamento Automático</FormLabel>
                      <FormDescription>
                        Processar automaticamente as avaliações quando completadas
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
                name="processing_delay_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delay de Processamento (minutos)</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o delay" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Imediato</SelectItem>
                          <SelectItem value="2">2 minutos</SelectItem>
                          <SelectItem value="5">5 minutos</SelectItem>
                          <SelectItem value="10">10 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Tempo de espera antes de iniciar o processamento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Geração de Planos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <h4 className="font-medium">Geração Automática de Planos</h4>
              </div>
              
              <FormField
                control={form.control}
                name="auto_generate_action_plans"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Gerar Planos de Ação Automaticamente</FormLabel>
                      <FormDescription>
                        Criar planos de ação para riscos altos e críticos automaticamente
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("auto_generate_action_plans") && (
                <div className="ml-4 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Planos Gerados Automaticamente:</h5>
                  <div className="space-y-1 text-sm text-blue-700">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">Crítico</Badge>
                      <span>Plano imediato com ações obrigatórias</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Alto</Badge>
                      <span>Plano em 7 dias com medidas preventivas</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Notificações */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <h4 className="font-medium">Notificações Automáticas</h4>
              </div>
              
              <FormField
                control={form.control}
                name="notification_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enviar Notificações Automáticas</FormLabel>
                      <FormDescription>
                        Notificar responsáveis quando riscos críticos forem identificados
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
                name="high_risk_immediate_notification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notificação Imediata para Risco Alto</FormLabel>
                      <FormDescription>
                        Enviar notificação imediatamente quando risco alto for identificado
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
                name="critical_risk_escalation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Escalação para Risco Crítico</FormLabel>
                      <FormDescription>
                        Escalar automaticamente para níveis superiores em casos críticos
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Status Atual */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium mb-2">Status Atual da Automação:</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${config?.auto_process_enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span>Processamento: {config?.auto_process_enabled ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${config?.auto_generate_action_plans ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span>Planos: {config?.auto_generate_action_plans ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${config?.notification_enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span>Notificações: {config?.notification_enabled ? 'Ativo' : 'Inativo'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span>Delay: {config?.processing_delay_minutes || 5} min</span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={updateConfig.isPending}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateConfig.isPending ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
