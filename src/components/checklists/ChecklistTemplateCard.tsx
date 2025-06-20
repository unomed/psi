
import { ClipboardCheck, Clock, Pencil, Eye } from "lucide-react";
import { ChecklistTemplate } from "@/types/checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DiscQuestion, PsicossocialQuestion } from "@/types";
import { isTemplateTypePsicossocial, getTemplateTypeDisplayName } from "@/services/checklist/templateUtils";

interface ChecklistTemplateCardProps {
  template: ChecklistTemplate;
  onEdit: (template: ChecklistTemplate) => void;
  onPreview: (template: ChecklistTemplate) => void;
}

export function ChecklistTemplateCard({ 
  template, 
  onEdit, 
  onPreview 
}: ChecklistTemplateCardProps) {
  const questionsCount = template.questions.length;
  
  // Only calculate DISC factors if it's a DISC type template
  const dFactorCount = template.type === "disc" ? 
    template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "D").length : 0;
  const iFactorCount = template.type === "disc" ? 
    template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "I").length : 0;
  const sFactorCount = template.type === "disc" ? 
    template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "S").length : 0;
  const cFactorCount = template.type === "disc" ? 
    template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "C").length : 0;

  // Para templates psicossociais, contar categorias
  const psicossocialCategories = isTemplateTypePsicossocial(template) ?
    Array.from(
      new Set(
        template.questions
          .filter(q => 'category' in q)
          .map(q => (q as PsicossocialQuestion).category)
      )
    ) : [];

  const getTemplateTypeBadgeVariant = () => {
    if (template.type === "disc") return "default";
    if (isTemplateTypePsicossocial(template)) return "secondary";
    return "outline";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              {template.title}
            </CardTitle>
            <CardDescription className="mt-1">{template.description}</CardDescription>
          </div>
          <Badge variant={getTemplateTypeBadgeVariant()}>
            {getTemplateTypeDisplayName(template)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {template.type === "disc" && (
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-red-50">D: {dFactorCount}</Badge>
            <Badge variant="outline" className="bg-yellow-50">I: {iFactorCount}</Badge>
            <Badge variant="outline" className="bg-green-50">S: {sFactorCount}</Badge>
            <Badge variant="outline" className="bg-blue-50">C: {cFactorCount}</Badge>
          </div>
        )}
        {isTemplateTypePsicossocial(template) && (
          <div className="text-sm">
            <span>Categorias: {psicossocialCategories.length}</span>
            <span className="ml-3">Perguntas: {template.questions.length}</span>
          </div>
        )}
        {template.type === "custom" && !isTemplateTypePsicossocial(template) && (
          <div className="text-sm">
            <span>Perguntas: {template.questions.length}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Criado em {format(template.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(template)}>
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
        <Button size="sm" onClick={() => onPreview(template)}>
          <Eye className="h-4 w-4 mr-2" />
          Visualizar Template
        </Button>
      </CardFooter>
    </Card>
  );
}
