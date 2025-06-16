
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Mail, MessageCircle, Phone, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { RecurrenceType } from "@/types";

interface SchedulingDetailsStepProps {
  employeeName: string;
  employeeEmail?: string;
  templateTitle?: string;
  scheduledDate: Date;
  onDateSelect: (date: Date | undefined) => void;
  onBack: () => void;
  onSchedule: (recurrenceType: RecurrenceType, phoneNumber: string) => void;
}

export function SchedulingDetailsStep({
  employeeName,
  employeeEmail,
  templateTitle,
  scheduledDate,
  onDateSelect,
  onBack,
  onSchedule
}: SchedulingDetailsStepProps) {
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(false);

  const handleSchedule = () => {
    onSchedule(recurrenceType, phoneNumber);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Detalhes do Agendamento</h3>
        <p className="text-muted-foreground">
          Configure os detalhes do agendamento da avaliação
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            Resumo do Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Funcionário:</span>
            <span className="font-medium">{employeeName}</span>
          </div>
          {employeeEmail && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{employeeEmail}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Checklist:</span>
            <span className="font-medium">{templateTitle || "Template selecionado"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Data da Avaliação</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !scheduledDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {scheduledDate ? format(scheduledDate, "dd/MM/yyyy") : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={onDateSelect}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Recurrence */}
        <div className="space-y-2">
          <Label>Recorrência</Label>
          <Select value={recurrenceType} onValueChange={(value) => setRecurrenceType(value as RecurrenceType)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar recorrência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Única vez</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="semiannual">Semestral</SelectItem>
              <SelectItem value="annual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Informações de Contato
        </h4>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone/WhatsApp (opcional)</Label>
          <Input
            id="phone"
            placeholder="(11) 99999-9999"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div className="space-y-4">
        <h4 className="font-medium">Configurações de Notificação</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Label htmlFor="email-notifications">Enviar por email</Label>
            </div>
            <Switch
              id="email-notifications"
              checked={sendEmail}
              onCheckedChange={setSendEmail}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <Label htmlFor="whatsapp-notifications">Enviar por WhatsApp</Label>
            </div>
            <Switch
              id="whatsapp-notifications"
              checked={sendWhatsApp}
              onCheckedChange={setSendWhatsApp}
              disabled={!phoneNumber}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        
        <Button onClick={handleSchedule} className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Agendar Avaliação
        </Button>
      </div>
    </div>
  );
}
