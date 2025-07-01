
import { ChecklistTemplate } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SelectedTemplateCardProps {
  selectedTemplate: ChecklistTemplate;
}

export function SelectedTemplateCard({ selectedTemplate }: SelectedTemplateCardProps) {
  return (
    <Card className="bg-primary/5 border-primary">
      <CardHeader>
        <CardTitle className="text-lg text-primary">
          Template Selecionado: {selectedTemplate.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {selectedTemplate.description}
        </p>
        <div className="flex gap-4 text-sm">
          <span>Perguntas: {selectedTemplate.questions?.length || 0}</span>
          <span>Tempo: {selectedTemplate.estimatedTimeMinutes} min</span>
          <span>Tipo: {selectedTemplate.type}</span>
          {selectedTemplate.isStandard === false && (
            <span className="text-blue-600 font-medium">Personalizado</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
