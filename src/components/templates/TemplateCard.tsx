
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, FileText, Target, Heart, RefreshCw, Brain, Activity, Clock, Eye, Zap } from "lucide-react";
import { useState } from "react";
import { FavoriteButton } from "./FavoriteButton";
import { TemplatePreviewDialog } from "./TemplatePreviewDialog";
import { useTemplateAnalytics } from "@/hooks/useTemplateAnalytics";
import { TEMPLATE_CATEGORIES } from "@/utils/templateIntegration";

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
  const [showPreview, setShowPreview] = useState(false);
  const { trackTemplateView, trackTemplateSelect } = useTemplateAnalytics();

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

  const handleCardClick = () => {
    trackTemplateView(template.id, template.typeLabel || 'unknown');
  };

  const handleSelect = () => {
    trackTemplateSelect(template.id, template.typeLabel || 'unknown');
    onSelect(template.id);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPreview(true);
  };

  return (
    <>
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${getTemplateColor(template.id)} h-full`}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {getTemplateIcon(template.id)}
              <Badge variant="outline" className="text-xs">
                {template.typeLabel}
              </Badge>
            </div>
            <FavoriteButton templateId={template.id} />
          </div>
          <CardTitle className="text-lg leading-tight">
            {template.name}
          </CardTitle>
          <CardDescription className="text-sm line-clamp-2">
            {template.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          {/* Categorias */}
          <div>
            <p className="text-xs font-medium mb-2 text-muted-foreground">Categorias Principais:</p>
            <div className="flex flex-wrap gap-1">
              {template.categories.slice(0, 2).map((categoryId: string) => (
                <Badge key={categoryId} variant="secondary" className="text-xs">
                  {TEMPLATE_CATEGORIES[categoryId] || categoryId.replace('_', ' ')}
                </Badge>
              ))}
              {template.categories.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.categories.length - 2} mais
                </Badge>
              )}
            </div>
          </div>

          {/* Métricas */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>{template.estimatedQuestions} perguntas</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{template.estimatedTimeMinutes} min</span>
            </div>
          </div>
          
          {/* Ações */}
          <div className="flex gap-2 pt-2 border-t">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePreview}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visualizar detalhes do template</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect();
                  }}
                  disabled={isSubmitting || isCreatingTemplate}
                  className="flex-1"
                  size="sm"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Usar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Criar questionário com este template</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      <TemplatePreviewDialog
        template={template}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onSelectTemplate={onSelect}
      />
    </>
  );
}
