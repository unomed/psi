
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRound, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { ScheduledAssessment } from "@/types";

interface ShareAssessmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: ScheduledAssessment | null;
  generatedLink: string;
  isGenerating: boolean;
  onConfirmShare: () => Promise<void>;
}

export function ShareAssessmentDialog({
  isOpen,
  onClose,
  assessment,
  generatedLink,
  isGenerating,
  onConfirmShare
}: ShareAssessmentDialogProps) {
  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    toast.success("Link copiado para a área de transferência!");
  };

  const handleShareWhatsApp = () => {
    if (!generatedLink || !assessment) return;
    
    const message = `Olá ${assessment.employees?.name}, aqui está o link para sua avaliação: ${generatedLink}`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = assessment.phoneNumber?.replace(/\D/g, '');
    
    if (!phoneNumber) {
      toast.error("Número de telefone não disponível");
      return;
    }
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar Link de Avaliação</DialogTitle>
          <DialogDescription>
            {generatedLink 
              ? 'Link de avaliação gerado com sucesso.' 
              : 'Confirme os dados do funcionário e gere o link de avaliação.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserRound className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">
                {assessment?.employees?.name}
              </h3>
              {assessment?.phoneNumber && (
                <p className="text-sm text-muted-foreground">
                  Telefone: {assessment.phoneNumber}
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
              
              {assessment?.phoneNumber && (
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
              onClick={onConfirmShare}
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
  );
}
