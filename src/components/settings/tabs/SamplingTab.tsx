
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { assessmentCriteriaSchema } from "../schemas/assessmentCriteriaSchema";

type FormValues = z.infer<typeof assessmentCriteriaSchema>;

interface SamplingTabProps {
  form: UseFormReturn<FormValues>;
}

export function SamplingTab({ form }: SamplingTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Critérios de Amostragem</h3>
        <p className="text-sm text-muted-foreground">
          Configure quais colaboradores devem ser incluídos nas avaliações
        </p>
      </div>
      <Separator />
      
      <FormField
        control={form.control}
        name="minimum_employee_percentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Percentual Mínimo de Colaboradores</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {field.value}%
                  </span>
                </div>
                <Slider
                  value={[field.value]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </div>
            </FormControl>
            <FormDescription>
              Porcentagem mínima de colaboradores que devem ser avaliados
            </FormDescription>
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="require_all_sectors"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Avaliar Todos os Setores
                </FormLabel>
                <FormDescription>
                  Exigir que todos os setores sejam avaliados
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
      
        <FormField
          control={form.control}
          name="require_all_roles"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Avaliar Todas as Funções
                </FormLabel>
                <FormDescription>
                  Exigir que todas as funções sejam avaliadas
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
      
      <FormField
        control={form.control}
        name="prioritize_high_risk_roles"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Priorizar Funções de Alto Risco
              </FormLabel>
              <FormDescription>
                Dar prioridade para avaliação de funções com maior risco identificado
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
