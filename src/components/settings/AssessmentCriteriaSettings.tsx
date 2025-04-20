
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAssessmentCriteriaSettings, type AssessmentCriteriaSettings } from "@/hooks/settings/useAssessmentCriteriaSettings";

const assessmentCriteriaSchema = z.object({
  // Periodicidade
  default_recurrence_type: z.enum(["none", "monthly", "semiannual", "annual"]).default("annual"),
  enable_recurrence_reminders: z.boolean().default(true),
  days_before_reminder_sent: z.number().min(1).max(90).default(15),
  
  // Critérios de amostragem
  minimum_employee_percentage: z.number().min(1).max(100).default(30),
  require_all_sectors: z.boolean().default(false),
  require_all_roles: z.boolean().default(false),
  prioritize_high_risk_roles: z.boolean().default(true),
  
  // Níveis de risco
  low_risk_threshold: z.number().min(0).max(100).default(30),
  medium_risk_threshold: z.number().min(0).max(100).default(60),
  // Alto risco é tudo acima do médio risco
  
  // Classificação nos relatórios
  sector_risk_calculation_type: z.enum(["average", "highest", "weighted"]).default("weighted"),
  company_risk_calculation_type: z.enum(["average", "highest", "weighted"]).default("weighted"),
  
  // Governança
  require_reassessment_for_high_risk: z.boolean().default(true),
  reassessment_max_days: z.number().min(1).max(365).default(90),
  notify_managers_on_high_risk: z.boolean().default(true),
});

type FormValues = z.infer<typeof assessmentCriteriaSchema>;

export function AssessmentCriteriaSettings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { settings, isLoading: isLoadingSettings, updateSettings } = useAssessmentCriteriaSettings();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(assessmentCriteriaSchema),
    defaultValues: {
      default_recurrence_type: "annual",
      enable_recurrence_reminders: true,
      days_before_reminder_sent: 15,
      minimum_employee_percentage: 30,
      require_all_sectors: false,
      require_all_roles: false,
      prioritize_high_risk_roles: true,
      low_risk_threshold: 30,
      medium_risk_threshold: 60,
      sector_risk_calculation_type: "weighted",
      company_risk_calculation_type: "weighted",
      require_reassessment_for_high_risk: true,
      reassessment_max_days: 90,
      notify_managers_on_high_risk: true,
    }
  });
  
  useEffect(() => {
    if (settings) {
      form.reset({
        default_recurrence_type: settings.default_recurrence_type,
        enable_recurrence_reminders: settings.enable_recurrence_reminders,
        days_before_reminder_sent: settings.days_before_reminder_sent,
        minimum_employee_percentage: settings.minimum_employee_percentage,
        require_all_sectors: settings.require_all_sectors,
        require_all_roles: settings.require_all_roles,
        prioritize_high_risk_roles: settings.prioritize_high_risk_roles,
        low_risk_threshold: settings.low_risk_threshold,
        medium_risk_threshold: settings.medium_risk_threshold,
        sector_risk_calculation_type: settings.sector_risk_calculation_type,
        company_risk_calculation_type: settings.company_risk_calculation_type,
        require_reassessment_for_high_risk: settings.require_reassessment_for_high_risk,
        reassessment_max_days: settings.reassessment_max_days,
        notify_managers_on_high_risk: settings.notify_managers_on_high_risk,
      });
    }
  }, [settings, form]);
  
  async function onSubmit(data: FormValues) {
    try {
      setIsSubmitting(true);
      await updateSettings(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingSettings) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 bg-gray-200 animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Critérios de Avaliação NR-01</CardTitle>
        <CardDescription>
          Configure os parâmetros para avaliação de riscos psicossociais conforme a NR-01
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="periodicidade" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="periodicidade">Periodicidade</TabsTrigger>
                <TabsTrigger value="amostragem">Amostragem</TabsTrigger>
                <TabsTrigger value="niveis">Níveis de Risco</TabsTrigger>
                <TabsTrigger value="governanca">Governança</TabsTrigger>
              </TabsList>
              
              {/* Tab de Periodicidade */}
              <TabsContent value="periodicidade" className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Configurações de Periodicidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Defina com que frequência as avaliações devem ser realizadas
                  </p>
                </div>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="default_recurrence_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Periodicidade Padrão</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a periodicidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Sem recorrência</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                          <SelectItem value="semiannual">Semestral</SelectItem>
                          <SelectItem value="annual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Frequência padrão para realização de novas avaliações
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enable_recurrence_reminders"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Lembretes de Recorrência
                        </FormLabel>
                        <FormDescription>
                          Enviar lembretes antes do vencimento das avaliações
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
                
                {form.watch("enable_recurrence_reminders") && (
                  <FormField
                    control={form.control}
                    name="days_before_reminder_sent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dias de Antecedência</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {field.value} dias
                              </span>
                            </div>
                            <Slider
                              value={[field.value]}
                              min={1}
                              max={90}
                              step={1}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Quantos dias antes enviar lembretes para avaliações futuras
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>
              
              {/* Tab de Amostragem */}
              <TabsContent value="amostragem" className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Critérios de Amostragem</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure quais colaboradores devem ser incluídos nas avaliações
                  </p>
                </div>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="minimum_employee_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentual Mínimo de Colaboradores</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {field.value}%
                            </span>
                          </div>
                          <Slider
                            value={[field.value]}
                            min={1}
                            max={100}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Porcentagem mínima de colaboradores que devem ser avaliados
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="require_all_sectors"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Avaliar Todos os Setores
                          </FormLabel>
                          <FormDescription>
                            Exigir que todos os setores sejam avaliados
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
                    name="require_all_roles"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Avaliar Todas as Funções
                          </FormLabel>
                          <FormDescription>
                            Exigir que todas as funções sejam avaliadas
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
                
                <FormField
                  control={form.control}
                  name="prioritize_high_risk_roles"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Priorizar Funções de Alto Risco
                        </FormLabel>
                        <FormDescription>
                          Dar prioridade para avaliação de funções com maior risco identificado
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
              </TabsContent>
              
              {/* Tab de Níveis de Risco */}
              <TabsContent value="niveis" className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Níveis de Risco</h3>
                  <p className="text-sm text-muted-foreground">
                    Defina os limiares para classificação dos níveis de risco
                  </p>
                </div>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="low_risk_threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limiar de Risco Baixo</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              0% a {field.value}%
                            </span>
                          </div>
                          <Slider
                            value={[field.value]}
                            min={1}
                            max={50}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Pontuações abaixo deste valor são consideradas baixo risco
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="medium_risk_threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limiar de Risco Médio</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {form.watch("low_risk_threshold")}% a {field.value}%
                            </span>
                          </div>
                          <Slider
                            value={[field.value]}
                            min={form.watch("low_risk_threshold") + 1}
                            max={90}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Pontuações entre o limiar de baixo risco e este valor são consideradas risco médio
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="font-medium">Alto Risco</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Pontuações acima de {form.watch("medium_risk_threshold")}% são consideradas alto risco
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <FormField
                    control={form.control}
                    name="sector_risk_calculation_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cálculo de Risco do Setor</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o método de cálculo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="average">Média Simples</SelectItem>
                            <SelectItem value="highest">Maior Risco Encontrado</SelectItem>
                            <SelectItem value="weighted">Média Ponderada</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Como calcular o nível de risco de um setor com base nos funcionários
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company_risk_calculation_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cálculo de Risco da Empresa</FormLabel>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o método de cálculo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="average">Média Simples</SelectItem>
                            <SelectItem value="highest">Maior Risco Encontrado</SelectItem>
                            <SelectItem value="weighted">Média Ponderada por Setor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Como calcular o nível de risco global da empresa com base nos setores
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* Tab de Governança */}
              <TabsContent value="governanca" className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Governança de Risco</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure as ações necessárias quando riscos são identificados
                  </p>
                </div>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="require_reassessment_for_high_risk"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Reavaliação Obrigatória para Alto Risco
                        </FormLabel>
                        <FormDescription>
                          Exigir reavaliação quando alto risco for identificado
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
                
                {form.watch("require_reassessment_for_high_risk") && (
                  <FormField
                    control={form.control}
                    name="reassessment_max_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo para Reavaliação (dias)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={365}
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Prazo máximo em dias para realizar a reavaliação
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="notify_managers_on_high_risk"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Notificar Gestores
                        </FormLabel>
                        <FormDescription>
                          Enviar notificações para gestores quando alto risco for identificado
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
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
