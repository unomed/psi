import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Brain, Calculator, Zap } from "lucide-react";

interface PsychosocialAdvancedConfigProps {
  selectedCompanyId: string | null;
}

export function PsychosocialAdvancedConfig({ selectedCompanyId }: PsychosocialAdvancedConfigProps) {
  const queryClient = useQueryClient();

  const { data: weights, isLoading } = useQuery({
    queryKey: ['psychosocial-category-weights', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('psychosocial_category_weights')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId
  });

  const { data: backgroundSettings } = useQuery({
    queryKey: ['psychosocial-background-settings', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return null;
      
      const { data, error } = await supabase
        .from('psychosocial_background_settings')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!selectedCompanyId
  });

  const updateWeightsMutation = useMutation({
    mutationFn: async (weightsData: any[]) => {
      if (!selectedCompanyId) throw new Error('Company ID required');

      const updates = weightsData.map(weight => ({
        company_id: selectedCompanyId,
        category: weight.category,
        weight: weight.weight,
        is_active: true
      }));

      const { data, error } = await supabase
        .from('psychosocial_category_weights')
        .upsert(updates);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Pesos das categorias atualizados!");
      queryClient.invalidateQueries({ queryKey: ['psychosocial-category-weights'] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar pesos:", error);
      toast.error("Erro ao atualizar pesos das categorias");
    }
  });

  const updateBackgroundMutation = useMutation({
    mutationFn: async (settingsData: any) => {
      if (!selectedCompanyId) throw new Error('Company ID required');

      const { data, error } = await supabase
        .from('psychosocial_background_settings')
        .upsert({
          company_id: selectedCompanyId,
          ...settingsData
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Configurações de processamento atualizadas!");
      queryClient.invalidateQueries({ queryKey: ['psychosocial-background-settings'] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar configurações:", error);
      toast.error("Erro ao atualizar configurações de processamento");
    }
  });

  const handleWeightChange = (category: string, newWeight: number) => {
    const updatedWeights = weights?.map(w => 
      w.category === category ? { ...w, weight: newWeight } : w
    ) || [];
    
    updateWeightsMutation.mutate(updatedWeights);
  };

  const handleBackgroundSave = (formData: FormData) => {
    const settingsData = {
      auto_analysis_enabled: formData.get('auto_analysis_enabled') === 'on',
      escalation_enabled: formData.get('escalation_enabled') === 'on',
      escalation_threshold: parseInt(formData.get('escalation_threshold') as string) || 80,
      batch_processing_enabled: formData.get('batch_processing_enabled') === 'on',
      processing_frequency: parseInt(formData.get('processing_frequency') as string) || 24,
      backup_retention_days: parseInt(formData.get('backup_retention_days') as string) || 90,
      notification_email: formData.get('notification_email') as string
    };

    updateBackgroundMutation.mutate(settingsData);
  };

  if (!selectedCompanyId) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para configurações avançadas</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center p-8">Carregando configurações avançadas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Pesos das Categorias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pesos das Categorias de Risco
          </CardTitle>
          <CardDescription>
            Ajuste a importância relativa de cada categoria na análise de risco psicossocial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {weights?.map((weight) => (
            <div key={weight.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">
                  {weight.category === 'organizacao_trabalho' && 'Organização do Trabalho'}
                  {weight.category === 'relacoes_sociais' && 'Relações Sociais'}
                  {weight.category === 'fatores_psicossociais' && 'Fatores Psicossociais'}
                </Label>
                <span className="text-sm text-muted-foreground">
                  Peso: {Number(weight.weight).toFixed(1)}
                </span>
              </div>
              <Slider
                value={[Number(weight.weight)]}
                onValueChange={([value]) => handleWeightChange(weight.category, value)}
                max={5}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Pesos mais altos darão maior importância à categoria no cálculo final do risco
          </p>
        </CardContent>
      </Card>

      {/* Configurações de Processamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Processamento em Background
          </CardTitle>
          <CardDescription>
            Configure como o sistema processa as análises em segundo plano
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleBackgroundSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processing_frequency">Frequência de processamento (horas)</Label>
                <Input
                  id="processing_frequency"
                  name="processing_frequency"
                  type="number"
                  min="1"
                  max="168"
                  defaultValue={backgroundSettings?.processing_frequency || 24}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="escalation_threshold">Limite para escalação (%)</Label>
                <Input
                  id="escalation_threshold"
                  name="escalation_threshold"
                  type="number"
                  min="50"
                  max="100"
                  defaultValue={backgroundSettings?.escalation_threshold || 80}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup_retention_days">Retenção de backup (dias)</Label>
                <Input
                  id="backup_retention_days"
                  name="backup_retention_days"
                  type="number"
                  min="30"
                  max="365"
                  defaultValue={backgroundSettings?.backup_retention_days || 90}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification_email">Email para notificações</Label>
                <Input
                  id="notification_email"
                  name="notification_email"
                  type="email"
                  defaultValue={backgroundSettings?.notification_email || ''}
                  placeholder="admin@empresa.com"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit"
                disabled={updateBackgroundMutation.isPending}
              >
                {updateBackgroundMutation.isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Machine Learning e IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Inteligência Artificial
          </CardTitle>
          <CardDescription>
            Configurações para análise preditiva e aprendizado de máquina (em desenvolvimento)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Funcionalidades de IA em desenvolvimento</p>
            <p className="text-sm">Análise preditiva de riscos e recomendações inteligentes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}