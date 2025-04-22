
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
      case ScaleType.Likert:
        return "Escala de 5 pontos: 1-Discordo totalmente, 2-Discordo, 3-Neutro, 4-Concordo, 5-Concordo totalmente";
      case ScaleType.YesNo:
        return "Resposta binária: Sim ou Não";
      case ScaleType.Agree3:
        return "Escala de 3 pontos: Discordo, Neutro, Concordo";
      case ScaleType.Frequency:
        return "Frequência: Nunca, Raramente, Às vezes, Frequentemente, Sempre";
      case ScaleType.Importance:
        return "Importância: Sem importância, Pouco importante, Importante, Muito importante, Extremamente importante";
      case ScaleType.Probability:
        return "Probabilidade: Muito improvável, Improvável, Possível, Provável, Muito provável";
      case ScaleType.Impact:
        return "Impacto: Sem impacto, Baixo impacto, Médio impacto, Alto impacto, Extremo impacto";
      case ScaleType.RiskLevel:
        return "Nível de risco: Insignificante, Baixo, Médio, Alto, Crítico";
      case ScaleType.Psicossocial:
        return "Psicossocial: 1-Nunca/Quase nunca, 2-Raramente, 3-Às vezes, 4-Frequentemente, 5-Sempre/Quase sempre";
      case ScaleType.Custom:
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
          <SelectItem value={ScaleType.Likert}>Likert (5 pontos)</SelectItem>
          <SelectItem value={ScaleType.YesNo}>Sim/Não</SelectItem>
          <SelectItem value={ScaleType.Agree3}>Concordo (3 pontos)</SelectItem>
          <SelectItem value={ScaleType.Frequency}>Frequência</SelectItem>
          <SelectItem value={ScaleType.Importance}>Importância</SelectItem>
          <SelectItem value={ScaleType.Probability}>Probabilidade</SelectItem>
          <SelectItem value={ScaleType.Impact}>Impacto</SelectItem>
          <SelectItem value={ScaleType.RiskLevel}>Nível de Risco</SelectItem>
          <SelectItem value={ScaleType.Psicossocial}>Psicossocial</SelectItem>
          <SelectItem value={ScaleType.Custom}>Personalizada</SelectItem>
        </SelectContent>
      </Select>
      <div className="text-sm text-muted-foreground">
        {getScaleDescription(value)}
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {value === ScaleType.Likert && (
          <>
            <Badge variant="outline" className="bg-gray-50">1 - Discordo totalmente</Badge>
            <Badge variant="outline" className="bg-gray-50">2 - Discordo</Badge>
            <Badge variant="outline" className="bg-gray-50">3 - Neutro</Badge>
            <Badge variant="outline" className="bg-gray-50">4 - Concordo</Badge>
            <Badge variant="outline" className="bg-gray-50">5 - Concordo totalmente</Badge>
          </>
        )}
        {value === ScaleType.YesNo && (
          <>
            <Badge variant="outline" className="bg-gray-50">Sim</Badge>
            <Badge variant="outline" className="bg-gray-50">Não</Badge>
          </>
        )}
        {value === ScaleType.Psicossocial && (
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
