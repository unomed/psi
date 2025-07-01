
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { assessmentCriteriaSchema } from "../schemas/assessmentCriteriaSchema";

type FormValues = z.infer<typeof assessmentCriteriaSchema>;

interface PeriodicityTabProps {
  form: UseFormReturn<FormValues>;
}

export function PeriodicityTab({ form }: PeriodicityTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Configurações de Periodicidade</h3>
        <p className="text-sm text-muted-foreground">
          Defina com que frequência as avaliações devem ser realizadas
        </p>
      </div>
      <Separator />
      
      <FormField
        control={form.control}
        name="default_recurrence_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Periodicidade Padrão</FormLabel>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a periodicidade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Sem recorrência</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="semiannual">Semestral</SelectItem>
                <SelectItem value="annual">Anual</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Frequência padrão para realização de novas avaliações
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="enable_recurrence_reminders"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Lembretes de Recorrência
              </FormLabel>
              <FormDescription>
                Enviar lembretes antes do vencimento das avaliações
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      {form.watch("enable_recurrence_reminders") && (
        <FormField
          control={form.control}
          name="days_before_reminder_sent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dias de Antecedência</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {field.value} dias
                    </span>
                  </div>
                  <Slider
                    value={[field.value]}
                    min={1}
                    max={90}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Quantos dias antes enviar lembretes para avaliações futuras
              </FormDescription>
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
