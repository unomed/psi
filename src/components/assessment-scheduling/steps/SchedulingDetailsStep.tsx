
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Mail, MessageCircle, Repeat } from "lucide-react";
import { RecurrenceType } from "@/types";

interface SchedulingDetails {
  scheduledDate?: Date;
  recurrenceType: RecurrenceType;
  phoneNumber: string;
  sendEmail: boolean;
  sendWhatsApp: boolean;
}

interface SchedulingDetailsStepProps {
  details: SchedulingDetails;
  onDetailsChange: (details: SchedulingDetails) => void;
}

export function SchedulingDetailsStep({ details, onDetailsChange }: SchedulingDetailsStepProps) {
  const updateDetails = (field: keyof SchedulingDetails, value: any) => {
    onDetailsChange({ ...details, [field]: value });
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    updateDetails('phoneNumber', formatted);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Detalhes do Agendamento</h3>
        <p className="text-muted-foreground">
          Configure quando e como a avaliação será realizada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data e Recorrência */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Data da Avaliação*</Label>
              <DatePicker
                date={details.scheduledDate}
                onSelect={(date) => updateDetails('scheduledDate', date)}
                disabled={(date) => date < new Date()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurrence">Recorrência</Label>
              <Select 
                value={details.recurrenceType || undefined} 
                onValueChange={(value: RecurrenceType) => updateDetails('recurrenceType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a recorrência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem recorrência</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="semiannual">Semestral</SelectItem>
                  <SelectItem value="annual">Anual</SelectItem>
                </SelectContent>
              </Select>
              {details.recurrenceType !== "none" && (
                <p className="text-xs text-muted-foreground">
                  <Repeat className="h-3 w-3 inline mr-1" />
                  A avaliação será reagendada automaticamente
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sendEmail"
                checked={details.sendEmail}
                onCheckedChange={(checked) => updateDetails('sendEmail', checked)}
              />
              <Label htmlFor="sendEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Enviar por email
              </Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sendWhatsApp"
                  checked={details.sendWhatsApp}
                  onCheckedChange={(checked) => updateDetails('sendWhatsApp', checked)}
                />
                <Label htmlFor="sendWhatsApp" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Enviar por WhatsApp
                </Label>
              </div>
              
              {details.sendWhatsApp && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="phoneNumber">Número do WhatsApp</Label>
                  <Input
                    id="phoneNumber"
                    value={details.phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="(XX) XXXXX-XXXX"
                    maxLength={15}
                  />
                  <p className="text-xs text-muted-foreground">
                    Número para envio do link via WhatsApp
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                ℹ️ O funcionário receberá um link único para realizar a avaliação. 
                O link é válido por 30 dias e pode ser usado apenas uma vez.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
