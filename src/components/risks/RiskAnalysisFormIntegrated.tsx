
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
import { Button } from "@/components/ui/button";
import { useRiskMatrix } from "@/hooks/useRiskMatrix";
import { useRiskAssessments } from "@/hooks/useRiskAssessments";
import { useAuth } from "@/contexts/AuthContext";

export default function RiskAnalysisFormIntegrated() {
  const { userCompanies } = useAuth();
  const companyId = userCompanies && userCompanies.length > 0 ? userCompanies[0].companyId : undefined;
  
  const { riskMatrix, calculateRisk } = useRiskMatrix(companyId);
  const { createRiskAssessment } = useRiskAssessments(companyId);
  
  const [selectedSeverityIndex, setSelectedSeverityIndex] = useState(0);
  const [selectedProbabilityIndex, setSelectedProbabilityIndex] = useState(0);
  const [riskCalculation, setRiskCalculation] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (riskMatrix && selectedSeverityIndex >= 0 && selectedProbabilityIndex >= 0) {
      handleCalculateRisk();
    }
  }, [selectedSeverityIndex, selectedProbabilityIndex, riskMatrix]);

  const handleCalculateRisk = async () => {
    if (!riskMatrix) return;
    
    setLoading(true);
    try {
      const result = await calculateRisk.mutateAsync({
        severityIndex: selectedSeverityIndex,
        probabilityIndex: selectedProbabilityIndex
      });
      setRiskCalculation(result);
    } catch (error) {
      console.error('Error calculating risk:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAssessment = async () => {
    if (!riskCalculation || !companyId) return;

    try {
      await createRiskAssessment.mutateAsync({
        severity_index: selectedSeverityIndex,
        probability_index: selectedProbabilityIndex,
        risk_value: riskCalculation.risk_value,
        risk_level: riskCalculation.risk_level,
        recommended_action: riskCalculation.recommended_action,
        risk_factors: ['Análise Manual'],
        mitigation_actions: [],
        status: 'identified'
      });
    } catch (error) {
      console.error('Error saving risk assessment:', error);
    }
  };

  if (!riskMatrix) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-600">
          Nenhuma configuração de matriz de risco encontrada. 
          Por favor, configure a matriz de risco na aba de Configurações primeiro.
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
              {riskMatrix.row_labels.map((label, idx) => (
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
              {riskMatrix.col_labels.map((label, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {riskCalculation && (
        <Card>
          <CardContent className="p-4 mt-2">
            <div 
              className="p-4 rounded-md border"
              style={{ backgroundColor: riskCalculation.risk_color + "80" }}
            >
              <h3 className="font-bold mb-1">Nível de Risco Calculado</h3>
              <div className="text-xl font-bold mt-1">
                {riskCalculation.risk_level} ({riskCalculation.risk_value})
              </div>
              <div className="text-sm mt-1">
                <span className="font-medium">Ação recomendada:</span> {riskCalculation.recommended_action}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Calculado com base na matriz de risco configurada para sua empresa
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={handleSaveAssessment}
                  disabled={createRiskAssessment.isPending}
                  size="sm"
                >
                  {createRiskAssessment.isPending ? 'Salvando...' : 'Salvar Avaliação'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="text-center text-gray-500">
          Calculando nível de risco...
        </div>
      )}

      <div className="text-sm text-muted-foreground">
        <p>O nível de risco é calculado automaticamente com base na matriz configurada no sistema.</p>
        <p>Para alterar a matriz de risco, acesse a aba de Configurações &gt; Critérios de Avaliação &gt; Níveis de Risco.</p>
      </div>
    </div>
  );
}
