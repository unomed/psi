import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, Mail, MessageSquare, User, FileText } from "lucide-react";
import { RecurrenceType } from "@/types";

interface CandidateSchedulingDetailsStepProps {
  candidateName: string;
  candidateEmail?: string;
  templateTitle?: string;
  scheduledDate: Date;
  onDateSelect: (date: Date) => void;
  onBack: () => void;
  onSchedule: (recurrenceType: RecurrenceType, phoneNumber: string) => void;
}

export function CandidateSchedulingDetailsStep({
  candidateName,
  candidateEmail,
  templateTitle,
  scheduledDate,
  onDateSelect,
  onBack,
  onSchedule
}: CandidateSchedulingDetailsStepProps) {
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);

  const handleSchedule = async () => {
    setIsScheduling(true);
    try {
      await onSchedule("none", phoneNumber);
    } finally {
      setIsScheduling(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Detalhes do Agendamento</h3>
          <p className="text-muted-foreground">
            Configure como e quando o candidato receberá a avaliação
          </p>
        </div>
      </div>

      {/* Resumo do Agendamento */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Resumo da Avaliação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Candidato:</span>
            <span>{candidateName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Template:</span>
            <span>{templateTitle}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Data/Hora:</span>
            <span>{formatDateTime(scheduledDate)}</span>
          </div>

          {candidateEmail && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Email:</span>
              <span>{candidateEmail}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações de Data/Hora */}
      <Card>
        <CardHeader>
          <CardTitle>Data e Hora do Agendamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="datetime">Data e Hora</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={scheduledDate.toISOString().slice(0, 16)}
                onChange={(e) => onDateSelect(new Date(e.target.value))}
                className="mt-1"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Envio */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Notificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enviar por Email</Label>
              <p className="text-sm text-muted-foreground">
                O candidato receberá um link de acesso por email
              </p>
            </div>
            <Switch
              checked={sendEmail}
              onCheckedChange={setSendEmail}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enviar por WhatsApp</Label>
              <p className="text-sm text-muted-foreground">
                Enviar link também via WhatsApp (opcional)
              </p>
            </div>
            <Switch
              checked={sendWhatsApp}
              onCheckedChange={setSendWhatsApp}
            />
          </div>

          {sendWhatsApp && (
            <div>
              <Label htmlFor="phone">Número do WhatsApp</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle>Observações (Opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Adicione observações sobre esta avaliação..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Informações Importantes */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-800">Como o candidato acessará?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-yellow-700">
          <ul className="list-disc list-inside space-y-1">
            <li>O candidato receberá um link único por email</li>
            <li>Poderá acessar usando seu CPF cadastrado</li>
            <li>Será direcionado ao portal do funcionário para completar a avaliação</li>
            <li>O acesso é seguro e rastreável</li>
          </ul>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Button 
          onClick={handleSchedule}
          disabled={isScheduling || (!sendEmail && !sendWhatsApp)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isScheduling ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Agendando...
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Confirmar Agendamento
            </>
          )}
        </Button>
      </div>
    </div>
  );
}