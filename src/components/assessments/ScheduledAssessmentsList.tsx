
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Link, Mail, UserRound } from "lucide-react";
import { ScheduledAssessment } from "@/types";
import { toast } from "sonner";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface ScheduledAssessmentsListProps {
  assessments: ScheduledAssessment[];
  type: "scheduled" | "completed";
  onShareAssessment?: (assessmentId: string) => Promise<void>;
}

export function ScheduledAssessmentsList({ 
  assessments, 
  type,
  onShareAssessment 
}: ScheduledAssessmentsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<ScheduledAssessment | null>(null);

  if (assessments.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {type === "scheduled" 
          ? "Nenhuma avaliação agendada" 
          : "Nenhuma avaliação concluída"}
      </div>
    );
  }

  const handleShareClick = async (assessmentId: string) => {
    // Encontrar a avaliação selecionada
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment) return;

    // Abrir o dialog com informações do funcionário
    setSelectedAssessment(assessment);
    setIsDialogOpen(true);
  };

  const handleConfirmShare = async () => {
    if (!selectedAssessment || !onShareAssessment) return;
    
    try {
      await onShareAssessment(selectedAssessment.id);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao compartilhar avaliação:", error);
      toast.error("Erro ao gerar link de avaliação");
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell>
                  {assessment.employees?.name || "Funcionário não encontrado"}
                </TableCell>
                <TableCell>
                  {assessment.checklist_templates?.title || "Modelo não encontrado"}
                </TableCell>
                <TableCell>
                  {format(assessment.scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${assessment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${assessment.status === 'sent' ? 'bg-blue-100 text-blue-800' : ''}
                    ${assessment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}`}
                  >
                    {assessment.status === 'scheduled' ? 'Agendado' : ''}
                    {assessment.status === 'sent' ? 'Enviado' : ''}
                    {assessment.status === 'completed' ? 'Concluído' : ''}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Agendar nova avaliação"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Gerar link"
                      onClick={() => handleShareClick(assessment.id)}
                      disabled={type === "completed" || !onShareAssessment || assessment.status === 'sent'}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Enviar por email"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog para mostrar informações do funcionário e confirmar geração de link */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerar Link de Avaliação</DialogTitle>
            <DialogDescription>
              Confirme os dados do funcionário e gere o link de avaliação.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserRound className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {selectedAssessment?.employees?.name || "Funcionário não encontrado"}
                </h3>
                {selectedAssessment?.phoneNumber && (
                  <p className="text-sm text-muted-foreground">
                    Telefone: {selectedAssessment.phoneNumber}
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                <strong>Modelo:</strong> {selectedAssessment?.checklist_templates?.title || "Modelo não encontrado"}
              </p>
              <p className="text-sm">
                <strong>Data:</strong> {selectedAssessment ? format(selectedAssessment.scheduledDate, "dd/MM/yyyy", { locale: ptBR }) : ""}
              </p>
              <p className="text-sm">
                <strong>Status:</strong> {selectedAssessment?.status === 'scheduled' ? 'Agendado' : selectedAssessment?.status === 'sent' ? 'Enviado' : 'Concluído'}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmShare} disabled={!selectedAssessment || !onShareAssessment}>
              Gerar Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
