
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, ChevronRight, ChevronDown } from "lucide-react";
import { exerciseTips } from "./symptomsData";

interface ExerciseSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function ExerciseSection({ isExpanded, onToggle }: ExerciseSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-5 w-5 text-orange-500" />
            <span>Exercícios e Atividade Física</span>
            <Badge variant="secondary">{exerciseTips.length}</Badge>
          </div>
          {isExpanded ? 
            <ChevronDown className="h-5 w-5" /> : 
            <ChevronRight className="h-5 w-5" />
          }
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {exerciseTips.map((exercise, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{exercise.activity}</h4>
                <div className="space-y-1">
                  <p className="text-sm text-blue-600 font-medium">Frequência: {exercise.frequency}</p>
                  <p className="text-xs text-gray-600">{exercise.benefits}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
