import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Copy,
  Trash2,
  Play,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { ChecklistTemplate } from "@/types";

interface BaseTemplateTableProps {
  templates: ChecklistTemplate[];
  onEdit: (template: ChecklistTemplate) => void;
  onDelete: (template: ChecklistTemplate) => void;
  onCopy: (template: ChecklistTemplate) => void;
  onStart: (template: ChecklistTemplate) => void;
  showActions?: boolean;
  isDeleting?: boolean;
}

export function BaseTemplateTable({ 
  templates, 
  onEdit, 
  onDelete, 
  onCopy, 
  onStart,
  showActions = true,
  isDeleting = false 
}: BaseTemplateTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof ChecklistTemplate>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleSort = (column: keyof ChecklistTemplate) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedTemplates = sortedTemplates;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Buscar templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Search className="w-4 h-4 text-gray-500" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Nome
                {sortBy === "name" && (
                  sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Perguntas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tempo Estimado</TableHead>
              {showActions && <TableHead>Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTemplates.map((template) => (
              <TableRow key={String(template.id)}>
                <TableCell>
                  <div>
                    <div className="font-medium">{template.name || template.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {template.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={template.is_standard ? "default" : "secondary"}>
                    {template.type || 'custom'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {template.questions?.length || 0} perguntas
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={template.is_active ? "default" : "secondary"}>
                    {template.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {template.estimated_time_minutes ? `${template.estimated_time_minutes} min` : "Não definido"}
                </TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onStart(template)}
                        title="Iniciar avaliação"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(template)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopy(template)}
                        title="Duplicar"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(template)}
                        disabled={isDeleting}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedTemplates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm ? "Nenhum template encontrado com os critérios de busca." : "Nenhum template disponível."}
        </div>
      )}
    </div>
  );
}
