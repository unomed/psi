
import { useState } from "react";
import { ChecklistTemplateWorkflow } from "@/components/checklists/ChecklistTemplateWorkflow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Target, Brain, Activity, Heart, RefreshCw } from "lucide-react";
import { STANDARD_QUESTIONNAIRE_TEMPLATES } from "@/data/standardQuestionnaires";
import { useChecklistTemplates } from "@/hooks/checklist/useChecklistTemplates";
import { toast } from "sonner";

export default function Templates() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { handleCreateTemplate } = useChecklistTemplates();

  const getTemplateIcon = (templateId: string) => {
    if (templateId.includes("disc")) return <Target className="h-6 w-6 text-orange-600" />;
    if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) return <Brain className="h-6 w-6 text-purple-600" />;
    if (templateId.includes("mbi") || templateId.includes("audit") || templateId.includes("pss")) return <Activity className="h-6 w-6 text-red-600" />;
    if (templateId.includes("personal")) return <Heart className="h-6 w-6 text-pink-600" />;
    if (templateId.includes("360")) return <RefreshCw className="h-6 w-6 text-indigo-600" />;
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return <Activity className="h-6 w-6 text-blue-600" />;
    return <FileText className="h-6 w-6 text-gray-600" />;
  };

  const getTemplateColor = (templateId: string) => {
    if (templateId.includes("disc")) return "border-orange-200 hover:border-orange-300";
    if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) return "border-purple-200 hover:border-purple-300";
    if (templateId.includes("mbi") || templateId.includes("audit") || templateId.includes("pss")) return "border-red-200 hover:border-red-300";
    if (templateId.includes("personal")) return "border-pink-200 hover:border-pink-300";
    if (templateId.includes("360")) return "border-indigo-200 hover:border-indigo-300";
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return "border-blue-200 hover:border-blue-300";
    return "border-gray-200 hover:border-gray-300";
  };

  const getTypeLabel = (templateId: string) => {
    if (templateId.includes("disc")) return "DISC";
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return "Psicossocial";
    if (templateId.includes("360")) return "360°";
    if (templateId.includes("personal")) return "Vida Pessoal";
    return "Saúde Mental";
  };

  const handleSubmitTemplate = async (templateData: any) => {
    const success = await handleCreateTemplate(templateData);
    if (success) {
      setIsCreateDialogOpen(false);
      toast.success("Template criado com sucesso!");
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates de Questionários</h1>
          <p className="text-muted-foreground mt-2">
            Explore e utilize templates pré-definidos ou crie seus próprios questionários personalizados
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Criar Novo Questionário
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {STANDARD_QUESTIONNAIRE_TEMPLATES.map((template) => (
          <Card 
            key={template.id}
            className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${getTemplateColor(template.id)}`}
            onClick={() => setIsCreateDialogOpen(true)}
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
                  <p className="text-sm font-medium mb-2">Categorias/Fatores:</p>
                  <div className="flex flex-wrap gap-1">
                    {(template.categories || ['Geral']).slice(0, 2).map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category.replace('_', ' ')}
                      </Badge>
                    ))}
                    {(template.categories || []).length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{(template.categories || []).length - 2} mais
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Perguntas: {template.questions.length}</span>
                  <span>~{template.estimatedTimeMinutes} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Dialog */}
      <ChecklistTemplateWorkflow
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleSubmitTemplate}
      />
    </div>
  );
}
