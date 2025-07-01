
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTagManagement } from "@/hooks/useTagManagement";
import { EmployeeTagType } from "@/types/tags";

interface TagManagementFormProps {
  editingTag: EmployeeTagType | null;
  onClose: () => void;
}

export function TagManagementForm({ editingTag, onClose }: TagManagementFormProps) {
  const [formData, setFormData] = useState({
    name: editingTag?.name || "",
    description: editingTag?.description || "",
    category: editingTag?.category || ""
  });

  const { createTagType, updateTagType } = useTagManagement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTag) {
        await updateTagType.mutateAsync({
          id: editingTag.id,
          ...formData
        });
      } else {
        await createTagType.mutateAsync(formData);
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving tag:", error);
    }
  };

  const categories = [
    { value: "certification", label: "Certificação" },
    { value: "skill", label: "Habilidade" },
    { value: "training", label: "Treinamento" },
    { value: "requirement", label: "Requisito" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/20">
      <h3 className="text-lg font-medium">
        {editingTag ? "Editar Tag" : "Nova Tag"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Tag *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ex: CNH Categoria B"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Descrição da competência ou certificação"
          rows={3}
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={createTagType.isPending || updateTagType.isPending}>
          {editingTag ? "Atualizar" : "Criar"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
