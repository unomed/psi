
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScaleType } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ScaleTypeSelectorProps {
  value: ScaleType;
  onChange: (value: ScaleType) => void;
  disabled?: boolean;
}

export function ScaleTypeSelector({ 
  value, 
  onChange,
  disabled = false
}: ScaleTypeSelectorProps) {
  const getScaleDescription = (scaleType: ScaleType) => {
    switch(scaleType) {
      case ScaleType.LIKERT_5:
        return "Escala de 5 pontos: 1-Discordo totalmente, 2-Discordo, 3-Neutro, 4-Concordo, 5-Concordo totalmente";
      case ScaleType.YES_NO:
        return "Resposta binária: Sim ou Não";
      case ScaleType.BINARY:
        return "Escala de 3 pontos: Discordo, Neutro, Concordo";
      case ScaleType.PSICOSSOCIAL:
        return "Psicossocial: 1-Nunca/Quase nunca, 2-Raramente, 3-Às vezes, 4-Frequentemente, 5-Sempre/Quase sempre";
      case ScaleType.CUSTOM:
        return "Personalizada: Defina suas próprias opções";
      default:
        return "Selecione um tipo de escala";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="scale-type">Tipo de Escala</Label>
      <Select 
        value={value} 
        onValueChange={(val) => onChange(val as ScaleType)}
        disabled={disabled}
      >
        <SelectTrigger id="scale-type">
          <SelectValue placeholder="Selecione o tipo de escala" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ScaleType.LIKERT_5}>Likert (5 pontos)</SelectItem>
          <SelectItem value={ScaleType.YES_NO}>Sim/Não</SelectItem>
          <SelectItem value={ScaleType.BINARY}>Binário</SelectItem>
          <SelectItem value={ScaleType.PSICOSSOCIAL}>Psicossocial</SelectItem>
          <SelectItem value={ScaleType.CUSTOM}>Personalizada</SelectItem>
        </SelectContent>
      </Select>
      <div className="text-sm text-muted-foreground">
        {getScaleDescription(value)}
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {value === ScaleType.LIKERT_5 && (
          <>
            <Badge variant="outline" className="bg-gray-50">1 - Discordo totalmente</Badge>
            <Badge variant="outline" className="bg-gray-50">2 - Discordo</Badge>
            <Badge variant="outline" className="bg-gray-50">3 - Neutro</Badge>
            <Badge variant="outline" className="bg-gray-50">4 - Concordo</Badge>
            <Badge variant="outline" className="bg-gray-50">5 - Concordo totalmente</Badge>
          </>
        )}
        {value === ScaleType.YES_NO && (
          <>
            <Badge variant="outline" className="bg-gray-50">Sim</Badge>
            <Badge variant="outline" className="bg-gray-50">Não</Badge>
          </>
        )}
        {value === ScaleType.PSICOSSOCIAL && (
          <>
            <Badge variant="outline" className="bg-purple-50">1 - Nunca/Quase nunca</Badge>
            <Badge variant="outline" className="bg-purple-50">2 - Raramente</Badge>
            <Badge variant="outline" className="bg-purple-50">3 - Às vezes</Badge>
            <Badge variant="outline" className="bg-purple-50">4 - Frequentemente</Badge>
            <Badge variant="outline" className="bg-purple-50">5 - Sempre/Quase sempre</Badge>
          </>
        )}
      </div>
    </div>
  );
}
