
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RoleData } from "./RoleCard";

interface SkillsAssessmentProps {
  role: RoleData;
  selectedSkills: string[];
  onSkillToggle: (skill: string) => void;
}

export function SkillsAssessment({ role, selectedSkills, onSkillToggle }: SkillsAssessmentProps) {
  const matchPercentage = role.requiredSkills.length > 0
    ? Math.round((selectedSkills.filter(skill => role.requiredSkills.includes(skill)).length / role.requiredSkills.length) * 100)
    : 0;

  // Determine match level
  const getMatchLevel = () => {
    if (matchPercentage >= 80) return { label: "Alto", color: "text-green-600" };
    if (matchPercentage >= 50) return { label: "Médio", color: "text-amber-600" };
    return { label: "Baixo", color: "text-red-600" };
  };

  const matchLevel = getMatchLevel();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Avaliação de Competências</CardTitle>
        <CardDescription>
          Verifique a compatibilidade de habilidades com a função de {role.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Compatibilidade</span>
            <span className={`font-bold ${matchLevel.color}`}>{matchPercentage}% - {matchLevel.label}</span>
          </div>
          <Progress value={matchPercentage} className="h-2" />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Habilidades requeridas:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {role.requiredSkills.map((skill) => (
              <div key={skill} className="flex items-start space-x-2">
                <Checkbox 
                  id={`skill-${skill}`} 
                  checked={selectedSkills.includes(skill)}
                  onCheckedChange={() => onSkillToggle(skill)}
                />
                <Label htmlFor={`skill-${skill}`} className="text-sm leading-tight cursor-pointer">
                  {skill}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">Análise de Compatibilidade:</h4>
          {matchPercentage >= 80 ? (
            <p className="text-sm text-green-600">
              Alto nível de compatibilidade com esta função. Recomendado para exercer esta atividade.
            </p>
          ) : matchPercentage >= 50 ? (
            <p className="text-sm text-amber-600">
              Compatibilidade média com esta função. Pode requerer treinamento adicional em algumas competências.
            </p>
          ) : (
            <p className="text-sm text-red-600">
              Baixa compatibilidade com esta função. Recomendado verificar outras funções com melhor adequação ao perfil.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
