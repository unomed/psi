
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useEmployeeTags } from "@/hooks/useEmployeeTags";
import type { EmployeeTagType } from "@/types/tags";
import { toast } from "sonner";

interface AddTagDialogProps {
  employeeId?: string;
  availableTagTypes: EmployeeTagType[];
  onTagAdded?: () => void;
}

export function AddTagDialog({ employeeId, availableTagTypes, onTagAdded }: AddTagDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTagType, setSelectedTagType] = useState<string>("");
  const [acquiredDate, setAcquiredDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const { addEmployeeTag } = useEmployeeTags(employeeId);

  const handleAddTag = async () => {
    if (!employeeId || !selectedTagType) {
      console.warn("[AddTagDialog] Dados insuficientes:", { employeeId, selectedTagType });
      toast.warning("Selecione um funcionário e uma tag");
      return;
    }

    console.log("[AddTagDialog] Adicionando tag:", {
      employeeId,
      tagTypeId: selectedTagType,
      acquiredDate: acquiredDate || undefined,
      notes: notes || undefined
    });

    try {
      await addEmployeeTag.mutateAsync({
        employeeId,
        tagTypeId: selectedTagType,
        acquiredDate: acquiredDate || undefined,
        notes: notes || undefined
      });
      
      setIsOpen(false);
      setSelectedTagType("");
      setAcquiredDate("");
      setNotes("");
      
      toast.success("Tag adicionada com sucesso!");
      onTagAdded?.();
    } catch (error: any) {
      console.error("[AddTagDialog] Erro ao adicionar tag:", error);
      toast.error(`Erro ao adicionar tag: ${error.message}`);
    }
  };

  if (!employeeId) {
    console.warn("[AddTagDialog] Sem employeeId, componente desabilitado");
    return (
      <div className="text-sm text-muted-foreground">
        Selecione um funcionário para gerenciar tags
      </div>
    );
  }

  if (availableTagTypes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Todas as tags disponíveis já foram adicionadas
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <Label htmlFor="tag-type">Tipo de Tag *</Label>
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
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleAddTag}
              disabled={!selectedTagType || addEmployeeTag.isPending}
            >
              {addEmployeeTag.isPending ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
