import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Tags, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { EmployeeTagType, RoleRequiredTag } from "@/types/tags";

interface RequiredTagsSectionProps {
  roleId?: string;
  onRequiredTagsChange?: (tags: RoleRequiredTag[]) => void;
}

export function RequiredTagsSection({ roleId, onRequiredTagsChange }: RequiredTagsSectionProps) {
  const queryClient = useQueryClient();
  const [selectedTagTypeId, setSelectedTagTypeId] = useState<string>("");

  // Buscar tipos de tags disponíveis
  const { data: tagTypes = [], isLoading: isLoadingTagTypes } = useQuery({
    queryKey: ['employee-tag-types'],
    queryFn: async (): Promise<EmployeeTagType[]> => {
      const { data, error } = await supabase
        .from('employee_tag_types')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  // Buscar tags obrigatórias atuais da função
  const { data: requiredTags = [], isLoading: isLoadingRequired } = useQuery({
    queryKey: ['role-required-tags', roleId],
    queryFn: async (): Promise<RoleRequiredTag[]> => {
      if (!roleId) return [];
      
      const { data, error } = await supabase
        .from('role_required_tags')
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .eq('role_id', roleId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!roleId
  });

  // Adicionar tag obrigatória
  const addRequiredTag = useMutation({
    mutationFn: async (tagTypeId: string) => {
      if (!roleId) throw new Error('Role ID is required');
      
      const { data, error } = await supabase
        .from('role_required_tags')
        .insert({
          role_id: roleId,
          tag_type_id: tagTypeId,
          is_mandatory: true
        })
        .select(`
          *,
          tag_type:employee_tag_types(*)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ['role-required-tags'] });
      toast.success('Tag obrigatória adicionada com sucesso');
      setSelectedTagTypeId("");
      
      // Notificar o componente pai sobre a mudança
      const updatedTags = [...requiredTags, newTag];
      onRequiredTagsChange?.(updatedTags);
    },
    onError: (error: any) => {
      console.error("Error adding required tag:", error);
      toast.error(error.message.includes('duplicate') 
        ? 'Esta tag já é obrigatória para esta função' 
        : 'Erro ao adicionar tag obrigatória'
      );
    }
  });

  // Remover tag obrigatória
  const removeRequiredTag = useMutation({
    mutationFn: async (requiredTagId: string) => {
      const { error } = await supabase
        .from('role_required_tags')
        .delete()
        .eq('id', requiredTagId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-required-tags'] });
      toast.success('Tag obrigatória removida com sucesso');
      
      // Notificar o componente pai sobre a mudança
      const updatedTags = requiredTags.filter(tag => tag.id !== arguments[0]);
      onRequiredTagsChange?.(updatedTags);
    },
    onError: (error: any) => {
      console.error("Error removing required tag:", error);
      toast.error('Erro ao remover tag obrigatória');
    }
  });

  const handleAddTag = () => {
    if (!selectedTagTypeId) {
      toast.error('Selecione uma tag para adicionar');
      return;
    }
    
    if (!roleId) {
      toast.error('Salve a função primeiro para adicionar tags obrigatórias');
      return;
    }

    addRequiredTag.mutate(selectedTagTypeId);
  };

  const handleRemoveTag = (requiredTagId: string) => {
    removeRequiredTag.mutate(requiredTagId);
  };

  // Filtrar tags que já são obrigatórias
  const availableTagTypes = tagTypes.filter(
    tagType => !requiredTags.some(required => required.tag_type_id === tagType.id)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5" />
          <CardTitle>Tags Obrigatórias</CardTitle>
        </div>
        <CardDescription>
          Defina quais competências/certificações são obrigatórias para esta função.
          Funcionários sem essas tags receberão alertas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lista de tags obrigatórias atuais */}
        {requiredTags.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tags Obrigatórias Atuais:</Label>
            <div className="flex flex-wrap gap-2">
              {requiredTags.map((requiredTag) => (
                <Badge 
                  key={requiredTag.id} 
                  variant="secondary" 
                  className="flex items-center gap-1 px-3 py-1"
                >
                  <span>{requiredTag.tag_type?.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleRemoveTag(requiredTag.id)}
                    disabled={removeRequiredTag.isPending}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Adicionar nova tag obrigatória */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Adicionar Tag Obrigatória:</Label>
          
          <div className="flex gap-2">
            <Select 
              value={selectedTagTypeId} 
              onValueChange={setSelectedTagTypeId}
              disabled={isLoadingTagTypes || availableTagTypes.length === 0}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione uma tag..." />
              </SelectTrigger>
              <SelectContent>
                {availableTagTypes.map((tagType) => (
                  <SelectItem key={tagType.id} value={tagType.id}>
                    <div className="flex flex-col">
                      <span>{tagType.name}</span>
                      {tagType.description && (
                        <span className="text-xs text-muted-foreground">
                          {tagType.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              type="button"
              onClick={handleAddTag}
              disabled={!selectedTagTypeId || addRequiredTag.isPending || !roleId}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>

          {availableTagTypes.length === 0 && tagTypes.length > 0 && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Todas as tags disponíveis já são obrigatórias para esta função.
            </p>
          )}

          {tagTypes.length === 0 && !isLoadingTagTypes && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Nenhuma tag foi criada ainda. Crie tags na seção de funcionários primeiro.
            </p>
          )}

          {!roleId && (
            <p className="text-sm text-amber-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Salve a função primeiro para adicionar tags obrigatórias.
            </p>
          )}
        </div>

        {/* Informações importantes */}
        <div className="bg-muted p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2">ℹ️ Informações Importantes:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Tags obrigatórias serão validadas quando funcionários forem atribuídos a esta função</li>
            <li>• Funcionários sem tags obrigatórias receberão alertas de conformidade</li>
            <li>• Tags com data de expiração serão monitoradas automaticamente</li>
            <li>• Relatórios de compliance incluirão o status das tags obrigatórias</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}