
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, ClipboardList, Pencil, Copy } from "lucide-react";
import { ChecklistEmptyState } from "@/components/checklists/ChecklistEmptyState";
import { ChecklistResultItem } from "@/components/checklists/ChecklistResultItem";
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

interface ChecklistTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  checklists: ChecklistTemplate[];
  results: ChecklistResult[];
  onEditTemplate: (template: ChecklistTemplate) => void;
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
  onCopyTemplate,
  onStartAssessment,
  onViewResult,
  onCreateTemplate
}: ChecklistTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="templates">
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Modelos
        </TabsTrigger>
        <TabsTrigger value="results">
          <ClipboardList className="h-4 w-4 mr-2" />
          Resultados
        </TabsTrigger>
      </TabsList>
      
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
                  const dFactorCount = template.questions.filter(q => q.targetFactor === "D").length;
                  const iFactorCount = template.questions.filter(q => q.targetFactor === "I").length;
                  const sFactorCount = template.questions.filter(q => q.targetFactor === "S").length;
                  const cFactorCount = template.questions.filter(q => q.targetFactor === "C").length;
                  
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
                        <Badge variant={template.type === "disc" ? "default" : "outline"}>
                          {template.type === "disc" ? "DISC" : "Personalizado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="bg-red-50">D: {dFactorCount}</Badge>
                          <Badge variant="outline" className="bg-yellow-50">I: {iFactorCount}</Badge>
                          <Badge variant="outline" className="bg-green-50">S: {sFactorCount}</Badge>
                          <Badge variant="outline" className="bg-blue-50">C: {cFactorCount}</Badge>
                        </div>
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
