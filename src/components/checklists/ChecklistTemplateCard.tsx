
import { ClipboardCheck, Clock, Pencil, Eye } from "lucide-react";
import { ChecklistTemplate } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  
  const getTemplateTypeBadgeVariant = () => {
    if (template.type === "disc") return "default";
    if (template.type === "psicossocial") return "secondary";
    return "outline";
  };

  const getTemplateTypeDisplayName = () => {
    switch (template.type) {
      case "disc":
        return "DISC";
      case "psicossocial":
        return "Psicossocial";
      case "evaluation_360":
        return "Avaliação 360°";
      default:
        return "Personalizado";
    }
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
            {getTemplateTypeDisplayName()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <span>Perguntas: {questionsCount}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Criado em {format(template.createdAt || new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
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
