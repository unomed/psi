
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useEmployeeTags, useTagTypes } from "@/hooks/useEmployeeTags";

interface CandidateTagsSectionProps {
  employeeId?: string;
  onTagsChange?: (tags: string[]) => void;
  isCandidate: boolean;
}

const BEHAVIORAL_TAGS = [
  { id: 'comprometido', name: 'Comprometido', category: 'comportamental' },
  { id: 'atento', name: 'Atento', category: 'comportamental' },
  { id: 'proativo', name: 'Proativo', category: 'comportamental' },
  { id: 'comunicativo', name: 'Comunicativo', category: 'comportamental' },
  { id: 'lideranca', name: 'Liderança', category: 'comportamental' },
  { id: 'trabalho-equipe', name: 'Trabalho em Equipe', category: 'comportamental' },
  { id: 'criativo', name: 'Criativo', category: 'comportamental' },
  { id: 'organizado', name: 'Organizado', category: 'comportamental' }
];

const TAG_LEVELS = [
  { value: 'baixo', label: 'Baixo', color: 'bg-red-100 text-red-800' },
  { value: 'medio', label: 'Médio', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'alto', label: 'Alto', color: 'bg-green-100 text-green-800' }
];

export function CandidateTagsSection({ employeeId, onTagsChange, isCandidate }: CandidateTagsSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTagType, setSelectedTagType] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("medio");

  const { employeeTags, addEmployeeTag, removeEmployeeTag } = useEmployeeTags(employeeId);
  const { tagTypes } = useTagTypes();

  const handleAddTag = async () => {
    if (!employeeId || !selectedTagType) return;

    try {
      // Buscar a tag pelo ID nos tipos disponíveis
      const targetTagType = tagTypes.find(t => t.id === selectedTagType);
      
      if (!targetTagType) {
        toast.error('Tipo de tag não encontrado. Atualize a página e tente novamente.');
        return;
      }
      
      await addEmployeeTag.mutateAsync({
        employeeId,
        tagTypeId: targetTagType.id,
        notes: `Nível: ${selectedLevel}`
      });
      
      setIsAddDialogOpen(false);
      setSelectedTagType("");
      setSelectedLevel("medio");
      
      if (onTagsChange) {
        const newTags = [...employeeTags.map(t => t.tag_type?.name || ''), targetTagType.name];
        onTagsChange(newTags);
      }
    } catch (error) {
      console.error("Error adding behavioral tag:", error);
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

  if (!isCandidate) return null;

  return (
    <div className="space-y-4 border-2 border-dashed border-orange-300 p-4 rounded-md bg-orange-50">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-lg font-semibold text-orange-800">Tags Comportamentais (Candidato)</Label>
          <p className="text-sm text-orange-600 mt-1">Avalie as competências comportamentais do candidato</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Tag Comportamental</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="behavioral-tag">Competência Comportamental</Label>
                <Select value={selectedTagType} onValueChange={setSelectedTagType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma competência" />
                  </SelectTrigger>
                  <SelectContent>
                    {tagTypes
                      .filter(tag => tag.category === 'comportamental' || tag.category === 'skill')
                      .map(tag => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    {tagTypes.filter(tag => tag.category === 'comportamental' || tag.category === 'skill').length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground">
                        Nenhuma tag comportamental disponível. Use o gerenciamento de tags para criar novas.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Nível de Competência</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAG_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${level.color.split(' ')[0]}`} />
                          {level.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  disabled={!selectedTagType || addEmployeeTag.isPending}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tags Atuais */}
      <div className="space-y-2">
        <Label>Tags Comportamentais Atuais</Label>
        <div className="flex flex-wrap gap-2">
          {employeeTags.map(tag => {
            const level = tag.notes?.includes('Nível:') ? 
              tag.notes.split('Nível: ')[1] : 'medio';
            const levelConfig = TAG_LEVELS.find(l => l.value === level) || TAG_LEVELS[1];
            
            return (
              <Badge 
                key={tag.id} 
                className={`${levelConfig.color} flex items-center gap-1`}
              >
                {tag.tag_type?.name}
                <span className="text-xs">({levelConfig.label})</span>
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
            <div className="text-center p-4 border-2 border-dashed border-orange-200 rounded-lg w-full">
              <p className="text-orange-600 text-sm">
                Nenhuma tag comportamental cadastrada ainda
              </p>
              <p className="text-orange-500 text-xs mt-1">
                Clique em "Adicionar Tag" para avaliar as competências do candidato
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
