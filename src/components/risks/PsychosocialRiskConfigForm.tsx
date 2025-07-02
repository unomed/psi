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

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const configData = {
      auto_generate_plans: formData.get('auto_generate_plans') === 'on',
      notification_enabled: formData.get('notification_enabled') === 'on',
      threshold_low: parseInt(formData.get('threshold_low') as string) || 30,
      threshold_medium: parseInt(formData.get('threshold_medium') as string) || 60,
      threshold_high: parseInt(formData.get('threshold_high') as string) || 80,
      periodicidade_dias: parseInt(formData.get('periodicidade_dias') as string) || 90,
      prazo_acao_alta_dias: parseInt(formData.get('prazo_acao_alta_dias') as string) || 30,
      prazo_acao_critica_dias: parseInt(formData.get('prazo_acao_critica_dias') as string) || 15
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
    <form onSubmit={handleSave} className="space-y-6">
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
              <Label htmlFor="auto_generate_plans">Geração automática de planos de ação</Label>
              <p className="text-sm text-muted-foreground">
                Criar automaticamente planos de ação para riscos altos e críticos
              </p>
            </div>
            <Switch 
              id="auto_generate_plans" 
              name="auto_generate_plans"
              defaultChecked={config?.auto_generate_plans ?? true}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notification_enabled">Notificações habilitadas</Label>
              <p className="text-sm text-muted-foreground">
                Enviar notificações quando riscos forem identificados
              </p>
            </div>
            <Switch 
              id="notification_enabled" 
              name="notification_enabled"
              defaultChecked={config?.notification_enabled ?? true}
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
              <Label htmlFor="threshold_low">Risco Baixo (até %)</Label>
              <Input
                id="threshold_low"
                name="threshold_low"
                type="number"
                min="0"
                max="100"
                defaultValue={config?.threshold_low || 30}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold_medium">Risco Médio (até %)</Label>
              <Input
                id="threshold_medium"
                name="threshold_medium"
                type="number"
                min="0"
                max="100"
                defaultValue={config?.threshold_medium || 60}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold_high">Risco Alto (até %)</Label>
              <Input
                id="threshold_high"
                name="threshold_high"
                type="number"
                min="0"
                max="100"
                defaultValue={config?.threshold_high || 80}
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
          <CardTitle>Prazos e Periodicidade</CardTitle>
          <CardDescription>
            Configure prazos para reavaliações e ações conforme NR-01
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodicidade_dias">Periodicidade (dias)</Label>
              <Input
                id="periodicidade_dias"
                name="periodicidade_dias"
                type="number"
                min="30"
                max="365"
                defaultValue={config?.periodicidade_dias || 90}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazo_acao_alta_dias">Prazo ação risco alto (dias)</Label>
              <Input
                id="prazo_acao_alta_dias"
                name="prazo_acao_alta_dias"
                type="number"
                min="1"
                max="90"
                defaultValue={config?.prazo_acao_alta_dias || 30}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazo_acao_critica_dias">Prazo ação risco crítico (dias)</Label>
              <Input
                id="prazo_acao_critica_dias"
                name="prazo_acao_critica_dias"
                type="number"
                min="1"
                max="30"
                defaultValue={config?.prazo_acao_critica_dias || 15}
              />
            </div>
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