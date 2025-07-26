/**
 * FASE 3: AGENDAMENTO COLETIVO - COMPONENTE PRINCIPAL
 * RESPONSABILIDADE: Interface para agendamento em massa por setor/empresa
 * 
 * FUNCIONALIDADES:
 * - Seleção por setor ou empresa completa
 * - Filtros de função e status de funcionários
 * - Preview de seleção antes de confirmar
 * - Agendamento em lote com mesma data/template
 * - Feedback de progresso do agendamento
 * 
 * INTEGRAÇÃO:
 * - Usa SchedulingWorkflow existente como base
 * - Reutiliza templates e sistema de notificações
 * - Compatible com automação da Fase 2
 */

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  Building, 
  Filter, 
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  User,
  FileText,
  Target
} from "lucide-react";
import { ChecklistTemplate, RecurrenceType } from "@/types";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompany } from "@/contexts/CompanyContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CollectiveSchedulingWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  sector_id: string;
  role_id: string;
  status: string;
  sectors: { id: string; name: string };
  roles: { id: string; name: string };
}

interface SchedulingResult {
  success: boolean;
  employeeId: string;
  employeeName: string;
  error?: string;
}

export function CollectiveSchedulingWorkflow({ isOpen, onClose }: CollectiveSchedulingWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<'template' | 'selection' | 'details' | 'confirm'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date());
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('none');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingResults, setProcessingResults] = useState<SchedulingResult[]>([]);
  
  // Filtros
  const [selectionMode, setSelectionMode] = useState<'sector' | 'company' | 'manual'>('sector');
  const [selectedSectorId, setSelectedSectorId] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');

  const { selectedCompanyId } = useCompany();

  // Buscar templates disponíveis
  const { data: templates = [] } = useQuery({
    queryKey: ['templates-collective', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('checklist_templates')
        .select('*')
        .or(`company_id.eq.${selectedCompanyId},company_id.is.null`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId
  });

  // Buscar setores
  const { data: sectors = [] } = useQuery({
    queryKey: ['sectors-collective', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('sectors')
        .select('id, name')
        .eq('company_id', selectedCompanyId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId
  });

  // Buscar funções
  const { data: roles = [] } = useQuery({
    queryKey: ['roles-collective', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      const { data, error } = await supabase
        .from('roles')
        .select('id, name')
        .eq('company_id', selectedCompanyId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId
  });

  // Buscar funcionários baseado nos filtros
  const { data: availableEmployees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ['employees-collective', selectedCompanyId, selectedSectorId, selectedRoleId, statusFilter],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      
      let query = supabase
        .from('employees')
        .select(`
          id,
          name,
          email,
          sector_id,
          role_id,
          status,
          sectors!inner(id, name),
          roles!inner(id, name)
        `)
        .eq('company_id', selectedCompanyId)
        .eq('employee_type', 'funcionario');

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (selectedSectorId && selectionMode === 'sector') {
        query = query.eq('sector_id', selectedSectorId);
      }

      if (selectedRoleId && selectedRoleId !== 'all') {
        query = query.eq('role_id', selectedRoleId);
      }

      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data as Employee[] || [];
    },
    enabled: !!selectedCompanyId
  });

  // Auto-selecionar funcionários baseado no modo
  useEffect(() => {
    if (selectionMode === 'company') {
      setSelectedEmployees(availableEmployees);
    } else if (selectionMode === 'sector' && selectedSectorId) {
      setSelectedEmployees(availableEmployees);
    } else if (selectionMode === 'manual') {
      setSelectedEmployees([]);
    }
  }, [selectionMode, selectedSectorId, availableEmployees]);

  const handleNext = () => {
    if (currentStep === 'template' && selectedTemplate) {
      setCurrentStep('selection');
    } else if (currentStep === 'selection' && selectedEmployees.length > 0) {
      setCurrentStep('details');
    } else if (currentStep === 'details' && scheduledDate) {
      setCurrentStep('confirm');
    }
  };

  const handleBack = () => {
    if (currentStep === 'confirm') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('selection');
    } else if (currentStep === 'selection') {
      setCurrentStep('template');
    }
  };

  const handleEmployeeToggle = (employee: Employee, checked: boolean) => {
    if (checked) {
      setSelectedEmployees(prev => [...prev, employee]);
    } else {
      setSelectedEmployees(prev => prev.filter(e => e.id !== employee.id));
    }
  };

  const processCollectiveScheduling = async () => {
    if (!selectedTemplate || !scheduledDate || selectedEmployees.length === 0) {
      toast.error("Dados incompletos para agendamento coletivo");
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingResults([]);

    const results: SchedulingResult[] = [];
    
    try {
      console.log('🚀 [FASE 3] Iniciando agendamento coletivo:', {
        template: selectedTemplate.title,
        employees: selectedEmployees.length,
        date: scheduledDate
      });

      for (let i = 0; i < selectedEmployees.length; i++) {
        const employee = selectedEmployees[i];
        
        try {
          // Usar serviço direto de agendamento individual
          const { data: scheduleResult, error } = await supabase
            .from('scheduled_assessments')
            .insert({
              employee_id: employee.id,
              employee_name: employee.name,
              template_id: selectedTemplate.id,
              scheduled_date: scheduledDate.toISOString(),
              due_date: scheduledDate.toISOString(),
              status: 'scheduled',
              recurrence_type: recurrenceType,
              company_id: selectedCompanyId!
            })
            .select()
            .single();

          if (error) throw error;

          results.push({
            success: true,
            employeeId: employee.id,
            employeeName: employee.name
          });

          console.log(`✅ [FASE 3] Agendado para ${employee.name}`);
          
        } catch (error) {
          console.error(`❌ [FASE 3] Erro para ${employee.name}:`, error);
          
          results.push({
            success: false,
            employeeId: employee.id,
            employeeName: employee.name,
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          });
        }

        // Atualizar progresso
        const progress = ((i + 1) / selectedEmployees.length) * 100;
        setProcessingProgress(progress);
        setProcessingResults([...results]);
        
        // Pequena pausa para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;

      if (successCount > 0) {
        toast.success(`Agendamento coletivo concluído! ${successCount} sucessos, ${errorCount} erros.`);
      } else {
        toast.error("Nenhum agendamento foi realizado com sucesso.");
      }

      console.log('📊 [FASE 3] Resultado final:', { successCount, errorCount, results });

    } catch (error) {
      console.error('❌ [FASE 3] Erro geral no agendamento coletivo:', error);
      toast.error("Erro no processamento do agendamento coletivo");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('template');
    setSelectedTemplate(null);
    setSelectedEmployees([]);
    setScheduledDate(new Date());
    setRecurrenceType('none');
    setSelectionMode('sector');
    setSelectedSectorId('');
    setSelectedRoleId('all');
    setIsProcessing(false);
    setProcessingProgress(0);
    setProcessingResults([]);
    onClose();
  };

  const renderTemplateSelection = () => (
    <div className="space-y-4">
      <div className="text-center">
        <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-lg font-semibold">Selecionar Template</h3>
        <p className="text-sm text-muted-foreground">
          Escolha o template que será aplicado a todos os funcionários selecionados
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {templates.map(template => (
          <Card 
            key={template.id} 
            className={`cursor-pointer transition-all ${
              selectedTemplate?.id === template.id 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedTemplate(template as ChecklistTemplate)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">{template.title}</CardTitle>
                <Badge variant={template.type === 'psicossocial' ? 'destructive' : 'default'}>
                  {template.type.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description || 'Sem descrição'}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                {template.estimated_time_minutes || 30} min
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEmployeeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-lg font-semibold">Selecionar Funcionários</h3>
        <p className="text-sm text-muted-foreground">
          Escolha como selecionar os funcionários para o agendamento coletivo
        </p>
      </div>

      {/* Modo de Seleção */}
      <div className="grid grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer transition-all ${
            selectionMode === 'company' ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => setSelectionMode('company')}
        >
          <CardContent className="p-4 text-center">
            <Building className="mx-auto h-8 w-8 mb-2" />
            <p className="font-medium">Empresa Toda</p>
            <p className="text-xs text-muted-foreground">Todos os funcionários</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            selectionMode === 'sector' ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => setSelectionMode('sector')}
        >
          <CardContent className="p-4 text-center">
            <Users className="mx-auto h-8 w-8 mb-2" />
            <p className="font-medium">Por Setor</p>
            <p className="text-xs text-muted-foreground">Funcionários de um setor</p>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all ${
            selectionMode === 'manual' ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => setSelectionMode('manual')}
        >
          <CardContent className="p-4 text-center">
            <User className="mx-auto h-8 w-8 mb-2" />
            <p className="font-medium">Manual</p>
            <p className="text-xs text-muted-foreground">Selecionar individualmente</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {selectionMode === 'sector' && (
          <div className="space-y-2">
            <Label>Setor</Label>
            <Select value={selectedSectorId} onValueChange={setSelectedSectorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar setor" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map(sector => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Função (Opcional)</Label>
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as funções" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as funções</SelectItem>
              {roles.map(role => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Funcionários */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">
            Funcionários Selecionados: {selectedEmployees.length}
          </h4>
          {selectionMode === 'manual' && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedEmployees(availableEmployees)}
              >
                Selecionar Todos
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedEmployees([])}
              >
                Limpar Seleção
              </Button>
            </div>
          )}
        </div>

        <div className="max-h-64 overflow-y-auto border rounded-lg">
          {employeesLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Carregando funcionários...
            </div>
          ) : availableEmployees.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Nenhum funcionário encontrado com os filtros aplicados
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {availableEmployees.map(employee => (
                <div key={employee.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded">
                  <Checkbox
                    checked={selectedEmployees.some(e => e.id === employee.id)}
                    onCheckedChange={(checked) => handleEmployeeToggle(employee, checked as boolean)}
                    disabled={selectionMode !== 'manual'}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {employee.sectors?.name} • {employee.roles?.name}
                    </p>
                  </div>
                  <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                    {employee.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSchedulingDetails = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CalendarIcon className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-lg font-semibold">Detalhes do Agendamento</h3>
        <p className="text-sm text-muted-foreground">
          Configure a data e opções de envio para todos os funcionários
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Data do Agendamento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Recorrência</Label>
            <Select value={recurrenceType} onValueChange={(value: RecurrenceType) => setRecurrenceType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Apenas uma vez</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="semiannual">Semestral</SelectItem>
                <SelectItem value="annual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Opções de Notificação</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={sendEmail}
                  onCheckedChange={(checked) => setSendEmail(checked as boolean)}
                />
                <Label htmlFor="email">Enviar por email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whatsapp"
                  checked={sendWhatsApp}
                  onCheckedChange={(checked) => setSendWhatsApp(checked as boolean)}
                />
                <Label htmlFor="whatsapp">Enviar por WhatsApp</Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="mx-auto h-12 w-12 text-primary mb-4" />
        <h3 className="text-lg font-semibold">Confirmar Agendamento Coletivo</h3>
        <p className="text-sm text-muted-foreground">
          Revise as informações antes de executar o agendamento em lote
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo do Agendamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Template:</span>
              <span className="text-sm font-medium">{selectedTemplate?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Data:</span>
              <span className="text-sm font-medium">
                {scheduledDate ? format(scheduledDate, "PPP", { locale: ptBR }) : "Não definida"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Recorrência:</span>
              <span className="text-sm font-medium">
                {recurrenceType === 'none' ? 'Única' : recurrenceType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Funcionários:</span>
              <span className="text-sm font-medium">{selectedEmployees.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Email:</span>
              <span className="text-sm font-medium">{sendEmail ? 'Sim' : 'Não'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">WhatsApp:</span>
              <span className="text-sm font-medium">{sendWhatsApp ? 'Sim' : 'Não'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Funcionários Selecionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {selectedEmployees.map(employee => (
                <div key={employee.id} className="flex items-center justify-between text-sm">
                  <span>{employee.name}</span>
                  <span className="text-muted-foreground">{employee.sectors?.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso do processamento */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Processando Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={processingProgress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              {Math.round(processingProgress)}% - Processando {selectedEmployees.length} funcionários
            </p>
            
            {processingResults.length > 0 && (
              <div className="max-h-32 overflow-y-auto space-y-1">
                {processingResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={result.success ? 'text-green-700' : 'text-red-700'}>
                      {result.employeeName}: {result.success ? 'Sucesso' : result.error}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button
          onClick={processCollectiveScheduling}
          disabled={isProcessing}
          size="lg"
          className="px-8"
        >
          {isProcessing ? 'Processando...' : `Agendar para ${selectedEmployees.length} Funcionários`}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Agendamento Coletivo
          </DialogTitle>
          <DialogDescription>
            Agende a mesma avaliação para múltiplos funcionários de uma só vez
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="template" disabled={currentStep !== 'template'}>
                1. Template
              </TabsTrigger>
              <TabsTrigger value="selection" disabled={currentStep !== 'selection'}>
                2. Funcionários
              </TabsTrigger>
              <TabsTrigger value="details" disabled={currentStep !== 'details'}>
                3. Detalhes
              </TabsTrigger>
              <TabsTrigger value="confirm" disabled={currentStep !== 'confirm'}>
                4. Confirmar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="mt-6">
              {renderTemplateSelection()}
            </TabsContent>

            <TabsContent value="selection" className="mt-6">
              {renderEmployeeSelection()}
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              {renderSchedulingDetails()}
            </TabsContent>

            <TabsContent value="confirm" className="mt-6">
              {renderConfirmation()}
            </TabsContent>
          </Tabs>

          {/* Navegação */}
          {currentStep !== 'confirm' && (
            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 'template'}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={
                  (currentStep === 'template' && !selectedTemplate) ||
                  (currentStep === 'selection' && selectedEmployees.length === 0) ||
                  (currentStep === 'details' && !scheduledDate)
                }
              >
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}