
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserCheck, Crown } from "lucide-react";
import { get360Questions } from "@/services/checklist/templateUtils";
import { ScaleType } from "@/types";

interface Evaluation360SelectorProps {
  onSelectTemplate: (template: any) => void;
  onCancel: () => void;
}

export function Evaluation360Selector({ onSelectTemplate, onCancel }: Evaluation360SelectorProps) {
  const [evaluationType, setEvaluationType] = useState<"colleague" | "manager" | null>(null);
  const [targetEmployee, setTargetEmployee] = useState<string>("");

  const handleCreateEvaluation = () => {
    if (!evaluationType) return;

    const questions = get360Questions(evaluationType);
    const template = {
      title: `Avaliação 360° - ${evaluationType === "colleague" ? "Colegas" : "Gestores"}`,
      description: `Avaliação anônima para ${evaluationType === "colleague" ? "colegas de trabalho" : "gestores"}`,
      type: "evaluation_360",
      scaleType: ScaleType.LIKERT_5, // ✅ Usar enum correto
      questions: questions,
      isAnonymous: true,
      restrictToSector: true,
      targetRole: evaluationType
    };

    onSelectTemplate(template);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Configurar Avaliação 360°</h2>
        <p className="text-muted-foreground">
          Configure uma avaliação anônima entre funcionários
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-colors ${
            evaluationType === "colleague" 
              ? 'ring-2 ring-primary bg-blue-50 border-blue-200' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => setEvaluationType("colleague")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Avaliação de Colegas
            </CardTitle>
            <CardDescription>
              Funcionários avaliam colegas do mesmo nível hierárquico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Trabalho em equipe</li>
              <li>• Comunicação</li>
              <li>• Colaboração</li>
              <li>• Relacionamento profissional</li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-colors ${
            evaluationType === "manager" 
              ? 'ring-2 ring-primary bg-blue-50 border-blue-200' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => setEvaluationType("manager")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Avaliação de Gestores
            </CardTitle>
            <CardDescription>
              Funcionários avaliam seus gestores e supervisores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Liderança</li>
              <li>• Feedback e reconhecimento</li>
              <li>• Disponibilidade</li>
              <li>• Comunicação</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {evaluationType && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Configurações da Avaliação
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Tipo selecionado:</span>
              <span className="font-medium">
                {evaluationType === "colleague" ? "Avaliação de Colegas" : "Avaliação de Gestores"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Anonimato:</span>
              <span className="font-medium text-green-600">Garantido</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Restrição por setor:</span>
              <span className="font-medium text-blue-600">Ativada</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Número de perguntas:</span>
              <span className="font-medium">
                {evaluationType === "colleague" ? "8 perguntas" : "10 perguntas"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          onClick={handleCreateEvaluation}
          disabled={!evaluationType}
        >
          Criar Avaliação 360°
        </Button>
      </div>
    </div>
  );
}
