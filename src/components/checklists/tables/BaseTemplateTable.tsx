
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChecklistTemplate } from "@/types";
import { Play, Edit, Trash2, Copy } from "lucide-react";

export interface BaseTemplateTableProps {
  templates: ChecklistTemplate[];
  onEdit: (template: ChecklistTemplate) => void;
  onDelete: (template: ChecklistTemplate) => void;
  onCopy: (template: ChecklistTemplate) => void;
  onStart: (template: ChecklistTemplate) => void;
  showCategories?: boolean;
  isDeleting?: boolean;
  caption?: string;
}

export function BaseTemplateTable({
  templates,
  onEdit,
  onDelete,
  onCopy,
  onStart,
  showCategories = false,
  isDeleting = false,
  caption
}: BaseTemplateTableProps) {
  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      disc: "DISC",
      psicossocial: "Psicossocial",
      srq20: "SRQ-20",
      phq9: "PHQ-9",
      gad7: "GAD-7",
      mbi: "MBI",
      audit: "AUDIT",
      pss: "PSS",
      copsoq: "COPSOQ",
      jcq: "JCQ",
      eri: "ERI",
      personal_life: "Vida Pessoal",
      evaluation_360: "Avaliação 360°",
      custom: "Personalizado",
      stress: "Stress"
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="rounded-md border">
      {caption && (
        <div className="p-4 border-b">
          <h3 className="font-medium">{caption}</h3>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            {showCategories && <TableHead>Categoria</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Tempo Estimado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{template.title || template.name}</div>
                  {template.description && (
                    <div className="text-sm text-muted-foreground">
                      {template.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getTypeLabel(template.type || 'custom')}
                </Badge>
              </TableCell>
              {showCategories && (
                <TableCell>
                  <Badge variant="secondary">
                    {template.category || 'Geral'}
                  </Badge>
                </TableCell>
              )}
              <TableCell>
                <Badge variant={template.is_active ? "default" : "secondary"}>
                  {template.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell>
                {template.estimated_time_minutes ? `${template.estimated_time_minutes} min` : "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onStart(template)}
                    title="Iniciar Avaliação"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(template)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCopy(template)}
                    title="Copiar"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(template)}
                    disabled={isDeleting}
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
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
