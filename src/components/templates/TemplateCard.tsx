
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Info, FileText, Target, Brain, Activity, Heart, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: any;
  onSelect: (templateId: string) => void;
  isSubmitting: boolean;
  isCreatingTemplate: boolean;
}

export function TemplateCard({ 
  template, 
  onSelect, 
  isSubmitting, 
  isCreatingTemplate 
}: TemplateCardProps) {
  const getTemplateIcon = (templateId: string) => {
    const iconProps = { className: "h-6 w-6" };
    if (templateId.includes("disc")) return <Target {...iconProps} className="h-6 w-6 text-orange-600" />;
    if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) 
      return <Brain {...iconProps} className="h-6 w-6 text-purple-600" />;
    if (templateId.includes("mbi") || templateId.includes("audit") || templateId.includes("pss")) 
      return <Activity {...iconProps} className="h-6 w-6 text-red-600" />;
    if (templateId.includes("personal")) return <Heart {...iconProps} className="h-6 w-6 text-pink-600" />;
    if (templateId.includes("360")) return <RefreshCw {...iconProps} className="h-6 w-6 text-indigo-600" />;
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || 
        templateId.includes("ambiente") || templateId.includes("organizacao")) 
      return <Activity {...iconProps} className="h-6 w-6 text-blue-600" />;
    return <FileText {...iconProps} className="h-6 w-6 text-gray-600" />;
  };

  const getTemplateColor = (templateId: string) => {
    const baseClasses = "transition-all duration-200 cursor-pointer transform hover:scale-105";
    if (templateId.includes("disc")) return cn(baseClasses, "border-orange-200 hover:border-orange-300 hover:shadow-lg");
    if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) 
      return cn(baseClasses, "border-purple-200 hover:border-purple-300 hover:shadow-lg");
    if (templateId.includes("mbi") || templateId.includes("audit") || templateId.includes("pss")) 
      return cn(baseClasses, "border-red-200 hover:border-red-300 hover:shadow-lg");
    if (templateId.includes("personal")) return cn(baseClasses, "border-pink-200 hover:border-pink-300 hover:shadow-lg");
    if (templateId.includes("360")) return cn(baseClasses, "border-indigo-200 hover:border-indigo-300 hover:shadow-lg");
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || 
        templateId.includes("ambiente") || templateId.includes("organizacao")) 
      return cn(baseClasses, "border-blue-200 hover:border-blue-300 hover:shadow-lg");
    return cn(baseClasses, "border-gray-200 hover:border-gray-300 hover:shadow-lg");
  };

  const getTypeLabel = (templateId: string) => {
    if (templateId.includes("disc")) return "DISC";
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || 
        templateId.includes("ambiente") || templateId.includes("organizacao")) return "Psicossocial";
    if (templateId.includes("360")) return "360°";
    if (templateId.includes("personal")) return "Vida Pessoal";
    return "Saúde Mental";
  };

  const getTemplateDescription = (templateId: string) => {
    if (templateId.includes("disc")) return "Avaliação de perfil comportamental para identificar estilos de comunicação e trabalho";
    if (templateId.includes("psicossocial")) return "Avaliação de fatores psicossociais do trabalho conforme diretrizes do MTE";
    if (templateId.includes("360")) return "Avaliação 360° para feedback multidirecional de desempenho";
    if (templateId.includes("personal")) return "Questionário sobre aspectos pessoais que podem impactar o trabalho";
    return "Instrumentos validados para avaliação de saúde mental e bem-estar";
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(template.id);
  };

  return (
    <Card 
      className={getTemplateColor(template.id)}
      onClick={handleSelect}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          {getTemplateIcon(template.id)}
          <Badge variant="outline" className="text-xs">
            {getTypeLabel(template.id)}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight">
          {template.name}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-3">
          {template.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-1 mb-2">
              <p className="text-sm font-medium">Categorias/Fatores:</p>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{getTemplateDescription(template.id)}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-wrap gap-1">
              {(template.categories || ['Geral']).slice(0, 2).map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category.replace('_', ' ')}
                </Badge>
              ))}
              {(template.categories || []).length > 2 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="text-xs cursor-help">
                      +{(template.categories || []).length - 2} mais
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      <p className="font-medium mb-1">Todas as categorias:</p>
                      <div className="flex flex-wrap gap-1">
                        {(template.categories || []).map(cat => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Perguntas: {template.questions.length}</span>
            <span>~{template.estimatedTimeMinutes} min</span>
          </div>
          
          <div className="pt-2 border-t">
            <Button 
              className="w-full"
              size="sm"
              disabled={isSubmitting || isCreatingTemplate}
              onClick={handleSelect}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Criando...
                </div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Usar Template
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
