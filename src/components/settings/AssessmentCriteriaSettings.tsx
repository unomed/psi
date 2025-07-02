
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RiskMatrixSettingsForm from "./RiskMatrixSettingsForm";
import { useAssessmentCriteriaSettings } from "@/hooks/settings/useAssessmentCriteriaSettings";
import { toast } from "sonner";

export const AssessmentCriteriaSettings = () => {
  const { settings, isLoading, updateSettings } = useAssessmentCriteriaSettings();
  const [samplingData, setSamplingData] = useState({
    minimum_employee_percentage: settings?.minimum_employee_percentage || 30,
    require_all_sectors: settings?.require_all_sectors || false
  });
  
  // Atualizar estado quando settings mudar
  React.useEffect(() => {
    if (settings) {
      setSamplingData({
        minimum_employee_percentage: settings.minimum_employee_percentage || 30,
        require_all_sectors: settings.require_all_sectors || false
      });
    }
  }, [settings]);
  const [governanceData, setGovernanceData] = useState({
    notify_managers_on_high_risk: settings?.notify_managers_on_high_risk || true as boolean,
    require_reassessment_for_high_risk: settings?.require_reassessment_for_high_risk || true as boolean
  });
  const [periodicityData, setPeriodicityData] = useState({
    reassessment_max_days: settings?.reassessment_max_days || 90,
    enable_recurrence_reminders: settings?.enable_recurrence_reminders || true as boolean
  });

  const handleSaveSampling = async () => {
    try {
      await updateSettings(samplingData);
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    }
  };

  const handleSaveGovernance = async () => {
    try {
      await updateSettings(governanceData);
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    }
  };

  const handleSavePeriodicity = async () => {
    try {
      await updateSettings(periodicityData);
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }
  return (
    <Tabs defaultValue="riskLevels" className="w-full">
      <TabsList className="grid grid-cols-4 mb-8 bg-slate-50 p-1 rounded-lg">
        <TabsTrigger 
          value="riskLevels"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-blue-200 data-[state=active]:text-blue-800 data-[state=active]:border-blue-300 transition-all duration-200"
        >
          Níveis de Risco
        </TabsTrigger>
        <TabsTrigger 
          value="sampling"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100 data-[state=active]:to-green-200 data-[state=active]:text-green-800 data-[state=active]:border-green-300 transition-all duration-200"
        >
          Amostragem
        </TabsTrigger>
        <TabsTrigger 
          value="governance"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-100 data-[state=active]:to-purple-200 data-[state=active]:text-purple-800 data-[state=active]:border-purple-300 transition-all duration-200"
        >
          Governança
        </TabsTrigger>
        <TabsTrigger 
          value="periodicity"
          className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-orange-200 data-[state=active]:text-orange-800 data-[state=active]:border-orange-300 transition-all duration-200"
        >
          Periodicidade
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="riskLevels" className="space-y-6">
        <RiskMatrixSettingsForm />
      </TabsContent>
      
      <TabsContent value="sampling" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Regras de Amostragem</CardTitle>
            <CardDescription>
              Configure os critérios para amostragem de avaliações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="minEmployeePercentage">
                  Porcentagem mínima de funcionários
                </Label>
                <Input
                  id="minEmployeePercentage"
                  type="number"
                  value={samplingData.minimum_employee_percentage}
                  onChange={(e) => setSamplingData(prev => ({
                    ...prev,
                    minimum_employee_percentage: parseInt(e.target.value)
                  }))}
                  min={0}
                  max={100}
                  className="mt-1"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireAllSectors">
                    Exigir todos os setores?
                  </Label>
                  <Switch 
                    id="requireAllSectors" 
                    checked={samplingData.require_all_sectors}
                    onCheckedChange={(checked) => setSamplingData(prev => ({
                      ...prev,
                      require_all_sectors: checked
                    }))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveSampling} className="bg-green-600 hover:bg-green-700">
              Salvar Configurações
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="governance" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Regras de Governança</CardTitle>
            <CardDescription>
              Configure os critérios de governança para avaliações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifyManagers">
                  Notificar gerentes em casos de alto risco
                </Label>
                <Switch 
                  id="notifyManagers" 
                  checked={governanceData.notify_managers_on_high_risk}
                  onCheckedChange={(checked) => setGovernanceData(prev => ({
                    ...prev,
                    notify_managers_on_high_risk: checked
                  }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="requireReassessment">
                  Exigir reavaliação para alto risco
                </Label>
                <Switch 
                  id="requireReassessment" 
                  checked={governanceData.require_reassessment_for_high_risk}
                  onCheckedChange={(checked) => setGovernanceData(prev => ({
                    ...prev,
                    require_reassessment_for_high_risk: checked
                  }))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveGovernance} className="bg-purple-600 hover:bg-purple-700">
              Salvar Configurações
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="periodicity" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Periodicidade</CardTitle>
            <CardDescription>
              Configure as regras de periodicidade para avaliações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="reassessmentMaxDays">
                  Dias máximos para reavaliação
                </Label>
                <Input
                  id="reassessmentMaxDays"
                  type="number"
                  value={periodicityData.reassessment_max_days}
                  onChange={(e) => setPeriodicityData(prev => ({
                    ...prev,
                    reassessment_max_days: parseInt(e.target.value)
                  }))}
                  min={1}
                  className="mt-1"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableRecurrenceReminders">
                    Habilitar lembretes de recorrência
                  </Label>
                  <Switch 
                    id="enableRecurrenceReminders" 
                    checked={periodicityData.enable_recurrence_reminders}
                    onCheckedChange={(checked) => setPeriodicityData(prev => ({
                      ...prev,
                      enable_recurrence_reminders: checked
                    }))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSavePeriodicity} className="bg-orange-600 hover:bg-orange-700">
              Salvar Configurações
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
