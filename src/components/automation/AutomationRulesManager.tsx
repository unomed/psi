
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Bell,
  Users,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { useManagerAutomation } from "@/hooks/automation/useManagerAutomation";
import { AutomationRuleForm } from "./AutomationRuleForm";
import { NotificationCenter } from "./NotificationCenter";
import { EscalationConfig } from "./EscalationConfig";
import { AutomationMetrics } from "./AutomationMetrics";

interface AutomationRulesManagerProps {
  companyId?: string;
}

export function AutomationRulesManager({ companyId }: AutomationRulesManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  
  const {
    automationRules,
    managerNotifications,
    escalationLevels,
    isLoading,
    createRule,
    updateRule,
    deleteRule,
    markNotificationRead
  } = useManagerAutomation(companyId);

  const handleCreateRule = async (ruleData: any) => {
    try {
      await createRule(ruleData);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating rule:", error);
    }
  };

  const handleUpdateRule = async (ruleData: any) => {
    if (!editingRule) return;
    
    try {
      await updateRule({ id: editingRule.id, updates: ruleData });
      setEditingRule(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating rule:", error);
    }
  };

  const handleToggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      await updateRule({ id: ruleId, updates: { isActive } });
    } catch (error) {
      console.error("Error toggling rule:", error);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (confirm("Tem certeza que deseja excluir esta regra de automação?")) {
      try {
        await deleteRule(ruleId);
      } catch (error) {
        console.error("Error deleting rule:", error);
      }
    }
  };

  const getUnreadNotifications = () => {
    return managerNotifications.filter(n => !n.isRead);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTriggerTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'assessment_completed': 'Avaliação Concluída',
      'risk_detected': 'Risco Detectado',
      'deadline_approaching': 'Prazo Próximo',
      'plan_overdue': 'Plano em Atraso'
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p>Carregando configurações de automação...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Automação para Gestores</h2>
          <p className="text-muted-foreground">
            Configure regras inteligentes e notificações automáticas
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            {getUnreadNotifications().length} não lidas
          </Badge>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Regra
          </Button>
        </div>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Regras
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="escalation" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Escalação
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Métricas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <div className="space-y-4">
            {/* Lista de Regras */}
            <div className="grid gap-4">
              {automationRules.map((rule: any) => (
                <Card key={rule.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {rule.name}
                          <Badge 
                            variant="outline" 
                            className={`${getPriorityColor(rule.priority)} text-white`}
                          >
                            {rule.priority}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{rule.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.isActive || rule.is_active}
                          onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingRule(rule);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {(rule.isActive || rule.is_active) ? (
                          <Play className="h-3 w-3 text-green-500" />
                        ) : (
                          <Pause className="h-3 w-3 text-gray-500" />
                        )}
                        {(rule.isActive || rule.is_active) ? 'Ativa' : 'Pausada'}
                      </div>
                      <div>Trigger: {getTriggerTypeLabel(rule.triggerType || rule.trigger_type)}</div>
                      <div>{rule.actions?.length || 0} ações configuradas</div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {automationRules.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma regra configurada</h3>
                    <p className="text-muted-foreground mb-4">
                      Crie regras de automação para otimizar a gestão
                    </p>
                    <Button onClick={() => setShowForm(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Primeira Regra
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationCenter 
            notifications={managerNotifications}
            onMarkAsRead={markNotificationRead}
          />
        </TabsContent>

        <TabsContent value="escalation">
          <EscalationConfig 
            escalationLevels={escalationLevels}
            companyId={companyId}
          />
        </TabsContent>

        <TabsContent value="metrics">
          <AutomationMetrics companyId={companyId} />
        </TabsContent>
      </Tabs>

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <AutomationRuleForm
              rule={editingRule}
              onSave={editingRule ? handleUpdateRule : handleCreateRule}
              onCancel={() => {
                setShowForm(false);
                setEditingRule(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
