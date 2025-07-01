
import { useState } from "react";
import { ChecklistTemplateWorkflow } from "@/components/checklists/ChecklistTemplateWorkflow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText, Target, Brain, Activity, Heart, RefreshCw, Search, Filter, Info, CheckCircle, AlertCircle } from "lucide-react";
import { useTemplatesPage } from "@/hooks/useTemplatesPage";
import { useChecklistTemplates } from "@/hooks/checklist/useChecklistTemplates";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Templates() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    selectedTemplate,
    isCreateDialogOpen,
    filteredTemplates,
    availableTypes,
    handleDirectTemplateSelection,
    handleCreateFromScratch,
    handleCloseDialog,
    clearFilters,
    hasActiveFilters
  } = useTemplatesPage();

  const { handleCreateTemplate, isLoading: isCreatingTemplate } = useChecklistTemplates();

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

  const validateTemplateSelection = (templateId: string): boolean => {
    setValidationErrors({});
    
    const template = filteredTemplates.find(t => t.id === templateId);
    if (!template) {
      setValidationErrors({ template: "Template não encontrado" });
      return false;
    }

    if (!template.questions || template.questions.length === 0) {
      setValidationErrors({ template: "Template não possui perguntas válidas" });
      return false;
    }

    return true;
  };

  const handleTemplateSelectionWithValidation = (templateId: string) => {
    if (!validateTemplateSelection(templateId)) {
      toast.error("Erro na validação do template");
      return;
    }

    handleDirectTemplateSelection(templateId);
  };

  const handleSubmitTemplate = async (templateData: any) => {
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Validação dos dados do template
      if (!templateData.title || templateData.title.trim() === "") {
        setValidationErrors({ title: "Título é obrigatório" });
        return;
      }

      if (!templateData.questions || templateData.questions.length === 0) {
        setValidationErrors({ questions: "Template deve ter pelo menos uma pergunta" });
        return;
      }

      console.log("🔄 Iniciando criação de template:", templateData.title);
      
      const success = await handleCreateTemplate(templateData);
      
      if (success) {
        handleCloseDialog();
        toast.success("✅ Template criado com sucesso!", {
          description: `O template "${templateData.title}" está pronto para uso.`
        });
        console.log("✅ Template criado com sucesso:", templateData.title);
      } else {
        throw new Error("Falha na criação do template");
      }
    } catch (error) {
      console.error("❌ Erro ao criar template:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error("❌ Erro ao criar template", {
        description: errorMessage
      });
      setValidationErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading skeleton para quando templates estão sendo carregados
  const TemplateCardSkeleton = () => (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <Skeleton className="h-4 w-1/2 mb-2" />
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Templates de Questionários</h1>
            <p className="text-muted-foreground mt-2">
              Explore e utilize templates pré-definidos ou crie seus próprios questionários personalizados
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleCreateFromScratch}
                className="flex items-center gap-2"
                disabled={isSubmitting || isCreatingTemplate}
              >
                <Plus className="h-4 w-4" />
                Criar do Zero
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Criar um questionário personalizado sem usar templates pré-definidos</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "Todos os tipos" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {hasActiveFilters && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Limpar Filtros
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remover todos os filtros ativos</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Resultados da busca */}
        {searchTerm && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4" />
            {filteredTemplates.length} template(s) encontrado(s) para "{searchTerm}"
          </div>
        )}

        {/* Erros de validação globais */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            <AlertCircle className="h-4 w-4" />
            <span>Erro de validação: {Object.values(validationErrors)[0]}</span>
          </div>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isCreatingTemplate ? (
            // Mostrar skeletons durante carregamento
            Array.from({ length: 8 }).map((_, index) => (
              <TemplateCardSkeleton key={index} />
            ))
          ) : (
            filteredTemplates.map((template) => (
              <Card 
                key={template.id}
                className={getTemplateColor(template.id)}
                onClick={() => handleTemplateSelectionWithValidation(template.id)}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelectionWithValidation(template.id);
                        }}
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
            ))
          )}
        </div>

        {/* Estado vazio quando não há resultados */}
        {filteredTemplates.length === 0 && !isCreatingTemplate && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum template encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros de busca ou criar um novo questionário do zero.
            </p>
            <Button onClick={handleCreateFromScratch}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Novo Questionário
            </Button>
          </div>
        )}

        {/* Dialog Workflow */}
        <ChecklistTemplateWorkflow
          isOpen={isCreateDialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitTemplate}
          existingTemplate={selectedTemplate}
          isEditing={false}
        />
      </div>
    </TooltipProvider>
  );
}
