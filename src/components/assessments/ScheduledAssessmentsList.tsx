import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Link, Mail, UserRound, Copy, Share2 } from "lucide-react";
import { ScheduledAssessment } from "@/types";
import { toast } from "sonner";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (assessments.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {type === "scheduled" 
          ? "Nenhuma avaliação agendada" 
          : "Nenhuma avaliação concluída"}
      </div>
    );
  }

  const handleShareClick = async (assessment: ScheduledAssessment) => {
    setSelectedAssessment(assessment);
    if (assessment.linkUrl) {
      setGeneratedLink(assessment.linkUrl);
    }
    setIsDialogOpen(true);
  };

  const handleConfirmShare = async () => {
    if (!selectedAssessment || !onShareAssessment) return;
    
    try {
      setIsGenerating(true);
      await onShareAssessment(selectedAssessment.id);
      const updatedAssessment = assessments.find(a => a.id === selectedAssessment.id);
      if (updatedAssessment?.linkUrl) {
        setGeneratedLink(updatedAssessment.linkUrl);
      }
      toast.success("Link gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar link de avaliação:", error);
      toast.error("Erro ao gerar link de avaliação");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copiado para a área de transferência!");
  };

  const handleShareWhatsApp = () => {
    if (!generatedLink || !selectedAssessment) return;
    
    const message = `Olá ${selectedAssessment.employees?.name}, aqui está o link para sua avaliação: ${generatedLink}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = selectedAssessment.phoneNumber?.replace(/\D/g, '');
    
    if (!phoneNumber) {
      toast.error("Número de telefone não disponível");
      return;
    }
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
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
                      onClick={() => handleShareClick(assessment)}
                      disabled={type === "completed" || !onShareAssessment || assessment.status === 'completed'}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerar Link de Avaliação</DialogTitle>
            <DialogDescription>
              {generatedLink ? 'Link de avaliação gerado com sucesso.' : 'Confirme os dados do funcionário e gere o link de avaliação.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <UserRound className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {selectedAssessment?.employees?.name}
                </h3>
                {selectedAssessment?.phoneNumber && (
                  <p className="text-sm text-muted-foreground">
                    Telefone: {selectedAssessment.phoneNumber}
                  </p>
                )}
              </div>
            </div>
            
            {generatedLink ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Link gerado:</label>
                <div className="flex space-x-2">
                  <Input readOnly value={generatedLink} className="flex-1" />
                  <Button size="icon" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                {selectedAssessment?.phoneNumber && (
                  <Button 
                    onClick={handleShareWhatsApp}
                    className="w-full mt-2"
                    variant="secondary"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar via WhatsApp
                  </Button>
                )}
              </div>
            ) : (
              <Button
                onClick={handleConfirmShare}
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? "Gerando..." : "Gerar Link"}
              </Button>
            )}
          </div>
          
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
