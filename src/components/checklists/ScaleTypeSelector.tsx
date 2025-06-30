import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ScaleType } from "@/types";

interface ScaleTypeSelectorProps {
  form: UseFormReturn<any>;
  name: string;
  value?: ScaleType;
  onValueChange?: (value: ScaleType) => void;
}

const scaleTypes = [
  { value: "custom" as const, label: "Personalizada" },
  { value: "likert5" as const, label: "Likert 5 pontos (1-5)" },
  { value: "likert7" as const, label: "Likert 7 pontos (1-7)" },
  { value: "yes_no" as const, label: "Sim/Não" },
  { value: "frequency" as const, label: "Frequência" },
  { value: "binary" as const, label: "Binária (0/1)" },
  { value: "percentage" as const, label: "Percentual (0-100)" },
  { value: "stanine" as const, label: "Stanine (1-9)" },
  { value: "percentile" as const, label: "Percentil (0-100)" },
  { value: "tscore" as const, label: "T-Score" },
  { value: "range10" as const, label: "Escala 1-10" }
];

export function ScaleTypeSelector({ form, name, value, onValueChange }: ScaleTypeSelectorProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Escala</FormLabel>
          <FormControl>
            <Select
              value={field.value || value}
              onValueChange={(newValue: ScaleType) => {
                field.onChange(newValue);
                onValueChange?.(newValue);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar tipo de escala" />
              </SelectTrigger>
              <SelectContent>
                {scaleTypes.map((scale) => (
                  <SelectItem key={scale.value} value={scale.value}>
                    {scale.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />

          {/* Scale description */}
          {(field.value === "likert5" || value === "likert5") && (
            <p className="text-xs text-muted-foreground mt-2">
              Escala de 1 (Discordo totalmente) a 5 (Concordo totalmente)
            </p>
          )}
          {(field.value === "likert7" || value === "likert7") && (
            <p className="text-xs text-muted-foreground mt-2">
              Escala de 1 (Discordo totalmente) a 7 (Concordo totalmente)
            </p>
          )}
          {(field.value === "yes_no" || value === "yes_no") && (
            <p className="text-xs text-muted-foreground mt-2">
              Resposta binária: Sim ou Não
            </p>
          )}
          {(field.value === "frequency" || value === "frequency") && (
            <p className="text-xs text-muted-foreground mt-2">
              Frequência: Nunca, Raramente, Às vezes, Frequentemente, Sempre
            </p>
          )}
        </FormItem>
      )}
    />
  );
}
