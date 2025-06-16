
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EmployeeTag, EmployeeTagType, RoleRequiredTag } from "@/types/tags";

interface TagsManagementTabProps {
  employeeTags: EmployeeTag[];
  requiredTags: RoleRequiredTag[];
  filteredTagTypes: EmployeeTagType[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  handleAddTag: (tagTypeId: string) => Promise<void>;
  handleRemoveTag: (tagId: string) => Promise<void>;
  addEmployeeTagMutation: any;
  removeEmployeeTagMutation: any;
}

export function TagsManagementTab({
  employeeTags,
  requiredTags,
  filteredTagTypes,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  handleAddTag,
  handleRemoveTag,
  addEmployeeTagMutation,
  removeEmployeeTagMutation
}: TagsManagementTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar tipos de tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            <SelectItem value="skill">Habilidades</SelectItem>
            <SelectItem value="certification">Certificações</SelectItem>
            <SelectItem value="requirement">Obrigatórias</SelectItem>
            <SelectItem value="behavioral">Comportamental</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredTagTypes.map(tagType => {
          const hasTag = employeeTags.some(et => et.tag_type_id === tagType.id);
          const isRequired = requiredTags.some(rt => rt.tag_type_id === tagType.id);
          
          return (
            <Card key={tagType.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium">{tagType.name}</h5>
                    {isRequired && (
                      <Badge variant="destructive">Obrigatória</Badge>
                    )}
                    {tagType.category && (
                      <Badge variant="outline">{tagType.category}</Badge>
                    )}
                  </div>
                  {tagType.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {tagType.description}
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={hasTag ? "destructive" : "default"}
                  onClick={() => {
                    if (hasTag) {
                      const tag = employeeTags.find(et => et.tag_type_id === tagType.id);
                      if (tag) handleRemoveTag(tag.id);
                    } else {
                      handleAddTag(tagType.id);
                    }
                  }}
                  disabled={addEmployeeTagMutation.isPending || removeEmployeeTagMutation.isPending}
                >
                  {hasTag ? "Remover" : "Adicionar"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
