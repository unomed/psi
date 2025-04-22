
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChecklistTemplate, PsicossocialQuestion } from "@/types/checklist";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AllTemplatesTableProps {
  templates: ChecklistTemplate[];
  onEditTemplate: (template: ChecklistTemplate) => void;
  onDeleteTemplate: (template: ChecklistTemplate) => void;
  onCopyTemplate: (template: ChecklistTemplate) => void;
  onStartAssessment: (template: ChecklistTemplate) => void;
}

export function AllTemplatesTable({
  templates,
  onEditTemplate,
  onDeleteTemplate,
  onCopyTemplate,
  onStartAssessment,
}: AllTemplatesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Todos os modelos cadastrados (incluindo Psicossocial e Personalizado)</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Categorias/Fatores</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => {
            const categories = template.type === "psicossocial"
              ? Array.from(new Set(template.questions.map(q => {
                  if ('category' in q) {
                    return (q as PsicossocialQuestion).category;
                  }
                  return 'Sem categoria';
                })))
              : [];

            const dFactorCount = template.type === "disc" ? 
              template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "D").length : 0;
            const iFactorCount = template.type === "disc" ? 
              template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "I").length : 0;
            const sFactorCount = template.type === "disc" ? 
              template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "S").length : 0;
            const cFactorCount = template.type === "disc" ? 
              template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "C").length : 0;

            return (
              <TableRow key={template.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{template.title}</span>
                    {template.description && (
                      <span className="text-xs text-muted-foreground">{template.description}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={template.type === "disc" ? "default" : (template.type === "psicossocial" ? "secondary" : "outline")}>
                    {template.type === "disc" ? "DISC" : (template.type === "psicossocial" ? "Psicossocial" : "Personalizado")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {template.type === "disc" ? (
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="bg-red-50">D: {dFactorCount}</Badge>
                      <Badge variant="outline" className="bg-yellow-50">I: {iFactorCount}</Badge>
                      <Badge variant="outline" className="bg-green-50">S: {sFactorCount}</Badge>
                      <Badge variant="outline" className="bg-blue-50">C: {cFactorCount}</Badge>
                    </div>
                  ) : template.type === "psicossocial" ? (
                    <div className="flex flex-wrap gap-1">
                      {categories.map(category => (
                        <Badge key={category} variant="outline" className="bg-purple-50">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {format(template.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEditTemplate(template)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onCopyTemplate(template)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza que deseja excluir este modelo?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Todos os dados relacionados a este modelo de checklist serão permanentemente removidos.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteTemplate(template)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="outline" size="sm" onClick={() => onStartAssessment(template)}>
                      Iniciar Avaliação
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
