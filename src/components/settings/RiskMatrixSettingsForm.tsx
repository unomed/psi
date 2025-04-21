
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CirclePlus, Trash2 } from "lucide-react";

// Cores recomendadas para o risco em escala
const COLORS = [
  "#F2FCE2", // Verde (baixo)
  "#FEF7CD", // Amarelo (médio)
  "#FEC6A1", // Laranja (alto)
  "#FFB0B0", // Vermelho (altíssimo)
];

interface RiskAction {
  level: string;
  action: string;
  color: string;
}

const defaultRiskActions: RiskAction[] = [
  { level: "Baixo", action: "Reter", color: COLORS[0] },
  { level: "Médio", action: "Mitigar", color: COLORS[1] },
  { level: "Alto", action: "Evitar", color: COLORS[2] },
  { level: "Altíssimo", action: "Evitar", color: COLORS[3] },
];

export default function RiskMatrixSettingsForm() {
  const { toast } = useToast();
  const [size, setSize] = useState(3);
  const defaultLabels = (size: number, prefix: string) =>
    Array.from({ length: size }, (_, i) => `${prefix} ${i + 1}`);

  const [rowLabels, setRowLabels] = useState(defaultLabels(size, "Severidade"));
  const [colLabels, setColLabels] = useState(defaultLabels(size, "Probabilidade"));
  const [riskMatrix, setRiskMatrix] = useState<number[][]>([]);
  const [riskActions, setRiskActions] = useState<RiskAction[]>(defaultRiskActions);
  
  // Inicializa a matriz de risco ou carrega do localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("riskMatrixConfig");
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setSize(config.size);
      setRowLabels(config.rowLabels);
      setColLabels(config.colLabels);
      setRiskMatrix(config.riskMatrix);
      setRiskActions(config.riskActions);
    } else {
      // Cálculo inicial da matriz quando não há dados salvos
      initializeMatrix(size);
    }
  }, []);

  // Inicializa a matriz quando o tamanho muda
  useEffect(() => {
    initializeMatrix(size);
  }, [size]);

  const initializeMatrix = (matrixSize: number) => {
    setRowLabels(defaultLabels(matrixSize, "Severidade"));
    setColLabels(defaultLabels(matrixSize, "Probabilidade"));
    
    // Cria uma nova matriz baseada no tamanho
    const newMatrix = Array.from({ length: matrixSize }, (_, r) =>
      Array.from({ length: matrixSize }, (_, c) => calculateRiskValue(r, c, matrixSize))
    );
    setRiskMatrix(newMatrix);
  };

  const calculateRiskValue = (row: number, col: number, matrixSize: number) => {
    // Usa fórmula (r+1)*(c+1) para calcular o valor do risco
    return (row + 1) * (col + 1);
  };

  const handleRiskActionChange = (index: number, field: keyof RiskAction, value: string) => {
    const updatedActions = [...riskActions];
    updatedActions[index] = { ...updatedActions[index], [field]: value };
    setRiskActions(updatedActions);
  };

  const addRiskAction = () => {
    if (riskActions.length < 6) {
      setRiskActions([...riskActions, { level: "Novo Nível", action: "Nova Ação", color: COLORS[riskActions.length % COLORS.length] }]);
    }
  };

  const removeRiskAction = (index: number) => {
    if (riskActions.length > 1) {
      const newActions = [...riskActions];
      newActions.splice(index, 1);
      setRiskActions(newActions);
    }
  };

  const handleRowLabelChange = (index: number, value: string) => {
    const newLabels = [...rowLabels];
    newLabels[index] = value;
    setRowLabels(newLabels);
  };

  const handleColLabelChange = (index: number, value: string) => {
    const newLabels = [...colLabels];
    newLabels[index] = value;
    setColLabels(newLabels);
  };

  const handleCellValueChange = (row: number, col: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    const newMatrix = [...riskMatrix];
    newMatrix[row][col] = numValue;
    setRiskMatrix(newMatrix);
  };

  const handleSaveRiskMatrix = () => {
    // Salva no localStorage
    const matrixConfig = {
      size,
      rowLabels,
      colLabels,
      riskMatrix,
      riskActions,
    };
    localStorage.setItem("riskMatrixConfig", JSON.stringify(matrixConfig));
    
    toast({
      title: "Matriz de risco salva com sucesso",
      description: "As configurações foram atualizadas e serão aplicadas nas próximas análises.",
    });
  };

  const getCellColor = (value: number) => {
    const maxValue = size * size;
    
    if (value <= maxValue / 3) return COLORS[0];
    if (value <= (2 * maxValue) / 3) return COLORS[1];
    if (value < maxValue) return COLORS[2];
    return COLORS[3];
  };

  const getRiskLevel = (value: number) => {
    const maxValue = size * size;
    
    if (value <= maxValue / 3) return 0; // Baixo
    if (value <= (2 * maxValue) / 3) return 1; // Médio
    if (value < maxValue) return 2; // Alto
    return 3; // Altíssimo
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuração da Matriz de Risco</CardTitle>
          <CardDescription>
            Configure o tamanho, níveis e valores da matriz de risco utilizada nas análises
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="matrix-size">Tamanho da Matriz</Label>
            <Select
              value={size.toString()}
              onValueChange={(value) => setSize(Number(value))}
            >
              <SelectTrigger className="w-full md:w-40 mt-1">
                <SelectValue placeholder="Tamanho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3x3</SelectItem>
                <SelectItem value="4">4x4</SelectItem>
                <SelectItem value="5">5x5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Matriz de Risco</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 bg-gray-50"></th>
                    {colLabels.map((label, colIdx) => (
                      <th key={colIdx} className="border p-2 bg-gray-50">
                        <Input
                          value={label}
                          onChange={(e) => handleColLabelChange(colIdx, e.target.value)}
                          className="w-28 text-center"
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: size }).map((_, rowIdx) => (
                    <tr key={rowIdx}>
                      <th className="border p-2 bg-gray-50">
                        <Input
                          value={rowLabels[rowIdx]}
                          onChange={(e) => handleRowLabelChange(rowIdx, e.target.value)}
                          className="w-28 text-center"
                        />
                      </th>
                      {Array.from({ length: size }).map((_, colIdx) => {
                        const cellValue = riskMatrix[rowIdx]?.[colIdx] || calculateRiskValue(rowIdx, colIdx, size);
                        const cellColor = getCellColor(cellValue);
                        const levelIndex = getRiskLevel(cellValue);
                        const action = riskActions[levelIndex]?.action || "Indefinido";
                        
                        return (
                          <td key={colIdx} className="border p-3 text-center relative" style={{ backgroundColor: cellColor }}>
                            <Input 
                              type="number"
                              min="1"
                              className="w-16 text-center bg-transparent border-gray-300"
                              value={cellValue}
                              onChange={(e) => handleCellValueChange(rowIdx, colIdx, e.target.value)}
                            />
                            <div className="text-xs mt-1 font-medium">{action}</div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Os valores nas células indicam o nível de risco. Edite-os conforme necessário.
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Definir ações por faixa de risco</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addRiskAction}
                disabled={riskActions.length >= 6}
              >
                <CirclePlus className="h-4 w-4 mr-1" />
                Adicionar Nível
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskActions.map((action, index) => (
                <div key={index} className="border p-3 rounded-md relative" style={{ backgroundColor: action.color + "80" }}>
                  <div className="absolute top-2 right-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeRiskAction(index)}
                      disabled={riskActions.length <= 1}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <div>
                      <Label>Nome do Nível</Label>
                      <Input 
                        value={action.level}
                        onChange={(e) => handleRiskActionChange(index, "level", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Ação Recomendada</Label>
                      <Input 
                        value={action.action}
                        onChange={(e) => handleRiskActionChange(index, "action", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveRiskMatrix}>Salvar Matriz de Risco</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
