
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Settings2, Zap, Bell, Clock } from "lucide-react";
import { toast } from "sonner";

const categoryOptions = [
  { value: 'organizacao_trabalho', label: 'Organização do Trabalho' },
  { value: 'condicoes_ambientais', label: 'Condições Ambientais' },
  { value: 'relacoes_socioprofissionais', label: 'Relações Socioprofissionais' },
  { value: 'reconhecimento_crescimento', label: 'Reconhecimento e Crescimento' },
  { value: 'elo_trabalho_vida_social', label: 'Elo Trabalho-Vida Social' }
];

const periodicityOptions = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'semiannual', label: 'Semestral' },
  { value: 'annual', label: 'Anual' }
];

const advancedConfigSchema = z.object({
  // Critérios por categoria
  category_weights: z.object({
    organizacao_trabalho: z.number().min(0).max(2),
    condicoes_ambientais: z.number().min(0).max(2),
    relacoes_socioprofissionais: z.number().min(0).max(2),
    reconhecimento_crescimento: z.number().min(0).max(2),
    elo_trabalho_vida_social: z.number().min(0).max(2),
  }),
  
  // Configurações de processamento
  processing_config: z.object({
    enable_smart_aggregation: z.boolean(),
    correlation_threshold: z.number().min(0).max(1),
    trend_analysis_enabled: z.boolean(),
    auto_recalculate_on_changes: z.boolean(),
  }),

  // Notificações avançadas
  notification_config: z.object({
    escalation_enabled: z.boolean(),
    escalation_hours: z.number().min(1).max(168),
    stakeholder_groups: z.array(z.string()),
    custom_templates_enabled: z.boolean(),
  }),

  // Periodicidades específicas
  periodicity_config: z.object({
    high_risk_periodicity: z.enum(['monthly', 'quarterly', 'semiannual', 'annual']),
    medium_risk_periodicity: z.enum(['monthly', 'quarterly', 'semiannual', 'annual']),
    low_risk_periodicity: z.enum(['monthly', 'quarterly', 'semiannual', 'annual']),
    auto_schedule_enabled: z.boolean(),
  }),
});

type AdvancedConfigFormData = z.infer<typeof advancedConfigSchema>;

interface PsychosocialAdvancedConfigProps {
  companyId?: string;
}

export function PsychosocialAdvancedConfig({ companyId }: PsychosocialAdvancedConfigProps) {
  const [stakeholderGroups, setStakeholderGroups] = useState<string[]>(['Gestores', 'RH', 'SESMT']);
  const [newStakeholder, setNewStakeholder] = useState('');

  const form = useForm<AdvancedConfigFormData>({
    resolver: zodResolver(advancedConfigSchema),
    defaultValues: {
      category_weights: {
        organizacao_trabalho: 1.0,
        condicoes_ambientais: 1.0,
        relacoes_socioprofissionais: 1.0,
        reconhecimento_crescimento: 1.0,
        elo_trabalho_vida_social: 1.0,
      },
      processing_config: {
        enable_smart_aggregation: true,
        correlation_threshold: 0.7,
        trend_analysis_enabled: true,
        auto_recalculate_on_changes: true,
      },
      notification_config: {
        escalation_enabled: true,
        escalation_hours: 24,
        stakeholder_groups: stakeholderGroups,
        custom_templates_enabled: false,
      },
      periodicity_config: {
        high_risk_periodicity: 'monthly',
        medium_risk_periodicity: 'quarterly',
        low_risk_periodicity: 'semiannual',
        auto_schedule_enabled: true,
      },
    },
  });

  const onSubmit = (data: AdvancedConfigFormData) => {
    console.log('Advanced config data:', data);
    toast.success('Configurações avançadas salvas com sucesso');
  };

  const addStakeholder = () => {
    if (newStakeholder.trim()) {
      const updatedGroups = [...stakeholderGroups, newStakeholder.trim()];
      setStakeholderGroups(updatedGroups);
      form.setValue('notification_config.stakeholder_groups', updatedGroups);
      setNewStakeholder('');
    }
  };

  const removeStakeholder = (index: number) => {
    const updatedGroups = stakeholderGroups.filter((_, i) => i !== index);
    setStakeholderGroups(updatedGroups);
    form.setValue('notification_config.stakeholder_groups', updatedGroups);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Configurações Avançadas de Risco Psicossocial
        </CardTitle>
        <CardDescription>
          Configure parâmetros avançados para cálculos, processamento e notificações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="weights" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="weights">Pesos por Categoria</TabsTrigger>
                <TabsTrigger value="processing">
                  <Zap className="h-4 w-4 mr-1" />
                  Processamento
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-1" />
                  Notificações
                </TabsTrigger>
                <TabsTrigger value="periodicity">
                  <Clock className="h-4 w-4 mr-1" />
                  Periodicidade
                </TabsTrigger>
              </TabsList>

              <TabsContent value="weights" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Pesos por Categoria de Risco</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure o peso de cada categoria no cálculo final do risco (0.0 a 2.0)
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryOptions.map((category) => (
                      <FormField
                        key={category.value}
                        control={form.control}
                        name={`category_weights.${category.value as keyof AdvancedConfigFormData['category_weights']}`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{category.label}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="2"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Peso atual: {field.value}x
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="processing" className="space-y-4 mt-6">
                <div className="space-y-6">
                  <h4 className="text-sm font-medium">Configurações de Processamento Inteligente</h4>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="processing_config.enable_smart_aggregation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Agregação Inteligente</FormLabel>
                            <FormDescription>
                              Usar algoritmos avançados para agregação de riscos por setor/função
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
                      name="processing_config.correlation_threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Limiar de Correlação</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              max="1"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Valor mínimo de correlação para identificar padrões (0.0 a 1.0)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="processing_config.trend_analysis_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Análise de Tendências</FormLabel>
                            <FormDescription>
                              Calcular tendências temporais automaticamente
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
                      name="processing_config.auto_recalculate_on_changes"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Recálculo Automático</FormLabel>
                            <FormDescription>
                              Recalcular riscos automaticamente quando configurações mudarem
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
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4 mt-6">
                <div className="space-y-6">
                  <h4 className="text-sm font-medium">Configurações de Notificação Avançadas</h4>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notification_config.escalation_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Escalação Automática</FormLabel>
                            <FormDescription>
                              Escalar notificações para níveis superiores se não houver resposta
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
                      name="notification_config.escalation_hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horas para Escalação</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="168"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Tempo em horas antes de escalar a notificação
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <FormLabel>Grupos de Stakeholders</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Adicionar novo grupo"
                          value={newStakeholder}
                          onChange={(e) => setNewStakeholder(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addStakeholder()}
                        />
                        <Button type="button" onClick={addStakeholder} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stakeholderGroups.map((group, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {group}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeStakeholder(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="periodicity" className="space-y-4 mt-6">
                <div className="space-y-6">
                  <h4 className="text-sm font-medium">Configurações de Periodicidade por Nível de Risco</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="periodicity_config.high_risk_periodicity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risco Alto</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {periodicityOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="periodicity_config.medium_risk_periodicity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risco Médio</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {periodicityOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="periodicity_config.low_risk_periodicity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risco Baixo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {periodicityOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="periodicity_config.auto_schedule_enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Agendamento Automático</FormLabel>
                          <FormDescription>
                            Agendar automaticamente reavaliações com base no nível de risco
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button type="submit">
                Salvar Configurações Avançadas
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
