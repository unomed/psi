
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAssessmentCriteriaSettings } from "@/hooks/settings/useAssessmentCriteriaSettings";
import { assessmentCriteriaSchema } from "./schemas/assessmentCriteriaSchema";
import { PeriodicityTab } from "./tabs/PeriodicityTab";
import { SamplingTab } from "./tabs/SamplingTab";
import { RiskLevelsTab } from "./tabs/RiskLevelsTab";
import { GovernanceTab } from "./tabs/GovernanceTab";

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
  
  // Reset form when settings are loaded
  React.useEffect(() => {
    if (settings) {
      form.reset(settings);
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
              
              <TabsContent value="periodicidade">
                <PeriodicityTab form={form} />
              </TabsContent>
              
              <TabsContent value="amostragem">
                <SamplingTab form={form} />
              </TabsContent>
              
              <TabsContent value="niveis">
                <RiskLevelsTab form={form} />
              </TabsContent>
              
              <TabsContent value="governanca">
                <GovernanceTab form={form} />
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
