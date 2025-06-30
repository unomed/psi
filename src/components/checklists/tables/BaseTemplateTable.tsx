import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Pencil, Trash2, Copy, Play, Eye } from "lucide-react";
import { ChecklistTemplate } from "@/types";

interface BaseTemplateTableProps {
  templates: ChecklistTemplate[];
  onEditTemplate: (template: ChecklistTemplate) => void;
  onDeleteTemplate: (template: ChecklistTemplate) => void;
  onCopyTemplate: (template: ChecklistTemplate) => void;
  onStartAssessment: (template: ChecklistTemplate) => void;
  isDeleting?: boolean;
}

export function BaseTemplateTable({
  templates,
  onEditTemplate,
  onDeleteTemplate,
  onCopyTemplate,
  onStartAssessment,
  isDeleting = false
}: BaseTemplateTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modelos de Avaliação</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">{template.title}</TableCell>
                <TableCell>{template.type}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="p-2">
                    <Eye className="h-4 w-4 mr-2" onClick={() => onEditTemplate(template)} />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Pencil className="h-4 w-4 mr-2" onClick={() => onEditTemplate(template)} />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Copy className="h-4 w-4 mr-2" onClick={() => onCopyTemplate(template)} />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Play className="h-4 w-4 mr-2" onClick={() => onStartAssessment(template)} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    disabled={isDeleting}
                    onClick={() => onDeleteTemplate(template)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
