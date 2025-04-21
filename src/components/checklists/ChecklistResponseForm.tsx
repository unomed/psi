
import React, { useState } from "react";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { Button } from "@/components/ui/button";

interface ChecklistResponseFormProps {
  template: ChecklistTemplate;
  onSubmit: (result: Omit<ChecklistResult, "id" | "completedAt">) => void;
  onCancel?: () => void;
}

const PSICOSSOCIAL_LABELS = [
  "Nunca/Quase nunca",
  "Raramente",
  "Às vezes",
  "Frequentemente",
  "Sempre/Quase sempre",
];

export function ChecklistResponseForm({
  template,
  onSubmit,
  onCancel,
}: ChecklistResponseFormProps) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [employeeName, setEmployeeName] = useState("");

  // Define escala conforme tipo/escala
  let options: { value: number; label: string }[] = [];
  if (template.type === "disc" || template.scaleType === "likert") {
    options = [
      { value: 1, label: "1" },
      { value: 2, label: "2" },
      { value: 3, label: "3" },
      { value: 4, label: "4" },
      { value: 5, label: "5" },
    ];
  } else if (template.scaleType === "binary") {
    options = [
      { value: 0, label: "Não" },
      { value: 1, label: "Sim" },
    ];
  } else if (template.type === "custom" && template.scaleType === "psicossocial") {
    options = PSICOSSOCIAL_LABELS.map((label, idx) => ({
      value: idx + 1,
      label: `${idx + 1} - ${label}`,
    }));
  } else {
    // fallback padrão
    options = [
      { value: 1, label: "1" },
      { value: 2, label: "2" },
      { value: 3, label: "3" },
      { value: 4, label: "4" },
      { value: 5, label: "5" },
    ];
  }

  const handleChange = (qid: string, value: number) => {
    setResponses((prev) => ({ ...prev, [qid]: value }));
  };

  const allAnswered = template.questions.every(q => responses[q.id] !== undefined);
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;

    onSubmit({
      templateId: template.id,
      employeeName: employeeName.trim() || "Anônimo",
      results: {}, // Você pode calcular resultados aqui ou deixar para o backend
      dominantFactor: "D", // para DISC, calcular corretamente. Para outros, placeholder.
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleFormSubmit}>
      <div>
        <label className="font-semibold block mb-1">Nome do colaborador</label>
        <input
          className="w-full rounded border px-4 py-2"
          placeholder="Nome (opcional)"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
        />
      </div>
      {template.questions.map((question, idx) => (
        <div key={question.id} className="space-y-2">
          <p className="font-medium mb-2">{idx + 1}. {question.text}</p>
          <div className="flex flex-wrap gap-4">
            {options.map((opt) => (
              <label key={opt.value} className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name={`q_${question.id}`}
                  value={opt.value}
                  checked={responses[question.id] === opt.value}
                  onChange={() => handleChange(question.id, opt.value)}
                  className="accent-primary"
                  required
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-4 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={!allAnswered}>
          Enviar respostas
        </Button>
      </div>
    </form>
  );
}

