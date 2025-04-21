
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface RiskAction {
  level: string;
  action: string;
  color: string;
}

interface MatrixConfig {
  size: number;
  rowLabels: string[];
  colLabels: string[];
  riskMatrix: number[][];
  riskActions: RiskAction[];
}

export default function RiskAnalysisForm() {
  const [matrixConfig, setMatrixConfig] = useState<MatrixConfig | null>(null);
  const [selectedSeverityIndex, setSelectedSeverityIndex] = useState(0);
  const [selectedProbabilityIndex, setSelectedProbabilityIndex] = useState(0);
  const [calculatedRiskValue, setCalculatedRiskValue] = useState(0);
  const [riskLevel, setRiskLevel] = useState("");
  const [riskAction, setRiskAction] = useState("");
  const [riskColor, setRiskColor] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar configuração da matriz do localStorage
    const loadMatrixConfig = () => {
      setLoading(true);
      try {
        const savedConfig = localStorage.getItem("riskMatrixConfig");
        if (savedConfig) {
          const config = JSON.parse(savedConfig);
          setMatrixConfig(config);
        } else {
          // Configuração padrão caso não exista
          const defaultConfig: MatrixConfig = {
            size: 3,
            rowLabels: ["Severidade 1", "Severidade 2", "Severidade 3"],
            colLabels: ["Probabilidade 1", "Probabilidade 2", "Probabilidade 3"],
            riskMatrix: [
              [1, 2, 3],
              [2, 4, 6],
              [3, 6, 9]
            ],
            riskActions: [
              { level: "Baixo", action: "Reter", color: "#F2FCE2" },
              { level: "Médio", action: "Mitigar", color: "#FEF7CD" },
              { level: "Alto", action: "Evitar", color: "#FEC6A1" },
              { level: "Altíssimo", action: "Evitar", color: "#FFB0B0" }
            ]
          };
          setMatrixConfig(defaultConfig);
        }
      } catch (error) {
        console.error("Erro ao carregar a configuração da matriz:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatrixConfig();
  }, []);

  useEffect(() => {
    if (matrixConfig) {
      calculateRiskLevel();
    }
  }, [selectedSeverityIndex, selectedProbabilityIndex, matrixConfig]);

  const calculateRiskLevel = () => {
    if (!matrixConfig) return;

    // Extrair a matriz de risco
    const matrix = matrixConfig.riskMatrix;
    
    // Verificar se os índices estão dentro dos limites
    if (
      selectedSeverityIndex >= 0 && 
      selectedSeverityIndex < matrix.length && 
      selectedProbabilityIndex >= 0 && 
      selectedProbabilityIndex < matrix[0]?.length
    ) {
      // Obter o valor de risco da célula selecionada
      const risk = matrix[selectedSeverityIndex][selectedProbabilityIndex];
      setCalculatedRiskValue(risk);
      
      // Determinar o nível de risco com base no valor
      const maxValue = matrixConfig.size * matrixConfig.size;
      let actionIndex = 0;
      
      // Classificar o nível com base no valor relativo ao máximo possível
      if (risk <= maxValue / 3) {
        actionIndex = 0; // Baixo
      } else if (risk <= (2 * maxValue) / 3) {
        actionIndex = 1; // Médio
      } else if (risk < maxValue) {
        actionIndex = 2; // Alto
      } else {
        actionIndex = 3; // Altíssimo
      }
      
      // Garantir que o índice exista no array de ações
      if (actionIndex < matrixConfig.riskActions.length) {
        const action = matrixConfig.riskActions[actionIndex];
        setRiskLevel(action.level);
        setRiskAction(action.action);
        setRiskColor(action.color);
      } else if (matrixConfig.riskActions.length > 0) {
        // Fallback para o último nível de risco disponível
        const lastAction = matrixConfig.riskActions[matrixConfig.riskActions.length - 1];
        setRiskLevel(lastAction.level);
        setRiskAction(lastAction.action);
        setRiskColor(lastAction.color);
      }
    }
  };

  if (loading) {
    return <div>Carregando configurações da matriz de risco...</div>;
  }

  if (!matrixConfig) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">
          Erro: Não foi possível carregar a configuração da matriz de risco. 
          Por favor, verifique as configurações na aba de Configurações.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="font-medium">Severidade</Label>
          <Select
            value={selectedSeverityIndex.toString()}
            onValueChange={(value) => setSelectedSeverityIndex(Number(value))}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Selecione a severidade" />
            </SelectTrigger>
            <SelectContent>
              {matrixConfig.rowLabels.map((label, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="font-medium">Probabilidade</Label>
          <Select
            value={selectedProbabilityIndex.toString()}
            onValueChange={(value) => setSelectedProbabilityIndex(Number(value))}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Selecione a probabilidade" />
            </SelectTrigger>
            <SelectContent>
              {matrixConfig.colLabels.map((label, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 mt-2">
          <div 
            className="p-4 rounded-md border"
            style={{ backgroundColor: riskColor + "80" }}
          >
            <h3 className="font-bold mb-1">Nível de Risco Calculado</h3>
            <div className="text-xl font-bold mt-1">
              {riskLevel} ({calculatedRiskValue})
            </div>
            <div className="text-sm mt-1">
              <span className="font-medium">Ação recomendada:</span> {riskAction}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Com base na matriz de risco configurada no sistema
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>O nível de risco é calculado com base na matriz definida na aba de Configurações.</p>
        <p>Para alterar a matriz de risco, acesse a aba de Configurações &gt; Critérios de Avaliação &gt; Níveis de Risco.</p>
      </div>
    </div>
  );
}
