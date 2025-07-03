import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuditLogger, AuditAction, AuditModule } from '@/hooks/useAuditLogger';
import { toast } from 'sonner';
import { Play, Zap } from 'lucide-react';

export function AuditLogGenerator() {
  const { logAction } = useAuditLogger();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    action: 'create' as AuditAction,
    module: 'settings' as AuditModule,
    resourceType: '',
    resourceId: '',
    description: '',
  });

  const actionOptions: { value: AuditAction; label: string }[] = [
    { value: 'create', label: 'Criar' },
    { value: 'read', label: 'Visualizar' },
    { value: 'update', label: 'Atualizar' },
    { value: 'delete', label: 'Excluir' },
    { value: 'login', label: 'Login' },
    { value: 'logout', label: 'Logout' },
    { value: 'export', label: 'Exportar' },
    { value: 'import', label: 'Importar' },
    { value: 'email_send', label: 'Envio Email' },
    { value: 'permission_change', label: 'Alterar Permissão' },
    { value: 'assessment_complete', label: 'Avaliação Completa' },
    { value: 'report_generate', label: 'Gerar Relatório' }
  ];

  const moduleOptions: { value: AuditModule; label: string }[] = [
    { value: 'auth', label: 'Autenticação' },
    { value: 'companies', label: 'Empresas' },
    { value: 'employees', label: 'Funcionários' },
    { value: 'roles', label: 'Funções' },
    { value: 'sectors', label: 'Setores' },
    { value: 'assessments', label: 'Avaliações' },
    { value: 'reports', label: 'Relatórios' },
    { value: 'billing', label: 'Faturamento' },
    { value: 'settings', label: 'Configurações' },
    { value: 'risks', label: 'Riscos' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast.error('Descrição é obrigatória');
      return;
    }

    setLoading(true);
    try {
      await logAction({
        action: formData.action,
        module: formData.module,
        resourceType: formData.resourceType || undefined,
        resourceId: formData.resourceId || undefined,
        description: formData.description,
        metadata: {
          generated_by: 'audit_generator',
          timestamp: new Date().toISOString()
        }
      });

      toast.success('Log de auditoria criado com sucesso!');
      
      // Reset form
      setFormData({
        action: 'create' as AuditAction,
        module: 'settings' as AuditModule,
        resourceType: '',
        resourceId: '',
        description: '',
      });
    } catch (error) {
      console.error('Erro ao criar log:', error);
      toast.error('Erro ao criar log de auditoria');
    } finally {
      setLoading(false);
    }
  };

  const generateExampleLogs = async () => {
    setLoading(true);
    try {
      const exampleActions = [
        {
          action: 'login' as AuditAction,
          module: 'auth' as AuditModule,
          description: 'Usuário administrador fez login no sistema',
          metadata: { ip: '192.168.1.100', user_agent: 'Chrome/120.0' }
        },
        {
          action: 'create' as AuditAction,
          module: 'employees' as AuditModule,
          resourceType: 'employee',
          resourceId: 'emp-' + Date.now(),
          description: 'Novo funcionário cadastrado no sistema',
          metadata: { department: 'Recursos Humanos' }
        },
        {
          action: 'export' as AuditAction,
          module: 'reports' as AuditModule,
          resourceType: 'audit_report',
          description: 'Relatório de auditoria exportado',
          metadata: { format: 'PDF', filters: 'últimos_30_dias' }
        },
        {
          action: 'update' as AuditAction,
          module: 'settings' as AuditModule,
          resourceType: 'notification_config',
          resourceId: 'notif-config-1',
          description: 'Configurações de notificação atualizadas',
          metadata: { changes: 'email_enabled: true' }
        },
        {
          action: 'assessment_complete' as AuditAction,
          module: 'assessments' as AuditModule,
          resourceType: 'assessment',
          resourceId: 'assess-' + Date.now(),
          description: 'Avaliação psicossocial concluída',
          metadata: { score: 75, risk_level: 'medium' }
        }
      ];

      for (const actionData of exampleActions) {
        await logAction(actionData);
        // Pequeno delay para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast.success(`${exampleActions.length} logs de exemplo criados!`);
    } catch (error) {
      console.error('Erro ao gerar logs de exemplo:', error);
      toast.error('Erro ao gerar logs de exemplo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Gerador de Log de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="action">Ação</Label>
                <Select 
                  value={formData.action} 
                  onValueChange={(value: AuditAction) => setFormData(prev => ({ ...prev, action: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {actionOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="module">Módulo</Label>
                <Select 
                  value={formData.module} 
                  onValueChange={(value: AuditModule) => setFormData(prev => ({ ...prev, module: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {moduleOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resourceType">Tipo de Recurso (Opcional)</Label>
                <Input
                  id="resourceType"
                  value={formData.resourceType}
                  onChange={(e) => setFormData(prev => ({ ...prev, resourceType: e.target.value }))}
                  placeholder="ex: employee, company, assessment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resourceId">ID do Recurso (Opcional)</Label>
                <Input
                  id="resourceId"
                  value={formData.resourceId}
                  onChange={(e) => setFormData(prev => ({ ...prev, resourceId: e.target.value }))}
                  placeholder="ex: emp-001, comp-123"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva a ação realizada..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Log'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={generateExampleLogs}
                disabled={loading}
              >
                <Zap className="h-4 w-4 mr-2" />
                Gerar Logs de Exemplo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como Funciona o Sistema de Auditoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Logs Automáticos</h4>
              <p className="text-sm text-muted-foreground">
                O sistema registra automaticamente ações importantes como:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Login/Logout de usuários</li>
                <li>• Criação/Edição de funcionários</li>
                <li>• Conclusão de avaliações</li>
                <li>• Geração de relatórios</li>
                <li>• Alterações em configurações</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Informações Capturadas</h4>
              <p className="text-sm text-muted-foreground">
                Cada log contém informações detalhadas:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Data/hora exata da ação</li>
                <li>• Usuário que executou</li>
                <li>• IP e navegador usado</li>
                <li>• Dados alterados (antes/depois)</li>
                <li>• Contexto e metadados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}