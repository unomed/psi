
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Copy, Play, Eye } from "lucide-react";
import { ChecklistTemplate } from "@/types/checklist";

export interface BaseTemplateTableProps {
  templates: ChecklistTemplate[];
  caption?: string;
  onEdit: (template: ChecklistTemplate) => void;
  onDelete: (template: ChecklistTemplate) => void;
  onCopy: (template: ChecklistTemplate) => void;
  onStart: (template: ChecklistTemplate) => void;
  showCategories?: boolean;
  isDeleting?: boolean;
}

export function BaseTemplateTable({
  templates,
  caption,
  onEdit,
  onDelete,
  onCopy,
  onStart,
  showCategories = false,
  isDeleting = false,
}: BaseTemplateTableProps) {
  if (templates.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Nenhum template encontrado</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        {caption && (
          <caption className="text-sm text-muted-foreground mb-4">
            {caption}
          </caption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            {showCategories && <TableHead>Categoria</TableHead>}
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell className="font-medium">{template.name || template.title}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {template.description}
              </TableCell>
              {showCategories && (
                <TableCell>
                  <Badge variant="outline">{template.category}</Badge>
                </TableCell>
              )}
              <TableCell>
                <Badge variant={template.type === 'disc' ? 'default' : 'secondary'}>
                  {template.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={template.is_active ? 'default' : 'secondary'}>
                  {template.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStart(template)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopy(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(template)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
