
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, FileText, Users, CheckCircle, Target, Brain, Activity, Heart, RefreshCw } from "lucide-react";
import { useTemplateAnalytics } from "@/hooks/useTemplateAnalytics";
import { FavoriteButton } from "./FavoriteButton";
import { TEMPLATE_CATEGORIES } from "@/utils/templateIntegration";

interface TemplatePreviewDialogProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplatePreviewDialog({ 
  template, 
  isOpen, 
  onClose, 
  onSelectTemplate 
}: TemplatePreviewDialogProps) {
  const { trackTemplatePreview } = useTemplateAnalytics();

  if (!template) return null;

  const handlePreview = () => {
    trackTemplatePreview(template.id, template.typeLabel || 'unknown');
  };

  const handleSelect = () => {
    onSelectTemplate(template.id);
    onClose();
  };

  const getTemplateIcon = (templateId: string) => {
    if (templateId.includes("disc")) return <Target className="h-6 w-6 text-orange-600" />;
    if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) return <Brain className="h-6 w-6 text-purple-600" />;
    if (templateId.includes("mbi") || templateId.includes("audit") || templateId.includes("pss")) return <Activity className="h-6 w-6 text-red-600" />;
    if (templateId.includes("personal")) return <Heart className="h-6 w-6 text-pink-600" />;
    if (templateId.includes("360")) return <RefreshCw className="h-6 w-6 text-indigo-600" />;
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return <Activity className="h-6 w-6 text-blue-600" />;
    return <FileText className="h-6 w-6 text-gray-600" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]" onOpenAutoFocus={handlePreview}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTemplateIcon(template.id)}
              <div>
                <DialogTitle className="text-xl">{template.name}</DialogTitle>
                <Badge variant="outline" className="mt-1">
                  {template.typeLabel}
                </Badge>
              </div>
            </div>
            <FavoriteButton templateId={template.id} size="default" />
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6">
            {/* Descrição */}
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground">{template.description}</p>
            </div>

            <Separator />

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <FileText className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <div className="text-lg font-semibold">{template.estimatedQuestions}</div>
                <div className="text-xs text-muted-foreground">Perguntas</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Clock className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <div className="text-lg font-semibold">{template.estimatedTimeMinutes}</div>
                <div className="text-xs text-muted-foreground">Minutos</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Users className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                <div className="text-lg font-semibold">{template.categories.length}</div>
                <div className="text-xs text-muted-foreground">Categorias</div>
              </div>
            </div>

            <Separator />

            {/* Categorias/Fatores */}
            <div>
              <h3 className="font-semibold mb-3">Categorias e Fatores Avaliados</h3>
              <div className="grid grid-cols-2 gap-2">
                {template.categories.map((categoryId: string, index: number) => (
                  <div key={categoryId} className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {TEMPLATE_CATEGORIES[categoryId] || categoryId.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Informações adicionais */}
            <div>
              <h3 className="font-semibold mb-3">Sobre este Template</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Template validado cientificamente</p>
                <p>• Adequado para avaliações organizacionais</p>
                <p>• Relatórios automáticos incluídos</p>
                <p>• Suporte completo para análise de dados</p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={handleSelect} className="bg-primary">
            <CheckCircle className="h-4 w-4 mr-2" />
            Usar Este Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
