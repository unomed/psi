
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles } from "lucide-react";
import { useTemplateFavorites } from "@/hooks/useTemplateFavorites";
import { STANDARD_QUESTIONNAIRE_TEMPLATES } from "@/data/standardQuestionnaires";
import { TemplateCard } from "./TemplateCard";

interface FavoriteTemplatesSectionProps {
  onTemplateSelect: (templateId: string) => void;
  isSubmitting: boolean;
  isCreatingTemplate: boolean;
}

export function FavoriteTemplatesSection({ 
  onTemplateSelect, 
  isSubmitting, 
  isCreatingTemplate 
}: FavoriteTemplatesSectionProps) {
  const { favorites } = useTemplateFavorites();

  const favoriteTemplates = STANDARD_QUESTIONNAIRE_TEMPLATES
    .filter(template => favorites.includes(template.id))
    .map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      categories: template.categories || ['Geral'],
      estimatedQuestions: template.questions.length,
      estimatedTimeMinutes: template.estimatedTimeMinutes,
      typeLabel: getTypeLabel(template.id)
    }));

  function getTypeLabel(templateId: string): string {
    if (templateId.includes("disc")) return "DISC";
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return "Psicossocial";
    if (templateId.includes("360")) return "360°";
    if (templateId.includes("personal")) return "Vida Pessoal";
    return "Saúde Mental";
  }

  if (favorites.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <CardTitle className="text-lg">Templates Favoritos</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Sparkles className="h-12 w-12 text-pink-400 mx-auto mb-3" />
            <p className="text-muted-foreground">
              Você ainda não tem templates favoritos. 
              <br />
              Clique no ❤️ nos templates que mais usa para facilitar o acesso!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-pink-600" />
        <h2 className="text-xl font-semibold">Seus Templates Favoritos</h2>
        <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
          {favorites.length} favorito{favorites.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favoriteTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onTemplateSelect}
            isSubmitting={isSubmitting}
            isCreatingTemplate={isCreatingTemplate}
          />
        ))}
      </div>
    </div>
  );
}
