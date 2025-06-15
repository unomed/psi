
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChecklistTemplate, PsicossocialQuestion } from "@/types/checklist";
import { DiscFactorType, ScaleType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar } from "lucide-react";

interface TemplatePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: ChecklistTemplate | null;
}

const PSICOSSOCIAL_LABELS = [
  "Nunca/Quase nunca",
  "Raramente", 
  "Às vezes",
  "Frequentemente",
  "Sempre/Quase sempre",
];

export function TemplatePreviewDialog({
  isOpen,
  onClose,
  template
}: TemplatePreviewDialogProps) {
  if (!template) return null;

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

  let questionList: PsicossocialQuestion[] | any[] = [];
  if (template.scaleType === ScaleType.Psicossocial || template.type === "psicossocial") {
    questionList = (template.questions as PsicossocialQuestion[]);
  } else {
    questionList = template.questions;
  }

  const getTemplateTypeDisplay = () => {
    if (template.type === "disc") return "DISC";
    if (template.type === "psicossocial") return "Psicossocial";
    return "Personalizado";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview do Template: {template.title}
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <div>
              Esta é uma visualização do checklist que será apresentado aos funcionários.
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{getTemplateTypeDisplay()}</Badge>
              <span className="text-sm text-muted-foreground">
                {template.questions.length} questões
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Campo Nome do Funcionário (preview) */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="font-semibold block mb-2">Nome do colaborador</label>
            <input
              className="w-full rounded border px-4 py-2 bg-white"
              placeholder="Nome (opcional)"
              disabled
              value="[Nome do funcionário será preenchido aqui]"
            />
          </div>

          {/* Questões organizadas por categoria ou sequencialmente */}
          {template.scaleType === ScaleType.Psicossocial || template.type === "psicossocial" ? (
            [...new Set(questionList.map(q => q.category))].map((cat, cIdx) => (
              <div key={cat} className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold mb-4 text-lg">{cat}</div>
                {questionList.filter(q => q.category === cat).map((q, qIdx) => (
                  <div key={q.id} className="mb-4 last:mb-0">
                    <p className="font-medium mb-3">{q.text}</p>
                    <div className="flex flex-wrap gap-3">
                      {options.map((opt) => (
                        <label key={opt.value} className="inline-flex items-center gap-2 opacity-60">
                          <input
                            type="radio"
                            disabled
                            className="accent-primary"
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
            <div className="space-y-4">
              {template.questions.map((question, idx) => (
                <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-3">{idx + 1}. {question.text}</p>
                  <div className="flex flex-wrap gap-4">
                    {options.map((opt) => (
                      <label key={opt.value} className="inline-flex items-center gap-2 opacity-60">
                        <input
                          type="radio"
                          disabled
                          className="accent-primary"
                        />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Informação sobre agendamento */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Para agendar avaliações reais</span>
            </div>
            <p className="text-sm text-blue-700">
              Use a página de <strong>Agendamentos</strong> para criar e enviar avaliações para os funcionários.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Fechar Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
