
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, Mail, MessageCircle, Repeat } from "lucide-react";
import { Employee } from "@/types/employee";
import { ChecklistTemplate, RecurrenceType } from "@/types";

interface SchedulingDetails {
  scheduledDate?: Date;
  recurrenceType: RecurrenceType;
  phoneNumber: string;
  sendEmail: boolean;
  sendWhatsApp: boolean;
}

interface ConfirmationStepProps {
  employee: Employee | null;
  template: ChecklistTemplate | null;
  details: SchedulingDetails;
}

export function ConfirmationStep({ employee, template, details }: ConfirmationStepProps) {
  const getRecurrenceLabel = (type: RecurrenceType) => {
    const labels = {
      none: "Sem recorrência",
      daily: "Diário",
      weekly: "Semanal",
      monthly: "Mensal",
      quarterly: "Trimestral",
      semiannual: "Semestral", 
      annual: "Anual"
    };
    return labels[type];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationMethods = () => {
    const methods = [];
    if (details.sendEmail) methods.push("Email");
    if (details.sendWhatsApp) methods.push("WhatsApp");
    return methods.join(" e ") || "Nenhuma";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Confirmar Agendamento</h3>
        <p className="text-muted-foreground">
          Revise as informações antes de finalizar o agendamento
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações do Funcionário */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Funcionário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{employee?.name}</p>
              <p className="text-sm text-muted-foreground">CPF: {employee?.cpf}</p>
              {employee?.email && (
                <p className="text-sm text-muted-foreground">Email: {employee.email}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações do Template */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{template?.title}</p>
              {template?.description && (
                <p className="text-sm text-muted-foreground">{template.description}</p>
              )}
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-xs">{template?.type}</Badge>
                {template?.is_standard && (
                  <Badge variant="secondary" className="text-xs">Padrão</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes do Agendamento */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Detalhes do Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Data da Avaliação</Label>
                <p className="text-sm text-muted-foreground">
                  {details.scheduledDate ? formatDate(details.scheduledDate) : "Não definida"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-1">
                  <Repeat className="h-3 w-3" />
                  Recorrência
                </Label>
                <p className="text-sm text-muted-foreground">
                  {getRecurrenceLabel(details.recurrenceType)}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Notificações</Label>
                <p className="text-sm text-muted-foreground">
                  {getNotificationMethods()}
                </p>
              </div>
            </div>

            {details.sendWhatsApp && details.phoneNumber && (
              <div>
                <Label className="text-sm font-medium flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  WhatsApp
                </Label>
                <p className="text-sm text-muted-foreground">{details.phoneNumber}</p>
              </div>
            )}

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="text-sm font-medium text-green-800 mb-2">O que acontecerá após confirmar:</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Um link único será gerado para a avaliação</li>
                <li>• O funcionário receberá as notificações configuradas</li>
                <li>• O agendamento ficará visível no painel de controle</li>
                {details.recurrenceType !== "none" && (
                  <li>• Futuras avaliações serão agendadas automaticamente</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
