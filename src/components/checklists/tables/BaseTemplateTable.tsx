
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChecklistTemplate } from "@/types/checklist";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Pencil, Trash2, Loader2 } from "lucide-react";
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

export interface BaseTemplateTableProps {
  templates: ChecklistTemplate[];
  caption: string;
  onEditTemplate: (template: ChecklistTemplate) => void;
  onDeleteTemplate: (template: ChecklistTemplate) => void;
  onCopyTemplate: (template: ChecklistTemplate) => void;
  onStartAssessment: (template: ChecklistTemplate) => void;
  showCategories?: boolean;
  isDeleting?: boolean;
}

export function BaseTemplateTable({
  templates,
  caption,
  onEditTemplate,
  onDeleteTemplate,
  onCopyTemplate,
  onStartAssessment,
  showCategories = false,
  isDeleting = false,
}: BaseTemplateTableProps) {
  const renderFactorBadges = (template: ChecklistTemplate) => {
    if (template.type === "disc") {
      const dFactorCount = template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "D").length;
      const iFactorCount = template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "I").length;
      const sFactorCount = template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "S").length;
      const cFactorCount = template.questions.filter(q => 'targetFactor' in q && q.targetFactor === "C").length;

      return (
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="bg-red-50">D: {dFactorCount}</Badge>
          <Badge variant="outline" className="bg-yellow-50">I: {iFactorCount}</Badge>
          <Badge variant="outline" className="bg-green-50">S: {sFactorCount}</Badge>
          <Badge variant="outline" className="bg-blue-50">C: {cFactorCount}</Badge>
        </div>
      );
    }
    return null;
  };

  const renderPsicossocialCategories = (template: ChecklistTemplate) => {
    if (template.type === "psicossocial") {
      const categories = Array.from(new Set(template.questions.map(q => {
        if ('category' in q) {
          return q.category;
        }
        return 'Sem categoria';
      })));

      return (
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <Badge key={category} variant="outline" className="bg-purple-50">
              {category}
            </Badge>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Fatores DISC</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
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
                {showCategories ? (
                  template.type === "disc" ? renderFactorBadges(template) :
                  template.type === "psicossocial" ? renderPsicossocialCategories(template) :
                  <span className="text-xs text-muted-foreground">N/A</span>
                ) : (
                  renderFactorBadges(template)
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Excluindo...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </>
                        )}
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
                        <AlertDialogAction 
                          onClick={() => onDeleteTemplate(template)}
                          disabled={isDeleting}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          {isDeleting ? "Excluindo..." : "Excluir"}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
