
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChecklistEmptyState } from "@/components/checklists/ChecklistEmptyState";
import { ChecklistResultItem } from "@/components/checklists/ChecklistResultItem";
import { ClipboardCheck, ClipboardList, Pencil, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { DiscFactorType, DiscQuestion, PsicossocialQuestion } from "@/types";

interface ChecklistTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  checklists: ChecklistTemplate[];
  results: ChecklistResult[];
  onEditTemplate: (template: ChecklistTemplate) => void;
  onDeleteTemplate: (template: ChecklistTemplate) => void;
  onCopyTemplate: (template: ChecklistTemplate) => void;
  onStartAssessment: (template: ChecklistTemplate) => void;
  onViewResult: (result: ChecklistResult) => void;
  onCreateTemplate: () => void;
}

export function ChecklistTabs({
  activeTab,
  setActiveTab,
  checklists,
  results,
  onEditTemplate,
  onDeleteTemplate,
  onCopyTemplate,
  onStartAssessment,
  onViewResult,
  onCreateTemplate
}: ChecklistTabsProps) {
  // Nova aba "todos" para exibir todos os modelos cadastrados
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="templates">
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Modelos
        </TabsTrigger>
        <TabsTrigger value="all">
          <ClipboardList className="h-4 w-4 mr-2" />
          Todos
        </TabsTrigger>
        <TabsTrigger value="results">
          <ClipboardList className="h-4 w-4 mr-2" />
          Resultados
        </TabsTrigger>
      </TabsList>
      
      {/* Modelos padrão (igual já existe) */}
      <TabsContent value="templates" className="mt-6">
        {checklists.length === 0 ? (
          <ChecklistEmptyState 
            type="templates" 
            onCreateTemplate={onCreateTemplate} 
          />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableCaption>Lista de modelos de checklist disponíveis</TableCaption>
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
                {checklists.map((template) => {
                  // Only calculate DISC factors if it's a DISC type template
                  const dFactorCount = template.type === "disc" ? 
                    template.questions.filter(q => (q as DiscQuestion).targetFactor === "D").length : 0;
                  const iFactorCount = template.type === "disc" ? 
                    template.questions.filter(q => (q as DiscQuestion).targetFactor === "I").length : 0;
                  const sFactorCount = template.type === "disc" ? 
                    template.questions.filter(q => (q as DiscQuestion).targetFactor === "S").length : 0;
                  const cFactorCount = template.type === "disc" ? 
                    template.questions.filter(q => (q as DiscQuestion).targetFactor === "C").length : 0;

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
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {template.type === "psicossocial" ? "Categorias psicossociais" : "N/A"}
                          </span>
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
                          {/* Novo botão para iniciar avaliação de qualquer tipo de checklist */}
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
        )}
      </TabsContent>
      {/* NOVA ABA: TODOS OS MODELOS */}
      <TabsContent value="all" className="mt-6">
        {checklists.length === 0 ? (
          <ChecklistEmptyState 
            type="templates" 
            onCreateTemplate={onCreateTemplate} 
          />
        ) : (
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
                {checklists.map((template) => {
                  // Para cada tipo, mostrar como apropriado
                  const categories = template.type === "psicossocial"
                    ? Array.from(new Set(template.questions.map(q => (q as PsicossocialQuestion).category)))
                    : [];

                  // Recalcular fatores DISC como antes
                  const dFactorCount = template.type === "disc" ? 
                    template.questions.filter(q => (q as DiscQuestion).targetFactor === "D").length : 0;
                  const iFactorCount = template.type === "disc" ? 
                    template.questions.filter(q => (q as DiscQuestion).targetFactor === "I").length : 0;
                  const sFactorCount = template.type === "disc" ? 
                    template.questions.filter(q => (q as DiscQuestion).targetFactor === "S").length : 0;
                  const cFactorCount = template.type === "disc" ? 
                    template.questions.filter(q => (q as DiscQuestion).targetFactor === "C").length : 0;

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
                          <span className="text-xs text-muted-foreground">
                            {categories.join(", ")}
                          </span>
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
        )}
      </TabsContent>
      
      <TabsContent value="results" className="mt-6">
        {results.length === 0 ? (
          <ChecklistEmptyState 
            type="results" 
            onSwitchTab={() => setActiveTab("templates")} 
          />
        ) : (
          <div className="space-y-4">
            {results.map((result) => {
              const template = checklists.find(t => t.id === result.templateId);
              return (
                <ChecklistResultItem
                  key={result.id}
                  result={result}
                  template={template}
                  onViewResult={onViewResult}
                />
              );
            })}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
