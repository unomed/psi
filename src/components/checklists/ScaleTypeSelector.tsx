
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScaleType, SCALE_TYPES } from "@/types"; // ✅ Import correto
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
      case 'likert_5': // ✅ String literal
        return "Escala de 5 pontos: 1-Discordo totalmente, 2-Discordo, 3-Neutro, 4-Concordo, 5-Concordo totalmente";
      case 'yes_no': // ✅ String literal
        return "Resposta binária: Sim ou Não";
      case 'binary': // ✅ String literal
        return "Escala de 3 pontos: Discordo, Neutro, Concordo";
      case 'psicossocial': // ✅ String literal
        return "Psicossocial: 1-Nunca/Quase nunca, 2-Raramente, 3-Às vezes, 4-Frequentemente, 5-Sempre/Quase sempre";
      case 'custom': // ✅ String literal
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
          <SelectItem value="likert_5">Likert (5 pontos)</SelectItem>
          <SelectItem value="yes_no">Sim/Não</SelectItem>
          <SelectItem value="binary">Binário</SelectItem>
          <SelectItem value="psicossocial">Psicossocial</SelectItem>
          <SelectItem value="custom">Personalizada</SelectItem>
        </SelectContent>
      </Select>
      <div className="text-sm text-muted-foreground">
        {getScaleDescription(value)}
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {value === 'likert_5' && ( // ✅ String literal
          <>
            <Badge variant="outline" className="bg-gray-50">1 - Discordo totalmente</Badge>
            <Badge variant="outline" className="bg-gray-50">2 - Discordo</Badge>
            <Badge variant="outline" className="bg-gray-50">3 - Neutro</Badge>
            <Badge variant="outline" className="bg-gray-50">4 - Concordo</Badge>
            <Badge variant="outline" className="bg-gray-50">5 - Concordo totalmente</Badge>
          </>
        )}
        {value === 'yes_no' && ( // ✅ String literal
          <>
            <Badge variant="outline" className="bg-gray-50">Sim</Badge>
            <Badge variant="outline" className="bg-gray-50">Não</Badge>
          </>
        )}
        {value === 'psicossocial' && ( // ✅ String literal
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
