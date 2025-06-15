
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { useTagTypes } from "@/hooks/useEmployeeTags";
import { useTagManagement } from "@/hooks/useTagManagement";
import { EmployeeTagType } from "@/types/tags";

interface TagManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TagManagementDialog({ open, onOpenChange }: TagManagementDialogProps) {
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingTag, setEditingTag] = useState<EmployeeTagType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: ""
  });

  const { tagTypes, isLoading } = useTagTypes();
  const { createTagType, updateTagType, deleteTagType } = useTagManagement();

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
      
      // Reset form
      setFormData({ name: "", description: "", category: "" });
      setIsCreateMode(false);
      setEditingTag(null);
    } catch (error) {
      console.error("Error saving tag:", error);
    }
  };

  const handleEdit = (tag: EmployeeTagType) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description || "",
      category: tag.category || ""
    });
    setIsCreateMode(true);
  };

  const handleDelete = async (tagId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tag?")) {
      try {
        await deleteTagType.mutateAsync(tagId);
      } catch (error) {
        console.error("Error deleting tag:", error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", category: "" });
    setIsCreateMode(false);
    setEditingTag(null);
  };

  const categories = [
    { value: "certification", label: "Certificação" },
    { value: "skill", label: "Habilidade" },
    { value: "training", label: "Treinamento" },
    { value: "requirement", label: "Requisito" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Tipos de Tags</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulário */}
          {isCreateMode && (
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
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {/* Botão para novo */}
          {!isCreateMode && (
            <Button onClick={() => setIsCreateMode(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tag
            </Button>
          )}

          {/* Tabela de tags */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : tagTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Nenhuma tag cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  tagTypes.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell>
                        {tag.category && (
                          <Badge variant="secondary">
                            {categories.find(c => c.value === tag.category)?.label || tag.category}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {tag.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tag.is_active ? "default" : "secondary"}>
                          {tag.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(tag)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(tag.id)}
                            disabled={deleteTagType.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
