
import { ChecklistTemplate } from "@/types";
import { TemplateSelectionHeader } from "./template-selection/TemplateSelectionHeader";
import { SelectedTemplateCard } from "./template-selection/SelectedTemplateCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TemplateSelectionForSchedulingProps {
  onTemplateSelect: (template: ChecklistTemplate) => void;
  onBack: () => void;
  selectedTemplate: ChecklistTemplate | null;
}

export function TemplateSelectionForScheduling({
  onTemplateSelect,
  onBack,
  selectedTemplate
}: TemplateSelectionForSchedulingProps) {
  const { userRole, userCompanies } = useAuth();
  const [selectedCompanyId] = useState<string | null>(() => {
    if (userRole !== 'superadmin' && userCompanies.length > 0) {
      return userCompanies[0].companyId;
    }
    return null;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Buscar APENAS templates criados e salvos no banco (mesma consulta que /templates)
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates-for-scheduling', selectedCompanyId],
    queryFn: async () => {
      let query = supabase
        .from('checklist_templates')
        .select(`
          *,
          questions(id, question_text, order_number)
        `)
        .eq('is_active', true);

      if (selectedCompanyId) {
        query = query.or(`company_id.eq.${selectedCompanyId},company_id.is.null`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).filter(template => template.id && template.title);
    },
    enabled: !!selectedCompanyId || userRole === 'superadmin'
  });

  const handleTemplateSelect = (template: any) => {
    const checklistTemplate: ChecklistTemplate = {
      id: template.id,
      title: template.title,
      description: template.description || '',
      type: template.type,
      questions: [] as any[],
      createdAt: new Date(template.created_at),
      scaleType: template.scale_type as any,
      isStandard: template.is_standard,
      estimatedTimeMinutes: template.estimated_time_minutes,
      isActive: template.is_active,
      interpretationGuide: template.interpretation_guide,
      cutoffScores: template.cutoff_scores,
      maxScore: template.max_score,
      version: template.version,
      // Database compatibility fields
      estimated_time_minutes: template.estimated_time_minutes,
      is_standard: template.is_standard,
      scale_type: template.scale_type,
      created_at: template.created_at,
      is_active: template.is_active,
      cutoff_scores: template.cutoff_scores,
      max_score: template.max_score,
      interpretation_guide: template.interpretation_guide
    };
    
    onTemplateSelect(checklistTemplate);
  };

  const getTemplateTypeLabel = (type: string) => {
    switch (type) {
      case 'disc': return 'DISC';
      case 'psicossocial': return 'Psicossocial';
      case 'custom': return 'Personalizado';
      default: return type.toUpperCase();
    }
  };

  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case 'disc': return 'bg-blue-100 text-blue-800';
      case 'psicossocial': return 'bg-red-100 text-red-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtrar templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || template.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <TemplateSelectionHeader onBack={onBack} />

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Buscar templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="disc">DISC</SelectItem>
            <SelectItem value="psicossocial">Psicossocial</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Templates Disponíveis ({filteredTemplates.length})
          </h3>
          {templates.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhum template encontrado. Crie um template em <a href="/templates" className="text-primary underline">/templates</a> primeiro.
            </p>
          )}
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={getTemplateTypeColor(template.type)}>
                      {getTemplateTypeLabel(template.type)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {template.questions?.length || 0} perguntas
                    </div>
                  </div>
                  
                  <h4 className="font-semibold mb-2 line-clamp-2">{template.title}</h4>
                  
                  {template.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Usar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== 'all' 
                ? 'Nenhum template encontrado com os filtros aplicados.' 
                : 'Nenhum template disponível para agendamento.'
              }
            </p>
            {templates.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Crie um template em <a href="/templates" className="text-primary underline">/templates</a> primeiro.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Template Selecionado */}
      {selectedTemplate && (
        <SelectedTemplateCard selectedTemplate={selectedTemplate} />
      )}
    </div>
  );
}
