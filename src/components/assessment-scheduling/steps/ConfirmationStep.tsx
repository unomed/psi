
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types";

interface ConfirmationStepProps {
  employee: Employee;
  templateTitle: string;
  scheduledDate?: Date;
  recurrenceType?: string;
  phoneNumber?: string;
  onConfirm: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function ConfirmationStep({
  employee,
  templateTitle,
  scheduledDate,
  recurrenceType,
  phoneNumber,
  onConfirm,
  onBack,
  isSubmitting = false
}: ConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold">Confirmar Agendamento</h3>
        <p className="text-muted-foreground">
          Revise os dados antes de finalizar o agendamento
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Agendamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Funcionário:</label>
            <p className="text-sm">{employee.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Template:</label>
            <p className="text-sm">{templateTitle}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Data Agendada:</label>
            <p className="text-sm">
              {scheduledDate ? scheduledDate.toLocaleDateString('pt-BR') : 'Não definida'}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Recorrência:</label>
            <Badge variant="outline">
              {recurrenceType === 'none' ? 'Sem recorrência' : 
               recurrenceType === 'monthly' ? 'Mensal' :
               recurrenceType === 'semiannual' ? 'Semestral' :
               recurrenceType === 'annual' ? 'Anual' : recurrenceType}
            </Badge>
          </div>

          {phoneNumber && (
            <div>
              <label className="text-sm font-medium">Telefone:</label>
              <p className="text-sm">{phoneNumber}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Voltar
        </Button>
        <Button onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
        </Button>
      </div>
    </div>
  );
}
