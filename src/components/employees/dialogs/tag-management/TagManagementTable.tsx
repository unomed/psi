
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useTagTypes } from "@/hooks/useEmployeeTags";
import { useTagManagement } from "@/hooks/useTagManagement";
import { EmployeeTagType } from "@/types/tags";

interface TagManagementTableProps {
  onEdit: (tag: EmployeeTagType) => void;
}

export function TagManagementTable({ onEdit }: TagManagementTableProps) {
  const { tagTypes, isLoading } = useTagTypes();
  const { deleteTagType } = useTagManagement();

  const handleDelete = async (tagId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tag?")) {
      try {
        await deleteTagType.mutateAsync(tagId);
      } catch (error) {
        console.error("Error deleting tag:", error);
      }
    }
  };

  const categories = [
    { value: "certification", label: "Certificação" },
    { value: "skill", label: "Habilidade" },
    { value: "training", label: "Treinamento" },
    { value: "requirement", label: "Requisito" }
  ];

  return (
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
                      onClick={() => onEdit(tag)}
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
  );
}
