
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, Filter, Plus, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CandidateEvaluationTemplatesProps {
  selectedCompany: string | null;
}

export function CandidateEvaluationTemplates({ selectedCompany }: CandidateEvaluationTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['candidate-templates', selectedCompany],
    queryFn: async () => {
      let query = supabase
        .from('checklist_templates')
        .select('*')
        .eq('is_active', true);

      if (selectedCompany) {
        query = query.or(`company_id.eq.${selectedCompany},company_id.is.null`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompany
  });

  // Filtrar templates adequados para candidatos
  const candidateTemplates = templates.filter(template => {
    const isCandidateRelevant = 
      template.type === 'disc' || 
      template.type === 'psicossocial' ||
      template.title.toLowerCase().includes('candidato') ||
      template.title.toLowerCase().includes('entrevista') ||
      template.description?.toLowerCase().includes('seleção');

    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || template.type === typeFilter;

    return isCandidateRelevant && matchesSearch && matchesType;
  });

  const templateCategories = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'disc', label: 'DISC' },
    { value: 'psicossocial', label: 'Psicossocial' },
    { value: 'custom', label: 'Personalizado' }
  ];

  const getTemplateTypeLabel = (type: string) => {
    switch (type) {
      case 'disc': return 'DISC';
      case 'psicossocial': return 'Psicossocial';
      case 'custom': return 'Personalizado';
      default: return type;
    }
  };

  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case 'disc': return 'bg-blue-100 text-blue-800';
      case 'psicossocial': return 'bg-green-100 text-green-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedCompany) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Selecione uma empresa para ver os templates de avaliação</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Templates de Avaliação para Candidatos</h2>
          <p className="text-muted-foreground">
            Templates específicos para avaliação e seleção de candidatos
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Template
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {templateCategories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">Carregando templates...</p>
          </div>
        ) : candidateTemplates.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum template encontrado</p>
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Crie templates específicos para avaliação de candidatos'
              }
            </p>
          </div>
        ) : (
          candidateTemplates.map(template => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">
                    {template.title}
                  </CardTitle>
                  <Badge className={getTemplateTypeColor(template.type)}>
                    {getTemplateTypeLabel(template.type)}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {template.description || 'Sem descrição disponível'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tempo estimado:</span>
                    <span>{template.estimated_time_minutes || 30} min</span>
                  </div>
                  
                  {template.company_id ? (
                    <Badge variant="outline" className="text-xs">
                      Template da empresa
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Template padrão
                    </Badge>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-2 h-3 w-3" />
                      Visualizar
                    </Button>
                    <Button size="sm" className="flex-1">
                      <FileText className="mr-2 h-3 w-3" />
                      Usar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas dos Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {candidateTemplates.filter(t => t.type === 'disc').length}
              </p>
              <p className="text-sm text-muted-foreground">Templates DISC</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {candidateTemplates.filter(t => t.type === 'psicossocial').length}
              </p>
              <p className="text-sm text-muted-foreground">Templates Psicossociais</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {candidateTemplates.filter(t => t.type === 'custom').length}
              </p>
              <p className="text-sm text-muted-foreground">Templates Personalizados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {candidateTemplates.filter(t => !t.company_id).length}
              </p>
              <p className="text-sm text-muted-foreground">Templates Padrão</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
