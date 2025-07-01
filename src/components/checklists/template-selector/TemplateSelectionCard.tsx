
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Target, Heart, RefreshCw, Brain, Activity, Clock } from "lucide-react";

// Mapeamento de categorias para nomes legíveis
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  // DISC
  dominancia: "Dominância",
  influencia: "Influência", 
  estabilidade: "Estabilidade",
  conformidade: "Conformidade",
  
  // Psicossocial
  demandas_trabalho: "Demandas Trabalho",
  controle_autonomia: "Controle Autonomia",
  condicoes_ambientais: "Condições Ambientais",
  relacoes_socioprofissionais: "Relações Socioprofissionais",
  reconhecimento_crescimento: "Reconhecimento Crescimento",
  suporte_social: "Suporte Social",
  relacionamentos: "Relacionamentos",
  clareza_papel: "Clareza Papel",
  
  // Saúde Mental
  sintomas_fisicos: "Sintomas Físicos",
  sintomas_psiquicos: "Sintomas Psíquicos",
  humor_depressivo: "Humor Depressivo",
  sintomas_sono: "Sintomas Sono",
  ansiedade: "Ansiedade",
  exaustao_emocional: "Exaustão Emocional",
  despersonalizacao: "Despersonalização",
  consumo_alcool: "Consumo Álcool",
  consumo_pesado: "Consumo Pesado",
  estresse_percebido: "Estresse Percebido",
  
  // Vida Pessoal
  situacao_financeira: "Situação Financeira",
  relacionamentos_familiares: "Relacionamentos Familiares",
  saude_fisica: "Saúde Física",
  
  // 360°
  colaboracao: "Colaboração",
  comunicacao: "Comunicação",
  confiabilidade: "Confiabilidade",
  lideranca: "Liderança",
  feedback: "Feedback",
  desenvolvimento: "Desenvolvimento"
};

interface TemplateSelectionCardProps {
  template: any;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
  onUseTemplate: (templateId: string) => void;
}

export function TemplateSelectionCard({ 
  template, 
  isSelected, 
  onSelect, 
  onUseTemplate 
}: TemplateSelectionCardProps) {
  const getTemplateIcon = (templateId: string) => {
    if (templateId.includes("disc")) return <Target className="h-5 w-5 text-orange-600" />;
    if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) return <Brain className="h-5 w-5 text-purple-600" />;
    if (templateId.includes("mbi") || templateId.includes("audit") || templateId.includes("pss")) return <Activity className="h-5 w-5 text-red-600" />;
    if (templateId.includes("personal")) return <Heart className="h-5 w-5 text-pink-600" />;
    if (templateId.includes("360")) return <RefreshCw className="h-5 w-5 text-indigo-600" />;
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return <Activity className="h-5 w-5 text-blue-600" />;
    return <FileText className="h-5 w-5 text-gray-600" />;
  };

  const getTemplateColor = (templateId: string) => {
    if (templateId.includes("disc")) return "bg-orange-50 border-orange-200 hover:bg-orange-100";
    if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) return "bg-purple-50 border-purple-200 hover:bg-purple-100";
    if (templateId.includes("mbi") || templateId.includes("audit") || templateId.includes("pss")) return "bg-red-50 border-red-200 hover:bg-red-100";
    if (templateId.includes("personal")) return "bg-pink-50 border-pink-200 hover:bg-pink-100";
    if (templateId.includes("360")) return "bg-indigo-50 border-indigo-200 hover:bg-indigo-100";
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return "bg-blue-50 border-blue-200 hover:bg-blue-100";
    return "bg-gray-50 border-gray-200 hover:bg-gray-100";
  };

  const getTemplateTypeLabel = (templateId: string) => {
    if (templateId.includes("disc")) return "DISC";
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return "Psicossocial";
    if (templateId.includes("360")) return "360°";
    if (templateId.includes("personal")) return "Vida Pessoal";
    return "Saúde Mental";
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${getTemplateColor(template.id)} ${
        isSelected ? 'ring-2 ring-primary scale-105' : ''
      }`}
      onClick={() => onSelect(template.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getTemplateIcon(template.id)}
            <Badge variant="outline" className="text-xs">
              {template.typeLabel || getTemplateTypeLabel(template.id)}
            </Badge>
          </div>
          {isSelected && (
            <CheckCircle className="h-5 w-5 text-primary" />
          )}
        </div>
        <CardTitle className="text-sm leading-tight">
          {template.name}
        </CardTitle>
        <CardDescription className="text-xs line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium mb-2 text-muted-foreground">Categorias/Fatores:</p>
            <div className="flex flex-wrap gap-1">
              {template.categories.slice(0, 3).map((categoryId: string) => (
                <Badge key={categoryId} variant="secondary" className="text-xs">
                  {CATEGORY_DISPLAY_NAMES[categoryId] || categoryId.replace('_', ' ')}
                </Badge>
              ))}
              {template.categories.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.categories.length - 3} mais
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>Perguntas: {template.estimatedQuestions}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{template.estimatedTimeMinutes} min</span>
            </div>
          </div>
          
          {isSelected && (
            <div className="pt-2 border-t">
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onUseTemplate(template.id);
                }}
                className="w-full"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Usar este Template
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
