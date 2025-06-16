
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, X } from "lucide-react";
import { AutomationRule } from "@/types/automation";

interface AutomationRuleFormProps {
  rule?: AutomationRule | null;
  onSave: (ruleData: any) => void;
  onCancel: () => void;
}

export function AutomationRuleForm({ rule, onSave, onCancel }: AutomationRuleFormProps) {
  const [formData, setFormData] = useState({
    name: rule?.name || "",
    description: rule?.description || "",
    isActive: rule?.isActive ?? true,
    triggerType: rule?.triggerType || "assessment_completed",
    priority: rule?.priority || "medium",
    conditions: rule?.conditions || [],
    actions: rule?.actions || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          field: "",
          operator: "equals",
          value: "",
          logicalOperator: "AND"
        }
      ]
    }));
  };

  const updateCondition = (index: number, updates: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === index ? { ...condition, ...updates } : condition
      )
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          type: "send_email",
          config: {}
        }
      ]
    }));
  };

  const updateAction = (index: number, updates: any) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) =>
        i === index ? { ...action, ...updates } : action
      )
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const triggerTypeOptions = [
    { value: "assessment_completed", label: "Avaliação Concluída" },
    { value: "risk_detected", label: "Risco Detectado" },
    { value: "deadline_approaching", label: "Prazo Próximo" },
    { value: "plan_overdue", label: "Plano em Atraso" }
  ];

  const operatorOptions = [
    { value: "equals", label: "Igual a" },
    { value: "greater_than", label: "Maior que" },
    { value: "less_than", label: "Menor que" },
    { value: "contains", label: "Contém" },
    { value: "in_range", label: "Entre valores" }
  ];

  const actionTypeOptions = [
    { value: "send_email", label: "Enviar Email" },
    { value: "create_notification", label: "Criar Notificação" },
    { value: "escalate_to_manager", label: "Escalar para Gestor" },
    { value: "create_action_plan", label: "Criar Plano de Ação" },
    { value: "schedule_meeting", label: "Agendar Reunião" }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {rule ? "Editar Regra de Automação" : "Nova Regra de Automação"}
            </CardTitle>
            <CardDescription>
              Configure condições e ações para automação inteligente
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Configuração Básica</TabsTrigger>
              <TabsTrigger value="conditions">Condições</TabsTrigger>
              <TabsTrigger value="actions">Ações</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
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
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
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
                  placeholder="Descreva quando e como esta regra será executada"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="triggerType">Evento Trigger</Label>
                  <Select
                    value={formData.triggerType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, triggerType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {triggerTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
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
            </TabsContent>

            <TabsContent value="conditions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Condições</h3>
                <Button type="button" variant="outline" onClick={addCondition}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Condição
                </Button>
              </div>

              <div className="space-y-3">
                {formData.conditions.map((condition, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-3">
                          <Label>Campo</Label>
                          <Input
                            value={condition.field}
                            onChange={(e) => updateCondition(index, { field: e.target.value })}
                            placeholder="Ex: risk_score"
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <Label>Operador</Label>
                          <Select
                            value={condition.operator}
                            onValueChange={(value) => updateCondition(index, { operator: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {operatorOptions.map(op => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-3">
                          <Label>Valor</Label>
                          <Input
                            value={condition.value}
                            onChange={(e) => updateCondition(index, { value: e.target.value })}
                            placeholder="Ex: 80"
                          />
                        </div>

                        <div className="col-span-2">
                          <Label>Lógica</Label>
                          <Select
                            value={condition.logicalOperator || "AND"}
                            onValueChange={(value) => updateCondition(index, { logicalOperator: value })}
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

                        <div className="col-span-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCondition(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {formData.conditions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma condição configurada.</p>
                    <p>Adicione condições para definir quando a regra será executada.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Ações</h3>
                <Button type="button" variant="outline" onClick={addAction}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Ação
                </Button>
              </div>

              <div className="space-y-3">
                {formData.actions.map((action, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-4">
                          <Label>Tipo de Ação</Label>
                          <Select
                            value={action.type}
                            onValueChange={(value) => updateAction(index, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {actionTypeOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="col-span-6">
                          <Label>Configuração</Label>
                          <Input
                            value={action.config.message || ""}
                            onChange={(e) => updateAction(index, { 
                              config: { ...action.config, message: e.target.value }
                            })}
                            placeholder="Configuração específica da ação"
                          />
                        </div>

                        <div className="col-span-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAction(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {formData.actions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma ação configurada.</p>
                    <p>Adicione ações para definir o que acontecerá quando as condições forem atendidas.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {rule ? "Atualizar" : "Criar"} Regra
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
