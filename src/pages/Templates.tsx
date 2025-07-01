
import { useState } from "react";
import { ChecklistTemplateWorkflow } from "@/components/checklists/ChecklistTemplateWorkflow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, Target, Brain, Activity, Heart, RefreshCw, Search, Filter } from "lucide-react";
import { STANDARD_QUESTIONNAIRE_TEMPLATES, createStandardTemplate } from "@/data/standardQuestionnaires";
import { useChecklistTemplates } from "@/hooks/checklist/useChecklistTemplates";
import { toast } from "sonner";

export default function Templates() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplateForCreation, setSelectedTemplateForCreation] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
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
    if (templateId.includes("disc")) return "border-orange-200 hover:border-orange-300 hover:shadow-lg";
    if (templateId.includes("srq20") || templateId.includes("phq9") || templateId.includes("gad7")) return "border-purple-200 hover:border-purple-300 hover:shadow-lg";
    if (templateId.includes("mbi") || templateId.includes("audit") || templateId.includes("pss")) return "border-red-200 hover:border-red-300 hover:shadow-lg";
    if (templateId.includes("personal")) return "border-pink-200 hover:border-pink-300 hover:shadow-lg";
    if (templateId.includes("360")) return "border-indigo-200 hover:border-indigo-300 hover:shadow-lg";
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return "border-blue-200 hover:border-blue-300 hover:shadow-lg";
    return "border-gray-200 hover:border-gray-300 hover:shadow-lg";
  };

  const getTypeLabel = (templateId: string) => {
    if (templateId.includes("disc")) return "DISC";
    if (templateId.includes("psicossocial") || templateId.includes("estresse") || templateId.includes("ambiente") || templateId.includes("organizacao")) return "Psicossocial";
    if (templateId.includes("360")) return "360°";
    if (templateId.includes("personal")) return "Vida Pessoal";
    return "Saúde Mental";
  };

  // Função para seleção direta de template
  const handleDirectTemplateSelection = (templateId: string) => {
    const template = createStandardTemplate(templateId);
    if (template) {
      setSelectedTemplateForCreation(template);
      setIsCreateDialogOpen(true);
    } else {
      toast.error("Erro ao carregar template selecionado");
    }
  };

  // Função para criar questionário do zero
  const handleCreateFromScratch = () => {
    setSelectedTemplateForCreation(null);
    setIsCreateDialogOpen(true);
  };

  const handleSubmitTemplate = async (templateData: any) => {
    const success = await handleCreateTemplate(templateData);
    if (success) {
      setIsCreateDialogOpen(false);
      setSelectedTemplateForCreation(null);
      toast.success("Template criado com sucesso!");
    }
  };

  const handleClose = () => {
    setIsCreateDialogOpen(false);
    setSelectedTemplateForCreation(null);
  };

  // Filtrar templates baseado na busca e tipo
  const filteredTemplates = STANDARD_QUESTIONNAIRE_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || getTypeLabel(template.id).toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  // Obter tipos únicos para filtro
  const uniqueTypes = ["all", ...Array.from(new Set(STANDARD_QUESTIONNAIRE_TEMPLATES.map(t => getTypeLabel(t.id))))];

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
          onClick={handleCreateFromScratch}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Criar do Zero
        </Button>
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
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "Todos os tipos" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resultados da busca */}
      {searchTerm && (
        <div className="text-sm text-muted-foreground">
          {filteredTemplates.length} template(s) encontrado(s) para "{searchTerm}"
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`transition-all duration-200 cursor-pointer transform hover:scale-105 ${getTemplateColor(template.id)}`}
            onClick={() => handleDirectTemplateSelection(template.id)}
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
                
                <div className="pt-2 border-t">
                  <Button 
                    className="w-full"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectTemplateSelection(template.id);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Usar Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vazio quando não há resultados */}
      {filteredTemplates.length === 0 && (
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
        onClose={handleClose}
        onSubmit={handleSubmitTemplate}
        existingTemplate={selectedTemplateForCreation}
        isEditing={false}
      />
    </div>
  );
}
