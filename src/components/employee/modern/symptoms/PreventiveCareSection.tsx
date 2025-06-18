
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ChevronRight, ChevronDown } from "lucide-react";
import { preventiveCare } from "./symptomsData";

interface PreventiveCareSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function PreventiveCareSection({ isExpanded, onToggle }: PreventiveCareSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle 
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-indigo-500" />
            <span>Cuidados Preventivos</span>
            <Badge variant="secondary">{preventiveCare.length}</Badge>
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
            {preventiveCare.map((care, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{care.care}</h4>
                <div className="space-y-1">
                  <p className="text-sm text-indigo-600 font-medium">Frequência: {care.frequency}</p>
                  <p className="text-xs text-gray-600">{care.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
