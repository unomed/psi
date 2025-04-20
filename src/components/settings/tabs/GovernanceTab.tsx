
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { assessmentCriteriaSchema } from "../schemas/assessmentCriteriaSchema";

type FormValues = z.infer<typeof assessmentCriteriaSchema>;

interface GovernanceTabProps {
  form: UseFormReturn<FormValues>;
}

export function GovernanceTab({ form }: GovernanceTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Governança de Risco</h3>
        <p className="text-sm text-muted-foreground">
          Configure as ações necessárias quando riscos são identificados
        </p>
      </div>
      <Separator />
      
      <FormField
        control={form.control}
        name="require_reassessment_for_high_risk"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Reavaliação Obrigatória para Alto Risco
              </FormLabel>
              <FormDescription>
                Exigir reavaliação quando alto risco for identificado
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
      
      {form.watch("require_reassessment_for_high_risk") && (
        <FormField
          control={form.control}
          name="reassessment_max_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prazo para Reavaliação (dias)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={365}
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Prazo máximo em dias para realizar a reavaliação
              </FormDescription>
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={form.control}
        name="notify_managers_on_high_risk"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Notificar Gestores
              </FormLabel>
              <FormDescription>
                Enviar notificações para gestores quando alto risco for identificado
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
    </div>
  );
}
