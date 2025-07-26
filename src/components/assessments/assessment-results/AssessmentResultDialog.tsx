
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

  // Calcular o nível de risco baseado no raw_score
  const calculateRiskLevel = () => {
    // Se já tem risk_level preenchido e não é null, usar ele
    if (result.risk_level && result.risk_level.toLowerCase() !== 'null') {
      return result.risk_level;
    }
    
    // Calcular baseado no raw_score (mesma lógica do processamento automático)
    if (result.raw_score || result.rawScore) {
      const score = result.raw_score || result.rawScore;
      if (score >= 80) return 'Crítico';
      if (score >= 60) return 'Alto';
      if (score >= 40) return 'Médio';
      return 'Baixo';
    }
    
    // Fallback para factors_scores (DISC)
    if (result.factors_scores || result.factorsScores) {
      const scores = result.factors_scores || result.factorsScores;
      const scoreValues = Object.values(scores) as number[];
      const avgScore = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;
      
      if (avgScore >= 0.8) return 'Alto';
      if (avgScore >= 0.6) return 'Médio';
      return 'Baixo';
    }
    
    return 'Baixo';
  };

  const riskLevel = calculateRiskLevel();

  const renderDISCResults = () => {
    if (!result.factorsScores && !result.factors_scores) return null;

    const scores = result.factorsScores || result.factors_scores;

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
            const score = scores[factor] || 0;
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
              {result.dominant_factor || result.dominantFactor}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPsicossocialResults = () => {
    if (!result.factorsScores && !result.factors_scores) return null;

    const scores = result.factorsScores || result.factors_scores;
    const categories = Object.keys(scores);
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resultados por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map(category => {
            const score = scores[category];
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

  const getScaleText = (value: any, scaleType: string = 'likert5') => {
    const numValue = Number(value);
    
    if (scaleType === 'likert5') {
      const likert5Scale = {
        1: 'Nunca',
        2: 'Raramente', 
        3: 'Às vezes',
        4: 'Frequentemente',
        5: 'Sempre'
      };
      return likert5Scale[numValue] || `Valor: ${value}`;
    }
    
    return String(value);
  };

  const renderResponseData = () => {
    if (!result.responseData && !result.response_data) return null;
    
    const responseData = result.responseData || result.response_data;
    if (!responseData || typeof responseData !== 'object') return null;

    const questions = result.questions || [];
    const templateType = result.checklist_templates?.type || result.templateType;
    
    // Se temos questões do template, vamos mapear as respostas com as perguntas
    if (questions.length > 0) {
      const questionsWithAnswers = questions
        .sort((a, b) => a.order_number - b.order_number)
        .map(question => {
          // Procurar a resposta para esta questão no responseData
          const answer = responseData[question.id] || 
                        Object.entries(responseData).find(([key, value]) => 
                          key.includes(question.id.substring(0, 8))
                        )?.[1];
          
          return {
            question: question.question_text,
            answer: answer !== undefined ? answer : 'Não respondido',
            questionId: question.id
          };
        })
        .filter(item => item.answer !== 'Não respondido');

      if (questionsWithAnswers.length === 0) {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Respostas do Questionário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                As respostas do questionário foram processadas e os resultados estão disponíveis acima.
              </p>
            </CardContent>
          </Card>
        );
      }

      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Respostas do Questionário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questionsWithAnswers.map((item, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <div className="font-medium text-sm mb-2 text-primary">
                  {item.question}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Resposta: </span>
                  <span className="text-primary font-medium">
                    {templateType === 'psicossocial' ? 
                      getScaleText(item.answer, 'likert5') : 
                      String(item.answer)
                    }
                  </span>
                  {templateType === 'psicossocial' && typeof item.answer === 'number' && (
                    <span className="text-muted-foreground ml-2">({item.answer})</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }

    // Fallback: mostrar dados filtrados se não há questões mapeadas
    const filteredData = Object.entries(responseData).filter(([key, value]) => {
      if (key === 'total_score' || key === 'raw_score' || key === 'factors_scores') return false;
      if (typeof key === 'string' && key.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)) return false;
      if (typeof value === 'string' && value.match(/^[a-f0-9]{8}-[a-f0-9]{4}/)) return false;
      return true;
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Respostas do Questionário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map(([key, value], index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="font-medium text-sm mb-1">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div className="text-sm text-muted-foreground">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              As respostas do questionário foram processadas e os resultados estão disponíveis acima.
            </p>
          )}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Data:</strong> {result.completed_at || result.completedAt ? 
                      new Date(result.completed_at || result.completedAt).toLocaleDateString('pt-BR') : 
                      'Data não disponível'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Template:</strong> {result.checklist_templates?.title || result.templateTitle || 'Sem título'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Tipo:</strong> {(result.templateType || getTemplateType()).toUpperCase()}
                  </span>
                </div>
              </div>
              
              {(result.sector || result.role) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                  {result.sector && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        <strong>Setor:</strong> {result.sector}
                      </span>
                    </div>
                  )}
                  {result.role && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        <strong>Função:</strong> {result.role}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scores Gerais */}
          {(result.rawScore || result.raw_score || result.normalizedScore || result.normalized_score) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pontuações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(result.rawScore || result.raw_score) && (
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{result.rawScore || result.raw_score}</div>
                      <div className="text-sm text-muted-foreground">Score Bruto</div>
                    </div>
                  )}
                  {(result.normalizedScore || result.normalized_score) && (
                    <div className="text-center p-3 bg-secondary/5 rounded-lg">
                      <div className="text-2xl font-bold">
                        {(result.normalizedScore || result.normalized_score).toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Score Normalizado</div>
                    </div>
                  )}
                  <div className="text-center p-3 bg-accent/5 rounded-lg">
                    <div className="text-2xl font-bold">{riskLevel}</div>
                    <div className="text-sm text-muted-foreground">Nível de Risco</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resultados */}
          {getTemplateType() === 'disc' ? renderDISCResults() : renderPsicossocialResults()}

          {/* Respostas do Questionário */}
          {renderResponseData()}

          {/* Classificação */}
          {result.classification && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Classificação</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-base px-3 py-1">
                  {result.classification.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          )}

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
