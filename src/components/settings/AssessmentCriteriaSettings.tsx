
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const assessmentCriteriaSchema = z.object({
  // Periodicidade
  defaultRecurrenceType: z.enum(["none", "monthly", "semiannual", "annual"]).default("annual"),
  enableRecurrenceReminders: z.boolean().default(true),
  daysBeforeReminderSent: z.number().min(1).max(90).default(15),
  
  // Critérios de amostragem
  minimumEmployeePercentage: z.number().min(1).max(100).default(30),
  requireAllSectors: z.boolean().default(false),
  requireAllRoles: z.boolean().default(false),
  prioritizeHighRiskRoles: z.boolean().default(true),
  
  // Níveis de risco
  lowRiskThreshold: z.number().min(0).max(100).default(30),
  mediumRiskThreshold: z.number().min(0).max(100).default(60),
  // Alto risco é tudo acima do médio risco
  
  // Classificação nos relatórios
  sectorRiskCalculationType: z.enum(["average", "highest", "weighted"]).default("weighted"),
  companyRiskCalculationType: z.enum(["average", "highest", "weighted"]).default("weighted"),
  
  // Governança
  requireReassessmentForHighRisk: z.boolean().default(true),
  reassessmentMaxDays: z.number().min(1).max(365).default(90),
  notifyManagersOnHighRisk: z.boolean().default(true),
});

type AssessmentCriteriaValues = z.infer<typeof assessmentCriteriaSchema>;

export function AssessmentCriteriaSettings() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Em produção, isso carregaria os dados do banco
  const form = useForm<AssessmentCriteriaValues>({
    resolver: zodResolver(assessmentCriteriaSchema),
    defaultValues: {
      defaultRecurrenceType: "annual",
      enableRecurrenceReminders: true,
      daysBeforeReminderSent: 15,
      minimumEmployeePercentage: 30,
      requireAllSectors: false,
      requireAllRoles: false,
      prioritizeHighRiskRoles: true,
      lowRiskThreshold: 30,
      mediumRiskThreshold: 60,
      sectorRiskCalculationType: "weighted",
      companyRiskCalculationType: "weighted",
      requireReassessmentForHighRisk: true,
      reassessmentMaxDays: 90,
      notifyManagersOnHighRisk: true,
    }
  });
  
  async function onSubmit(data: AssessmentCriteriaValues) {
    try {
      setIsLoading(true);
      console.log("Salvando critérios de avaliação:", data);
      
      // Em uma implementação real, salvaríamos no banco de dados
      // await supabase.from('system_settings').upsert({ 
      //   setting_key: 'assessment_criteria', 
      //   setting_value: data 
      // });
      
      toast.success("Critérios de avaliação atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
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
                  name="defaultRecurrenceType"
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
                  name="enableRecurrenceReminders"
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
                
                {form.watch("enableRecurrenceReminders") && (
                  <FormField
                    control={form.control}
                    name="daysBeforeReminderSent"
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
                  name="minimumEmployeePercentage"
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
                    name="requireAllSectors"
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
                    name="requireAllRoles"
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
                  name="prioritizeHighRiskRoles"
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
                  name="lowRiskThreshold"
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
                  name="mediumRiskThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limiar de Risco Médio</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {form.watch("lowRiskThreshold")}% a {field.value}%
                            </span>
                          </div>
                          <Slider
                            value={[field.value]}
                            min={form.watch("lowRiskThreshold") + 1}
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
                    Pontuações acima de {form.watch("mediumRiskThreshold")}% são consideradas alto risco
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <FormField
                    control={form.control}
                    name="sectorRiskCalculationType"
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
                    name="companyRiskCalculationType"
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
                  name="requireReassessmentForHighRisk"
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
                
                {form.watch("requireReassessmentForHighRisk") && (
                  <FormField
                    control={form.control}
                    name="reassessmentMaxDays"
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
                  name="notifyManagersOnHighRisk"
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
