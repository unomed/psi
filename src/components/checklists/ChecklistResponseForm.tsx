
import React, { useState } from "react";
import { ChecklistTemplate, ChecklistResult } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { DiscFactorType, ScaleType } from "@/types";

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

// Exemplo de estrutura para perguntas psicossociais com categorias
interface PsicossocialCategory {
  name: string;
  questions: { id: string; text: string }[];
}

// Mock para exibir perguntas psicossociais
const PSICOSSOCIAL_CATEGORIES: PsicossocialCategory[] = [
  {
    name: "Demandas de Trabalho",
    questions: [
      { id: "1", text: "Tenho tempo suficiente para realizar minhas tarefas diárias" },
      { id: "2", text: "O volume de trabalho é adequado para o tempo disponível" },
      { id: "3", text: "Preciso trabalhar muito rapidamente para cumprir meus prazos" },
      { id: "4", text: "Consigo fazer pausas quando necessário" },
      { id: "5", text: "Sinto-me pressionado pelas metas e indicadores de desempenho" },
    ],
  },
  // ...adicione as outras categorias seguindo o mesmo padrão (veja exemplo abaixo)
  {
    name: "Controle e Autonomia",
    questions: [
      { id: "6", text: "Tenho liberdade para decidir como realizar meu trabalho" },
      { id: "7", text: "Posso influenciar decisões importantes relacionadas ao meu trabalho" },
      { id: "8", text: "Minhas sugestões de melhorias são consideradas" },
      { id: "9", text: "Tenho flexibilidade para organizar meu próprio tempo" },
      { id: "10", text: "Minhas atividades são excessivamente controladas ou monitoradas" },
    ],
  },
  // Demais categorias...
];

export function ChecklistResponseForm({
  template,
  onSubmit,
  onCancel,
}: ChecklistResponseFormProps) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [employeeName, setEmployeeName] = useState("");

  let options: { value: number; label: string }[] = [];

  if (template.type === "disc" || template.scaleType === ScaleType.Likert) {
    options = [
      { value: 1, label: "1" },
      { value: 2, label: "2" },
      { value: 3, label: "3" },
      { value: 4, label: "4" },
      { value: 5, label: "5" },
    ];
  } else if (template.scaleType === ScaleType.YesNo) {
    options = [
      { value: 0, label: "Não" },
      { value: 1, label: "Sim" },
    ];
  } else if (template.scaleType === ScaleType.Psicossocial) {
    options = PSICOSSOCIAL_LABELS.map((label, idx) => ({
      value: idx + 1,
      label: `${idx + 1} - ${label}`,
    }));
  } else {
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

  let questionList = template.questions.map(q => ({ ...q, category: "" }));
  // Montar perguntas por categoria se for psicossocial
  if (template.scaleType === ScaleType.Psicossocial) {
    // Monta pergunta por categorias (fixa para demo, depois pode ser flexível)
    questionList = PSICOSSOCIAL_CATEGORIES.flatMap(category => 
      category.questions.map(q => ({
        ...q,
        category: category.name
      }))
    );
  }

  const allAnswered = questionList.every(q => responses[q.id] !== undefined);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;

    const discResults = 
      template.type === "disc"
      ? { D: 0, I: 0, S: 0, C: 0 }
      : undefined;

    onSubmit({
      templateId: template.id,
      employeeName: employeeName.trim() || "Anônimo",
      // Só envia results DISC se for checklist DISC
      results: discResults || { D: 0, I: 0, S: 0, C: 0 },
      dominantFactor: DiscFactorType.D,
      // Para psicossocial/personalizado, resultado real deve ser calculado conforme regras
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
      {template.scaleType === ScaleType.Psicossocial ? (
        // Exibe categorias, perguntas e opções psicossociais
        PSICOSSOCIAL_CATEGORIES.map((cat, cIdx) => (
          <div key={cat.name} className="mb-4 border rounded-lg p-4">
            <div className="font-semibold mb-2">{cat.name}</div>
            {cat.questions.map((q, qIdx) => (
              <div key={q.id} className="mb-2">
                <p className="font-medium">{qIdx + 1 + cIdx * 5}. {q.text}</p>
                <div className="flex flex-wrap gap-3 mt-1">
                  {options.map((opt) => (
                    <label key={opt.value} className="inline-flex items-center gap-1">
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={opt.value}
                        checked={responses[q.id] === opt.value}
                        onChange={() => handleChange(q.id, opt.value)}
                        className="accent-primary"
                        required
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        template.questions.map((question, idx) => (
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
        ))
      )}
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
