
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CirclePlus, 
  Trash2, 
  Info, 
  Eye, 
  Settings2,
  RefreshCw,
  CheckCircle2
} from "lucide-react";
import { useRiskMatrix } from "@/hooks/useRiskMatrix";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const COLORS = [
  "#E8F5E8", // Verde claro (baixo)
  "#FFF3CD", // Amarelo claro (médio)
  "#FFE4CC", // Laranja claro (alto)
  "#FFCDD2", // Vermelho claro (altíssimo)
];

const BORDER_COLORS = [
  "#4CAF50", // Verde (baixo)
  "#FF9800", // Amarelo (médio)
  "#FF5722", // Laranja (alto)
  "#F44336", // Vermelho (altíssimo)
];

const defaultRiskActions = [
  { level: "Baixo", action: "Reter", color: COLORS[0] },
  { level: "Médio", action: "Mitigar", color: COLORS[1] },
  { level: "Alto", action: "Evitar", color: COLORS[2] },
  { level: "Crítico", action: "Eliminar", color: COLORS[3] },
];

export default function RiskMatrixSettingsFormIntegrated() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;
  
  const { riskMatrix, isLoading, saveRiskMatrix, migrateFromLocalStorage } = useRiskMatrix(companyId);
  
  const [size, setSize] = useState(3);
  const [rowLabels, setRowLabels] = useState<string[]>([]);
  const [colLabels, setColLabels] = useState<string[]>([]);
  const [riskMatrixData, setRiskMatrixData] = useState<number[][]>([]);
  const [riskActions, setRiskActions] = useState(defaultRiskActions);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const defaultLabels = (size: number, prefix: string) =>
    Array.from({ length: size }, (_, i) => `${prefix} ${i + 1}`);

  const calculateRiskValue = (row: number, col: number) => {
    return (row + 1) * (col + 1);
  };

  const initializeMatrix = (matrixSize: number) => {
    setSize(matrixSize);
    setRowLabels(defaultLabels(matrixSize, "Impacto"));
    setColLabels(defaultLabels(matrixSize, "Probabilidade"));
    
    const newMatrix = Array.from({ length: matrixSize }, (_, r) =>
      Array.from({ length: matrixSize }, (_, c) => calculateRiskValue(r, c))
    );
    setRiskMatrixData(newMatrix);
    setHasUnsavedChanges(true);
  };

  // Inicializar com dados do banco ou valores padrão
  useEffect(() => {
    if (riskMatrix) {
      setSize(riskMatrix.matrix_size);
      setRowLabels(riskMatrix.row_labels);
      setColLabels(riskMatrix.col_labels);
      setRiskMatrixData(riskMatrix.risk_matrix);
      setRiskActions(riskMatrix.risk_actions);
      setHasUnsavedChanges(false);
    } else if (!isLoading) {
      migrateFromLocalStorage.mutate();
      initializeMatrix(3);
    }
  }, [riskMatrix, isLoading]);

  useEffect(() => {
    if (!riskMatrix) {
      initializeMatrix(size);
    }
  }, [size, riskMatrix]);

  const handleSaveRiskMatrix = () => {
    saveRiskMatrix.mutate({
      matrix_size: size,
      row_labels: rowLabels,
      col_labels: colLabels,
      risk_matrix: riskMatrixData,
      risk_actions: riskActions,
    }, {
      onSuccess: () => {
        setHasUnsavedChanges(false);
        toast.success("Matriz de risco salva com sucesso!");
      }
    });
  };

  const getCellColor = (value: number) => {
    const maxValue = size * size;
    
    if (value <= maxValue / 4) return COLORS[0];
    if (value <= maxValue / 2) return COLORS[1];
    if (value <= (3 * maxValue) / 4) return COLORS[2];
    return COLORS[3];
  };

  const getCellBorderColor = (value: number) => {
    const maxValue = size * size;
    
    if (value <= maxValue / 4) return BORDER_COLORS[0];
    if (value <= maxValue / 2) return BORDER_COLORS[1];
    if (value <= (3 * maxValue) / 4) return BORDER_COLORS[2];
    return BORDER_COLORS[3];
  };

  const getRiskLevel = (value: number) => {
    const maxValue = size * size;
    
    if (value <= maxValue / 4) return 0;
    if (value <= maxValue / 2) return 1;
    if (value <= (3 * maxValue) / 4) return 2;
    return 3;
  };

  const handleRiskActionChange = (index: number, field: 'level' | 'action' | 'color', value: string) => {
    const updatedActions = [...riskActions];
    updatedActions[index] = { ...updatedActions[index], [field]: value };
    setRiskActions(updatedActions);
    setHasUnsavedChanges(true);
  };

  const addRiskAction = () => {
    if (riskActions.length < 6) {
      setRiskActions([...riskActions, { 
        level: "Novo Nível", 
        action: "Nova Ação", 
        color: COLORS[riskActions.length % COLORS.length] 
      }]);
      setHasUnsavedChanges(true);
    }
  };

  const removeRiskAction = (index: number) => {
    if (riskActions.length > 1) {
      const newActions = [...riskActions];
      newActions.splice(index, 1);
      setRiskActions(newActions);
      setHasUnsavedChanges(true);
    }
  };

  const handleRowLabelChange = (index: number, value: string) => {
    const newLabels = [...rowLabels];
    newLabels[index] = value;
    setRowLabels(newLabels);
    setHasUnsavedChanges(true);
  };

  const handleColLabelChange = (index: number, value: string) => {
    const newLabels = [...colLabels];
    newLabels[index] = value;
    setColLabels(newLabels);
    setHasUnsavedChanges(true);
  };

  const handleCellValueChange = (row: number, col: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    const newMatrix = [...riskMatrixData];
    newMatrix[row][col] = numValue;
    setRiskMatrixData(newMatrix);
    setHasUnsavedChanges(true);
  };

  const resetToDefaults = () => {
    initializeMatrix(size);
    setRiskActions(defaultRiskActions);
    toast.info("Matriz resetada para valores padrão");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Configuração da Matriz de Risco
                {hasUnsavedChanges && (
                  <Badge variant="outline" className="ml-2">
                    Alterações não salvas
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Configure o tamanho, níveis e valores da matriz de risco utilizada nas análises
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div title={previewMode ? 'Sair do modo preview' : 'Visualizar matriz'}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <div title="Resetar para valores padrão">
                <Button variant="outline" size="sm" onClick={resetToDefaults}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuração de Tamanho */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="matrix-size" className="flex items-center gap-2">
                Tamanho da Matriz
                <div title="Escolha entre matrizes 3x3, 4x4 ou 5x5">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </Label>
              <Select
                value={size.toString()}
                onValueChange={(value) => {
                  setSize(Number(value));
                  setHasUnsavedChanges(true);
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tamanho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3x3 (Simples)</SelectItem>
                  <SelectItem value="4">4x4 (Padrão)</SelectItem>
                  <SelectItem value="5">5x5 (Detalhada)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Dimensão atual: <Badge variant="secondary">{size}x{size}</Badge></p>
              <p>Total de células: <Badge variant="secondary">{size * size}</Badge></p>
            </div>
          </div>

          <Separator />

          {/* Matriz de Risco */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Matriz de Risco</h3>
              <div title="Defina os rótulos das linhas (Impacto) e colunas (Probabilidade). Os valores nas células representam o nível de risco calculado">
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <div className="min-w-fit">
                <table className="w-full border-separate border-spacing-1">
                  <thead>
                    <tr>
                      <th className="w-32 p-2"></th>
                      <th colSpan={size} className="text-center p-2 text-sm font-medium text-muted-foreground">
                        Probabilidade →
                      </th>
                    </tr>
                    <tr>
                      <th className="w-32 p-2"></th>
                      {colLabels.map((label, colIdx) => (
                        <th key={colIdx} className="p-2">
                          <Input
                            value={label}
                            onChange={(e) => handleColLabelChange(colIdx, e.target.value)}
                            className="w-28 text-center text-xs font-medium"
                            placeholder={`Prob. ${colIdx + 1}`}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-sm font-medium text-muted-foreground text-center" 
                          style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>
                        Impacto ↓
                      </td>
                      <td colSpan={size}></td>
                    </tr>
                    {Array.from({ length: size }).map((_, rowIdx) => (
                      <tr key={rowIdx}>
                        <th className="p-2">
                          <Input
                            value={rowLabels[rowIdx]}
                            onChange={(e) => handleRowLabelChange(rowIdx, e.target.value)}
                            className="w-28 text-center text-xs font-medium"
                            placeholder={`Impacto ${rowIdx + 1}`}
                          />
                        </th>
                        {Array.from({ length: size }).map((_, colIdx) => {
                          const cellValue = riskMatrixData[rowIdx]?.[colIdx] || calculateRiskValue(rowIdx, colIdx);
                          const cellColor = getCellColor(cellValue);
                          const borderColor = getCellBorderColor(cellValue);
                          const levelIndex = getRiskLevel(cellValue);
                          const action = riskActions[levelIndex]?.action || "Indefinido";
                          const level = riskActions[levelIndex]?.level || "Indefinido";
                          
                          return (
                            <td key={colIdx} className="p-1">
                              <div 
                                className="relative rounded-lg border-2 p-3 transition-all hover:shadow-md"
                                style={{ 
                                  backgroundColor: cellColor,
                                  borderColor: borderColor
                                }}
                                title={`Risco: ${cellValue}, Nível: ${level}, Ação: ${action}, Posição: ${rowLabels[rowIdx]} × ${colLabels[colIdx]}`}
                              >
                                <Input 
                                  type="number"
                                  min="1"
                                  className="w-16 text-center bg-transparent border-none p-0 font-bold text-sm"
                                  value={cellValue}
                                  onChange={(e) => handleCellValueChange(rowIdx, colIdx, e.target.value)}
                                />
                                <div className="text-xs mt-1 font-medium text-center truncate">
                                  {action}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Separator />

          {/* Ações por Nível de Risco */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Ações por Nível de Risco</h3>
                <div title="Configure as ações recomendadas para cada faixa de risco">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
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
                <Card key={index} className="relative">
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                    style={{ backgroundColor: action.color }}
                  />
                  <CardContent className="pt-4 pb-3">
                    {riskActions.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeRiskAction(index)}
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                    
                    <div className="space-y-3 mt-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">Nome do Nível</Label>
                        <Input 
                          value={action.level}
                          onChange={(e) => handleRiskActionChange(index, "level", e.target.value)}
                          className="mt-1"
                          placeholder="Ex: Alto"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Ação Recomendada</Label>
                        <Input 
                          value={action.action}
                          onChange={(e) => handleRiskActionChange(index, "action", e.target.value)}
                          className="mt-1"
                          placeholder="Ex: Mitigar"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {hasUnsavedChanges ? (
              <span className="flex items-center gap-1 text-amber-600">
                <Info className="h-4 w-4" />
                Você tem alterações não salvas
              </span>
            ) : (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Todas as alterações foram salvas
              </span>
            )}
          </div>
          <Button 
            onClick={handleSaveRiskMatrix}
            disabled={saveRiskMatrix.isPending || !hasUnsavedChanges}
            className="min-w-32"
          >
            {saveRiskMatrix.isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Salvar Matriz
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
