
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function AssessmentDialogHeader() {
  return (
    <DialogHeader>
      <DialogTitle>Nova Avaliação</DialogTitle>
      <DialogDescription>
        Selecione o funcionário e o modelo de avaliação para criar uma nova avaliação.
      </DialogDescription>
    </DialogHeader>
  );
}
