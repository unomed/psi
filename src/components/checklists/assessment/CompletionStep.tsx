
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CompletionStepProps {
  employeeName: string;
  onEmployeeNameChange: (name: string) => void;
  totalQuestions: number;
}

export function CompletionStep({ 
  employeeName, 
  onEmployeeNameChange,
  totalQuestions
}: CompletionStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Concluir Avaliação</h3>
      <p>
        Você respondeu todas as {totalQuestions} questões. 
        Para finalizar, informe seu nome ou deixe em branco para uma avaliação anônima.
      </p>
      <div className="space-y-2">
        <Label htmlFor="employee-name">Nome (opcional)</Label>
        <Input 
          id="employee-name"
          placeholder="Seu nome"
          value={employeeName}
          onChange={(e) => onEmployeeNameChange(e.target.value)}
        />
      </div>
    </div>
  );
}
