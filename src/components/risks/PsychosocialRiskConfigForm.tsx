import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PsychosocialRiskConfigFormProps {
  selectedCompanyId: string | null;
}

export function PsychosocialRiskConfigForm({ selectedCompanyId }: PsychosocialRiskConfigFormProps) {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['psychosocial-risk-config', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return null;
      
      const { data, error } = await supabase
        .from('psychosocial_risk_config')
        .select('*')
        .eq('company_id', selectedCompanyId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!selectedCompanyId
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (configData: any) => {
      if (!selectedCompanyId) throw new Error('Company ID required');

      const { data, error } = await supabase
        .from('psychosocial_risk_config')
        .upsert({
          company_id: selectedCompanyId,
          ...configData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Configurações salvas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['psychosocial-risk-config'] });
    },
    onError: (error) => {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
    }
  });

  const handleSave = (formData: FormData) => {
    const configData = {
      auto_generation_enabled: formData.get('auto_generation_enabled') === 'on',
      manager_notification_enabled: formData.get('manager_notification_enabled') === 'on',
      hr_notification_enabled: formData.get('hr_notification_enabled') === 'on',
      compliance_requirements: {
        nr01_compliance: formData.get('nr01_compliance') === 'on',
        risk_assessment_frequency: formData.get('risk_assessment_frequency') || '90',
        action_plan_mandatory: formData.get('action_plan_mandatory') === 'on'
      },
      custom_thresholds: {
        low_risk: parseInt(formData.get('low_risk') as string) || 30,
        medium_risk: parseInt(formData.get('medium_risk') as string) || 60,
        high_risk: parseInt(formData.get('high_risk') as string) || 80
      }
    };

    updateConfigMutation.mutate(configData);
  };

  if (!selectedCompanyId) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para configurar</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center p-8">Carregando configurações...</div>;
  }

  return (
    <form action={handleSave} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Automação e Processamento</CardTitle>
          <CardDescription>
            Configure como o sistema deve processar automaticamente as avaliações psicossociais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto_generation_enabled">Geração automática de planos de ação</Label>
              <p className="text-sm text-muted-foreground">
                Criar automaticamente planos de ação para riscos altos e críticos
              </p>
            </div>
            <Switch 
              id="auto_generation_enabled" 
              name="auto_generation_enabled"
              defaultChecked={config?.auto_generation_enabled ?? true}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="manager_notification_enabled">Notificar gestores</Label>
              <p className="text-sm text-muted-foreground">
                Enviar emails para gestores quando riscos forem identificados
              </p>
            </div>
            <Switch 
              id="manager_notification_enabled" 
              name="manager_notification_enabled"
              defaultChecked={config?.manager_notification_enabled ?? true}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hr_notification_enabled">Notificar RH</Label>
              <p className="text-sm text-muted-foreground">
                Enviar emails para equipe de RH sobre análises de risco
              </p>
            </div>
            <Switch 
              id="hr_notification_enabled" 
              name="hr_notification_enabled"
              defaultChecked={config?.hr_notification_enabled ?? true}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limites de Risco Customizados</CardTitle>
          <CardDescription>
            Defina os percentuais que determinam os níveis de risco para sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="low_risk">Risco Baixo (até %)</Label>
              <Input
                id="low_risk"
                name="low_risk"
                type="number"
                min="0"
                max="100"
                defaultValue={config?.custom_thresholds?.low_risk || 30}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medium_risk">Risco Médio (até %)</Label>
              <Input
                id="medium_risk"
                name="medium_risk"
                type="number"
                min="0"
                max="100"
                defaultValue={config?.custom_thresholds?.medium_risk || 60}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="high_risk">Risco Alto (até %)</Label>
              <Input
                id="high_risk"
                name="high_risk"
                type="number"
                min="0"
                max="100"
                defaultValue={config?.custom_thresholds?.high_risk || 80}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Acima do valor de Risco Alto será considerado Risco Crítico
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conformidade NR-01</CardTitle>
          <CardDescription>
            Configurações específicas para atender aos requisitos da Norma Regulamentadora 01
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="nr01_compliance">Conformidade obrigatória NR-01</Label>
              <p className="text-sm text-muted-foreground">
                Aplicar todos os requisitos obrigatórios da NR-01
              </p>
            </div>
            <Switch 
              id="nr01_compliance" 
              name="nr01_compliance"
              defaultChecked={config?.compliance_requirements?.nr01_compliance ?? true}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="risk_assessment_frequency">Frequência de reavaliação (dias)</Label>
            <Input
              id="risk_assessment_frequency"
              name="risk_assessment_frequency"
              type="number"
              min="30"
              max="365"
              defaultValue={config?.compliance_requirements?.risk_assessment_frequency || 90}
            />
            <p className="text-sm text-muted-foreground">
              Período para reavaliação automática de riscos identificados
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="action_plan_mandatory">Plano de ação obrigatório</Label>
              <p className="text-sm text-muted-foreground">
                Exigir plano de ação para todos os riscos médios, altos e críticos
              </p>
            </div>
            <Switch 
              id="action_plan_mandatory" 
              name="action_plan_mandatory"
              defaultChecked={config?.compliance_requirements?.action_plan_mandatory ?? true}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={updateConfigMutation.isPending}
        >
          {updateConfigMutation.isPending ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </form>
  );
}