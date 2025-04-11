
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScaleType } from "@/types/checklist";

interface ScaleTypeSelectorProps {
  value: ScaleType;
  onChange: (value: ScaleType) => void;
}

export function ScaleTypeSelector({ value, onChange }: ScaleTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="scale-type">Tipo de Escala</Label>
      <Select value={value} onValueChange={(val) => onChange(val as ScaleType)}>
        <SelectTrigger id="scale-type">
          <SelectValue placeholder="Selecione o tipo de escala" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="likert5">Likert (5 pontos)</SelectItem>
          <SelectItem value="yesno">Sim/Não</SelectItem>
          <SelectItem value="agree3">Concordo (3 pontos)</SelectItem>
          <SelectItem value="custom">Personalizada</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        {value === "likert5" && "Escala de 5 pontos: Discordo totalmente a Concordo totalmente"}
        {value === "yesno" && "Resposta binária: Sim ou Não"}
        {value === "agree3" && "Escala de 3 pontos: Discordo, Neutro, Concordo"}
        {value === "custom" && "Personalizada: Defina suas próprias opções"}
      </p>
    </div>
  );
}
