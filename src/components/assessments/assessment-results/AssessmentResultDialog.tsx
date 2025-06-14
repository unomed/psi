
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, User, FileText, TrendingUp } from "lucide-react";

interface AssessmentResultDialogProps {
  result: any;
  isOpen: boolean;
  onClose: () => void;
}

export function AssessmentResultDialog({ result, isOpen, onClose }: AssessmentResultDialogProps) {
  if (!result) return null;

  const renderDISCResults = () => {
    if (!result.factors_scores) return null;

    const factors = ['D', 'I', 'S', 'C'];
    const factorNames = {
      D: 'Dominância',
      I: 'Influência', 
      S: 'Estabilidade',
      C: 'Conformidade'
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Perfil DISC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {factors.map(factor => {
            const score = result.factors_scores[factor] || 0;
            const percentage = Math.round(score * 100);
            
            return (
              <div key={factor} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {factor} - {factorNames[factor as keyof typeof factorNames]}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {percentage}%
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
          
          <div className="mt-6 p-4 bg-primary/5 rounded-lg">
            <h4 className="font-medium mb-2">Fator Dominante</h4>
            <p className="text-lg font-semibold text-primary">
              {result.dominant_factor}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPsicossocialResults = () => {
    if (!result.factors_scores) return null;

    const categories = Object.keys(result.factors_scores);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resultados por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map(category => {
            const score = result.factors_scores[category];
            const percentage = Math.round(score * 20); // Convert 1-5 scale to percentage
            
            const riskLevel = 
              percentage >= 80 ? { label: 'Alto', color: 'destructive' } :
              percentage >= 60 ? { label: 'Médio', color: 'secondary' } :
              percentage >= 40 ? { label: 'Baixo', color: 'default' } :
              { label: 'Muito Baixo', color: 'outline' };
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category}</span>
                  <Badge variant={riskLevel.color as any}>
                    {riskLevel.label} Risco
                  </Badge>
                </div>
                <Progress 
                  value={percentage} 
                  className={`h-2 ${
                    percentage >= 80 ? '[&>div]:bg-red-500' :
                    percentage >= 60 ? '[&>div]:bg-orange-500' :
                    percentage >= 40 ? '[&>div]:bg-yellow-500' :
                    '[&>div]:bg-green-500'
                  }`}
                />
                <div className="text-sm text-muted-foreground">
                  Pontuação: {score.toFixed(1)} / 5.0
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  const getTemplateType = () => {
    return result.checklist_templates?.type || 'custom';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resultado da Avaliação
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Funcionário:</strong> {result.employees?.name || result.employee_name || 'Anônimo'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Data:</strong> {new Date(result.completed_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Template:</strong> {result.checklist_templates?.title || 'Sem título'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Tipo:</strong> {getTemplateType().toUpperCase()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          {getTemplateType() === 'disc' ? renderDISCResults() : renderPsicossocialResults()}

          {/* Notas adicionais */}
          {result.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{result.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
