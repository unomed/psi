
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import RiskMatrixConfigurator from "@/components/risks/RiskMatrixConfigurator";
import { useToast } from "@/hooks/use-toast";

// Cores recomendadas para o risco, em escala (verde, amarelo, laranja, vermelho)
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

  const calculateRiskValue = (row: number, col: number) => (row + 1) * (col + 1);

  const [rowLabels, setRowLabels] = useState(defaultLabels(size, "Severidade"));
  const [colLabels, setColLabels] = useState(defaultLabels(size, "Probabilidade"));
  const [riskMatrix, setRiskMatrix] = useState(
    Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => calculateRiskValue(r, c))
    )
  );
  const [riskActions, setRiskActions] = useState<RiskAction[]>(defaultRiskActions);

  // Quando o tamanho da matriz muda, resetamos os labels e valores da matriz
  useEffect(() => {
    setRowLabels(defaultLabels(size, "Severidade"));
    setColLabels(defaultLabels(size, "Probabilidade"));
    setRiskMatrix(
      Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => calculateRiskValue(r, c))
      )
    );
  }, [size]);

  const handleSaveRiskMatrix = () => {
    // Aqui seria salvo no banco de dados.
    // Por enquanto, vamos apenas salvar no localStorage
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
      description: "As configurações foram atualizadas e serão aplicadas nas novas análises.",
    });
  };

  const handleRiskActionChange = (index: number, field: keyof RiskAction, value: string) => {
    const updatedActions = [...riskActions];
    updatedActions[index] = { ...updatedActions[index], [field]: value };
    setRiskActions(updatedActions);
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

          <div>
            <h3 className="text-lg font-medium mb-4">Configurar níveis de risco</h3>
            <RiskMatrixConfigurator
              size={size}
              rowLabels={rowLabels}
              colLabels={colLabels}
              riskMatrix={riskMatrix}
              onRowLabelsChange={setRowLabels}
              onColLabelsChange={setColLabels}
              onRiskMatrixChange={setRiskMatrix}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Definir ações por faixa de risco</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskActions.map((action, index) => (
                <div key={index} className="border p-3 rounded-md" style={{ backgroundColor: action.color + "80" }}>
                  <div className="grid grid-cols-1 gap-2">
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
                    {/* Cor é fixa pelo índice, mas poderia ser configurável também */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveRiskMatrix}>Salvar Matriz de Risco</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
