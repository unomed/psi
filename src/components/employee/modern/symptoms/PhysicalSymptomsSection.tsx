
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, ChevronRight, ChevronDown } from "lucide-react";
import { physicalSymptoms } from "./symptomsData";

interface PhysicalSymptomsSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function PhysicalSymptomsSection({ isExpanded, onToggle }: PhysicalSymptomsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-5 w-5 text-blue-500" />
            <span>Sintomas Físicos</span>
            <Badge variant="secondary">{physicalSymptoms.length}</Badge>
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
            {physicalSymptoms.map((symptom, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{symptom.name}</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Exames sugeridos:</p>
                  <div className="flex flex-wrap gap-2">
                    {symptom.exams.map((exam, examIndex) => (
                      <Badge key={examIndex} variant="outline" className="text-xs">
                        {exam}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
