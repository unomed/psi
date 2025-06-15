
import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useEmployeeTags, useTagTypes } from "@/hooks/useEmployeeTags";
import { useRoleRequiredTags } from "@/hooks/useRoleRequiredTags";
import { CandidateTagsSection } from "./CandidateTagsSection";

interface EmployeeTagsSelectorProps {
  employeeId?: string;
  selectedRole: string | null;
  employeeType?: string;
  onTagsChange?: (tags: string[]) => void;
}

export function EmployeeTagsSelector({ employeeId, selectedRole, employeeType, onTagsChange }: EmployeeTagsSelectorProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTagType, setSelectedTagType] = useState<string>("");
  const [acquiredDate, setAcquiredDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const { employeeTags, addEmployeeTag, removeEmployeeTag } = useEmployeeTags(employeeId);
  const { tagTypes } = useTagTypes();
  const { requiredTags } = useRoleRequiredTags(selectedRole);

  const isCandidate = employeeType === 'candidato';

  const handleAddTag = async () => {
    if (!employeeId || !selectedTagType) return;

    try {
      await addEmployeeTag.mutateAsync({
        employeeId,
        tagTypeId: selectedTagType,
        acquiredDate: acquiredDate || undefined,
        notes: notes || undefined
      });
      
      setIsAddDialogOpen(false);
      setSelectedTagType("");
      setAcquiredDate("");
      setNotes("");
      
      if (onTagsChange) {
        const newTags = [...employeeTags.map(t => t.tag_type?.name || ''), 
                       tagTypes.find(t => t.id === selectedTagType)?.name || ''];
        onTagsChange(newTags);
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      await removeEmployeeTag.mutateAsync(tagId);
      
      if (onTagsChange) {
        const newTags = employeeTags
          .filter(t => t.id !== tagId)
          .map(t => t.tag_type?.name || '');
        onTagsChange(newTags);
      }
    } catch (error) {
      console.error("Error removing tag:", error);
    }
  };

  const currentTagIds = employeeTags.map(t => t.tag_type_id);
  const availableTagTypes = tagTypes.filter(t => !currentTagIds.includes(t.id));
  
  const missingRequiredTags = requiredTags.filter(
    rt => !currentTagIds.includes(rt.tag_type_id)
  );

  return (
    <div className="space-y-6">
      {/* Seção específica para candidatos */}
      <CandidateTagsSection 
        employeeId={employeeId}
        onTagsChange={onTagsChange}
        isCandidate={isCandidate}
      />

      {/* Seção de competências técnicas (para funcionários) */}
      {!isCandidate && (
        <div className="space-y-4 border p-4 rounded-md">
          <div className="flex items-center justify-between">
            <FormLabel>Competências/Tags Técnicas</FormLabel>
            {employeeId && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Tag</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tag-type">Tipo de Tag</Label>
                      <Select value={selectedTagType} onValueChange={setSelectedTagType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma tag" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTagTypes.map(tagType => (
                            <SelectItem key={tagType.id} value={tagType.id}>
                              {tagType.name}
                              {tagType.category && (
                                <span className="text-muted-foreground ml-2">
                                  ({tagType.category})
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="acquired-date">Data de Aquisição (Opcional)</Label>
                      <Input
                        id="acquired-date"
                        type="date"
                        value={acquiredDate}
                        onChange={(e) => setAcquiredDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Observações (Opcional)</Label>
                      <Input
                        id="notes"
                        placeholder="Observações sobre esta competência"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleAddTag}
                        disabled={!selectedTagType || addEmployeeTag.isPending}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Tags Obrigatórias em Falta */}
          {missingRequiredTags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-red-600">Tags Obrigatórias em Falta</Label>
              <div className="flex flex-wrap gap-2">
                {missingRequiredTags.map(tag => (
                  <Badge key={tag.id} variant="destructive">
                    {tag.tag_type?.name} (obrigatória)
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags Atuais */}
          <div className="space-y-2">
            <Label>Tags Atuais</Label>
            <div className="flex flex-wrap gap-2">
              {employeeTags.map(tag => {
                const isRequired = requiredTags.some(rt => rt.tag_type_id === tag.tag_type_id);
                return (
                  <Badge 
                    key={tag.id} 
                    variant={isRequired ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {tag.tag_type?.name}
                    {isRequired && " ✓"}
                    {employeeId && (
                      <X 
                        className="h-3 w-3 cursor-pointer ml-1" 
                        onClick={() => handleRemoveTag(tag.id)}
                      />
                    )}
                  </Badge>
                );
              })}
              {employeeTags.length === 0 && (
                <span className="text-muted-foreground text-sm">
                  Nenhuma tag cadastrada
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
