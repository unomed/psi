
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { assessmentCriteriaSchema } from "../schemas/assessmentCriteriaSchema";

type FormValues = z.infer<typeof assessmentCriteriaSchema>;

interface RiskLevelsTabProps {
  form: UseFormReturn<FormValues>;
}

export function RiskLevelsTab({ form }: RiskLevelsTabProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Níveis de Risco</h3>
        <p className="text-sm text-muted-foreground">
          Defina os limiares para classificação dos níveis de risco
        </p>
      </div>
      <Separator />
      
      <FormField
        control={form.control}
        name="low_risk_threshold"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Limiar de Risco Baixo</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    0% a {field.value}%
                  </span>
                </div>
                <Slider
                  value={[field.value]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </div>
            </FormControl>
            <FormDescription>
              Pontuações abaixo deste valor são consideradas baixo risco
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="medium_risk_threshold"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Limiar de Risco Médio</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {form.watch("low_risk_threshold")}% a {field.value}%
                  </span>
                </div>
                <Slider
                  value={[field.value]}
                  min={form.watch("low_risk_threshold") + 1}
                  max={90}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </div>
            </FormControl>
            <FormDescription>
              Pontuações entre o limiar de baixo risco e este valor são consideradas risco médio
            </FormDescription>
          </FormItem>
        )}
      />
      
      <div className="p-4 rounded-lg bg-red-50 border border-red-200">
        <div className="font-medium">Alto Risco</div>
        <div className="text-sm text-gray-600 mt-1">
          Pontuações acima de {form.watch("medium_risk_threshold")}% são consideradas alto risco
        </div>
      </div>
      
      <div className="space-y-2 pt-2">
        <FormField
          control={form.control}
          name="sector_risk_calculation_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cálculo de Risco do Setor</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método de cálculo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="average">Média Simples</SelectItem>
                  <SelectItem value="highest">Maior Risco Encontrado</SelectItem>
                  <SelectItem value="weighted">Média Ponderada</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Como calcular o nível de risco de um setor com base nos funcionários
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="company_risk_calculation_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cálculo de Risco da Empresa</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método de cálculo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="average">Média Simples</SelectItem>
                  <SelectItem value="highest">Maior Risco Encontrado</SelectItem>
                  <SelectItem value="weighted">Média Ponderada por Setor</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Como calcular o nível de risco global da empresa com base nos setores
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
