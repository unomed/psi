
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, Target } from 'lucide-react';
import { toast } from 'sonner';

interface RiskAnalysis {
  id: string;
  category: string;
  exposure_level: string;
  risk_score: number;
  evaluation_date: string;
  recommended_actions: string[];
}

interface CreateActionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  riskAnalysis?: RiskAnalysis;
  onCreatePlan: (planData: any) => void;
}

export function CreateActionPlanDialog({
  open,
  onOpenChange,
  riskAnalysis,
  onCreatePlan,
}: CreateActionPlanDialogProps) {
  const [formData, setFormData] = useState({
    title: riskAnalysis ? `Plano NR-01: ${riskAnalysis.category} - ${riskAnalysis.exposure_level}` : '',
    description: riskAnalysis ? `Plano de ação gerado para mitigar riscos psicossociais identificados na categoria ${riskAnalysis.category} com nível de exposição ${riskAnalysis.exposure_level}.` : '',
    priority: riskAnalysis?.exposure_level === 'critico' ? 'high' : riskAnalysis?.exposure_level === 'alto' ? 'high' : 'medium',
    due_date: '',
    responsible_user_id: '',
    sector_id: '',
  });

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critico': return 'destructive';
      case 'alto': return 'destructive';
      case 'medio': return 'default';
      case 'baixo': return 'secondary';
      default: return 'outline';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    const planData = {
      ...formData,
      status: 'draft',
      risk_level: riskAnalysis?.exposure_level || 'medio',
      assessment_response_id: riskAnalysis?.id,
      start_date: new Date().toISOString().split('T')[0],
    };

    onCreatePlan(planData);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      due_date: '',
      responsible_user_id: '',
      sector_id: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Criar Plano de Ação NR-01
          </DialogTitle>
          <DialogDescription>
            {riskAnalysis 
              ? 'Criar um plano de ação baseado na análise de risco psicossocial identificada.'
              : 'Criar um novo plano de ação para conformidade com a NR-01.'
            }
          </DialogDescription>
        </DialogHeader>

        {riskAnalysis && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-800">Análise de Risco Associada</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Categoria:</span> {riskAnalysis.category}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Nível de Exposição:</span>
                <Badge variant={getRiskLevelColor(riskAnalysis.exposure_level) as any}>
                  {riskAnalysis.exposure_level}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Score de Risco:</span> {riskAnalysis.risk_score}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">Data da Avaliação:</span>
                {new Date(riskAnalysis.evaluation_date).toLocaleDateString('pt-BR')}
              </div>
            </div>
            
            {riskAnalysis.recommended_actions && riskAnalysis.recommended_actions.length > 0 && (
              <div className="mt-3">
                <span className="font-medium text-amber-800">Ações Recomendadas:</span>
                <ul className="list-disc list-inside mt-1 text-sm text-amber-700">
                  {riskAnalysis.recommended_actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Plano *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Plano NR-01: Redução de Riscos Psicossociais"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva os objetivos e escopo do plano de ação..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Data de Vencimento</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Plano de Ação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
