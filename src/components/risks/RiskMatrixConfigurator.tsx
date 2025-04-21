
import React, { useState } from "react";

const COLORS = [
  "#F2FCE2", // Verde (baixo)
  "#FEF7CD", // Amarelo (médio)
  "#FEC6A1", // Laranja (alto)
  "#FFB0B0", // Vermelho (altíssimo)
];

function calculateRiskValue(row: number, col: number) {
  return (row + 1) * (col + 1);
}

function getCellColor(value: number, max: number) {
  if (value <= max / 3) return COLORS[0];
  if (value <= (2 * max) / 3) return COLORS[1];
  if (value < max) return COLORS[2];
  return COLORS[3];
}

const defaultLabels = (size: number, prefix: string) =>
  Array.from({ length: size }, (_, i) => `${prefix} ${i + 1}`);

interface RiskMatrixConfiguratorProps {
  size: number;
  rowLabels: string[];
  colLabels: string[];
  riskMatrix: number[][];
  onRowLabelsChange: (labels: string[]) => void;
  onColLabelsChange: (labels: string[]) => void;
  onRiskMatrixChange: (matrix: number[][]) => void;
}

export default function RiskMatrixConfigurator({
  size,
  rowLabels,
  colLabels,
  riskMatrix,
  onRowLabelsChange,
  onColLabelsChange,
  onRiskMatrixChange,
}: RiskMatrixConfiguratorProps) {
  const handleRowLabelChange = (idx: number, text: string) => {
    const next = [...rowLabels];
    next[idx] = text;
    onRowLabelsChange(next);
  };

  const handleColLabelChange = (idx: number, text: string) => {
    const next = [...colLabels];
    next[idx] = text;
    onColLabelsChange(next);
  };

  const handleCellValueChange = (rowIdx: number, colIdx: number, value: number) => {
    const newMatrix = riskMatrix.map((row, r) =>
      row.map((cell, c) => (r === rowIdx && c === colIdx ? value : cell))
    );
    onRiskMatrixChange(newMatrix);
  };

  const maxValue = size * size;

  return (
    <div className="overflow-x-auto max-w-full">
      <table className="border-collapse w-full min-w-[350px]">
        <thead>
          <tr>
            <th></th>
            {colLabels.map((label, idx) => (
              <th key={idx} className="p-1 border border-gray-300">
                <input
                  type="text"
                  value={label}
                  onChange={e => handleColLabelChange(idx, e.target.value)}
                  className="w-28 p-1 text-xs border rounded text-center font-semibold bg-gray-50"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {riskMatrix.map((row, rIdx) => (
            <tr key={rIdx}>
              <th className="p-1 border border-gray-300">
                <input
                  type="text"
                  value={rowLabels[rIdx]}
                  onChange={e => handleRowLabelChange(rIdx, e.target.value)}
                  className="w-28 p-1 text-xs border rounded text-center font-semibold bg-gray-50"
                />
              </th>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="p-1 border border-gray-300">
                  <input
                    type="number"
                    value={cell}
                    min={1}
                    max={maxValue}
                    onChange={e =>
                      handleCellValueChange(rIdx, cIdx, Number(e.target.value))
                    }
                    className="w-16 text-center font-semibold p-1 border rounded"
                    style={{
                      background: getCellColor(cell, maxValue),
                      transition: "background 0.2s",
                      color: "#222",
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-sm text-gray-500">
        Edite os níveis e valores para definir os Níveis de Severidade, Probabilidade e Risco.
      </p>
    </div>
  );
}
