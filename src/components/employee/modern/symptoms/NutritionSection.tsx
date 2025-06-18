
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, ChevronRight, ChevronDown } from "lucide-react";
import { nutritionTips } from "./symptomsData";

interface NutritionSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function NutritionSection({ isExpanded, onToggle }: NutritionSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center space-x-2">
            <Apple className="h-5 w-5 text-green-500" />
            <span>Nutrição e Alimentação</span>
            <Badge variant="secondary">{nutritionTips.length}</Badge>
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
            {nutritionTips.map((tip, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{tip.topic}</h4>
                <p className="text-sm text-gray-700 mb-1">{tip.guidance}</p>
                <p className="text-xs text-gray-500">{tip.details}</p>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
