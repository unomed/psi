
import React, { useState } from "react";

// Cores recomendadas para o risco, em escala (verde, amarelo, laranja, vermelho)
const COLORS = [
  "#F2FCE2", // Verde (baixo)
  "#FEF7CD", // Amarelo (médio)
  "#FEC6A1", // Laranja (alto)
  "#FFB0B0", // Vermelho (altíssimo)
];

// Função auxiliar para calcular o nível de risco (produto dos índices, pode ser customizado)
function calculateRiskValue(row: number, col: number) {
  return (row + 1) * (col + 1);
}

function getCellColor(value: number, max: number) {
  // Divide em 3/4 faixas de cor conforme valor
  if (value <= max / 3) return COLORS[0];
  if (value <= (2 * max) / 3) return COLORS[1];
  if (value < max) return COLORS[2];
  return COLORS[3];
}

const defaultLabels = (size: number, prefix: string) =>
  Array.from({ length: size }, (_, i) => `${prefix} ${i + 1}`);

interface RiskMatrixEditorProps {
  initialSize?: number;
}

export default function RiskMatrixEditor({ initialSize = 3 }: RiskMatrixEditorProps) {
  const [size, setSize] = useState(initialSize);

  // Linhas: Severidade, Colunas: Probabilidade, Células: Nível de Risco
  const [rowLabels, setRowLabels] = useState(defaultLabels(size, "Severidade"));
  const [colLabels, setColLabels] = useState(defaultLabels(size, "Probabilidade"));

  // Matriz de valores customizáveis (cada célula pode ser editada)
  const [riskMatrix, setRiskMatrix] = useState(
    Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => calculateRiskValue(r, c))
    )
  );

  // Atualiza tamanho da matriz
  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setRowLabels(defaultLabels(newSize, "Severidade"));
    setColLabels(defaultLabels(newSize, "Probabilidade"));
    setRiskMatrix(
      Array.from({ length: newSize }, (_, r) =>
        Array.from({ length: newSize }, (_, c) => calculateRiskValue(r, c))
      )
    );
  };

  // Atualiza texto dos labels
  const handleRowLabelChange = (idx: number, text: string) => {
    const next = [...rowLabels];
    next[idx] = text;
    setRowLabels(next);
  };
  const handleColLabelChange = (idx: number, text: string) => {
    const next = [...colLabels];
    next[idx] = text;
    setColLabels(next);
  };

  // Atualiza célula da matriz
  const handleMatrixValueChange = (rowIdx: number, colIdx: number, value: number) => {
    const newMatrix = riskMatrix.map((row, r) =>
      row.map((cell, c) => (r === rowIdx && c === colIdx ? value : cell))
    );
    setRiskMatrix(newMatrix);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 p-4 bg-white rounded-lg border shadow">
      <div className="flex items-end gap-4 mb-3">
        <label className="font-semibold text-gray-700">Tamanho da Matriz:</label>
        <select
          className="border rounded px-2 py-1"
          value={size}
          onChange={e => handleSizeChange(Number(e.target.value))}
        >
          <option value={3}>3x3</option>
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
        </select>
      </div>

      {/* Cabeçalho da Matriz */}
      <div className="overflow-x-auto">
        <table className="border-collapse w-full min-w-[500px]">
          <thead>
            <tr>
              <th></th>
              {colLabels.map((label, idx) => (
                <th key={idx}>
                  <input
                    type="text"
                    value={label}
                    onChange={e => handleColLabelChange(idx, e.target.value)}
                    className="w-32 p-1 text-sm border rounded text-center font-semibold bg-gray-50"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {riskMatrix.map((row, rIdx) => (
              <tr key={rIdx}>
                <th>
                  <input
                    type="text"
                    value={rowLabels[rIdx]}
                    onChange={e => handleRowLabelChange(rIdx, e.target.value)}
                    className="w-28 p-1 text-sm border rounded text-center font-semibold bg-gray-50"
                  />
                </th>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-1">
                    <input
                      type="number"
                      value={cell}
                      min={1}
                      onChange={e =>
                        handleMatrixValueChange(rIdx, cIdx, Number(e.target.value))
                      }
                      className="w-16 text-center font-semibold p-2 border rounded"
                      style={{
                        background: getCellColor(cell, size * size),
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
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Edite as etiquetas e valores conforme deseja para os Níveis de Probabilidade, Níveis de Severidade e Níveis de Risco.
      </div>
    </div>
  );
}
