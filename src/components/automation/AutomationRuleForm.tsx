
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AutomationRule, AutomationCondition, AutomationAction } from "@/types/automation";
import { Plus, X, Save, AlertTriangle } from "lucide-react";

interface AutomationRuleFormProps {
  rule?: AutomationRule | null;
  onSave: (ruleData: any) => Promise<void>;
  onCancel: () => void;
}

export function AutomationRuleForm({ rule, onSave, onCancel }: AutomationRuleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    triggerType: 'risk_detected' as 'assessment_completed' | 'risk_detected' | 'deadline_approaching' | 'plan_overdue',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    conditions: [] as AutomationCondition[],
    actions: [] as AutomationAction[]
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description,
        isActive: rule.isActive,
        triggerType: rule.triggerType,
        priority: rule.priority,
        conditions: rule.conditions || [],
        actions: rule.actions || []
      });
    }
  }, [rule]);

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          field: '',
          operator: 'equals',
          value: '',
          logicalOperator: 'AND'
        }
      ]
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const updateCondition = (index: number, field: keyof AutomationCondition, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          type: 'send_email',
          config: {}
        }
      ]
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const updateAction = (index: number, field: keyof AutomationAction, value: any) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };

  const handlePriorityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      priority: value as 'low' | 'medium' | 'high' | 'critical'
    }));
  };

  const handleTriggerTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      triggerType: value as 'assessment_completed' | 'risk_detected' | 'deadline_approaching' | 'plan_overdue'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving rule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {rule ? 'Editar Regra de Automação' : 'Nova Regra de Automação'}
        </CardTitle>
        <CardDescription>
          Configure condições e ações para automação inteligente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Configurações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações Básicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Regra</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Alerta de Alto Risco"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={formData.priority} onValueChange={handlePriorityChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o propósito desta regra de automação"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Label htmlFor="triggerType">Tipo de Trigger</Label>
                <Select value={formData.triggerType} onValueChange={handleTriggerTypeChange}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assessment_completed">Avaliação Concluída</SelectItem>
                    <SelectItem value="risk_detected">Risco Detectado</SelectItem>
                    <SelectItem value="deadline_approaching">Prazo Próximo</SelectItem>
                    <SelectItem value="plan_overdue">Plano em Atraso</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Regra Ativa</Label>
              </div>
            </div>
          </div>

          {/* Condições */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Condições</h3>
              <Button type="button" variant="outline" onClick={addCondition}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Condição
              </Button>
            </div>

            {formData.conditions.map((condition, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <Label>Campo</Label>
                        <Input
                          value={condition.field}
                          onChange={(e) => updateCondition(index, 'field', e.target.value)}
                          placeholder="Ex: risk_level"
                        />
                      </div>
                      <div>
                        <Label>Operador</Label>
                        <Select 
                          value={condition.operator} 
                          onValueChange={(value) => updateCondition(index, 'operator', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Igual a</SelectItem>
                            <SelectItem value="greater_than">Maior que</SelectItem>
                            <SelectItem value="less_than">Menor que</SelectItem>
                            <SelectItem value="contains">Contém</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Valor</Label>
                        <Input
                          value={condition.value}
                          onChange={(e) => updateCondition(index, 'value', e.target.value)}
                          placeholder="Ex: alto"
                        />
                      </div>
                      <div>
                        <Label>Operador Lógico</Label>
                        <Select 
                          value={condition.logicalOperator} 
                          onValueChange={(value) => updateCondition(index, 'logicalOperator', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">E</SelectItem>
                            <SelectItem value="OR">OU</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ações */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Ações</h3>
              <Button type="button" variant="outline" onClick={addAction}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Ação
              </Button>
            </div>

            {formData.actions.map((action, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <Label>Tipo de Ação</Label>
                        <Select 
                          value={action.type} 
                          onValueChange={(value) => updateAction(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="send_email">Enviar Email</SelectItem>
                            <SelectItem value="create_notification">Criar Notificação</SelectItem>
                            <SelectItem value="escalate_to_manager">Escalar para Gestor</SelectItem>
                            <SelectItem value="create_action_plan">Criar Plano de Ação</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Configurações</Label>
                        <Input
                          value={JSON.stringify(action.config)}
                          onChange={(e) => {
                            try {
                              const config = JSON.parse(e.target.value);
                              updateAction(index, 'config', config);
                            } catch {
                              // Ignore invalid JSON
                            }
                          }}
                          placeholder='{"templateId": "template1"}'
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAction(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Regra'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
