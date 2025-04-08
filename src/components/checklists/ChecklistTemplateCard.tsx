
import { ClipboardCheck, Clock, Pencil } from "lucide-react";
import { ChecklistTemplate } from "@/types/checklist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChecklistTemplateCardProps {
  template: ChecklistTemplate;
  onEdit: (template: ChecklistTemplate) => void;
  onTakeAssessment: (template: ChecklistTemplate) => void;
}

export function ChecklistTemplateCard({ 
  template, 
  onEdit, 
  onTakeAssessment 
}: ChecklistTemplateCardProps) {
  const questionsCount = template.questions.length;
  const dFactorCount = template.questions.filter(q => q.targetFactor === "D").length;
  const iFactorCount = template.questions.filter(q => q.targetFactor === "I").length;
  const sFactorCount = template.questions.filter(q => q.targetFactor === "S").length;
  const cFactorCount = template.questions.filter(q => q.targetFactor === "C").length;

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
          <Badge variant={template.type === "disc" ? "default" : "outline"}>
            {template.type === "disc" ? "DISC" : "Personalizado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-red-50">D: {dFactorCount}</Badge>
          <Badge variant="outline" className="bg-yellow-50">I: {iFactorCount}</Badge>
          <Badge variant="outline" className="bg-green-50">S: {sFactorCount}</Badge>
          <Badge variant="outline" className="bg-blue-50">C: {cFactorCount}</Badge>
        </div>
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
        <Button size="sm" onClick={() => onTakeAssessment(template)}>
          Iniciar Avaliação
        </Button>
      </CardFooter>
    </Card>
  );
}
