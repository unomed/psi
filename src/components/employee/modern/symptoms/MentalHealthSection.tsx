
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, ChevronRight, ChevronDown, Info } from "lucide-react";
import { mentalHealthSymptoms } from "./symptomsData";

interface MentalHealthSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function MentalHealthSection({ isExpanded, onToggle }: MentalHealthSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span>Saúde Mental</span>
            <Badge variant="secondary">{mentalHealthSymptoms.length}</Badge>
          </div>
          {isExpanded ? 
            <ChevronDown className="h-5 w-5" /> : 
            <ChevronRight className="h-5 w-5" />
          }
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              A Unomed não possui psicólogo(a) em sua equipe. 
              Para questões de saúde mental, recomendamos buscar profissionais especializados.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            {mentalHealthSymptoms.map((symptom, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{symptom.name}</h4>
                <p className="text-sm text-gray-600">{symptom.guidance}</p>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
