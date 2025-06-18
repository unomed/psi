
import React from "react";
import { Activity } from "lucide-react";
import { PhysicalSymptomsSection } from "./symptoms/PhysicalSymptomsSection";
import { MentalHealthSection } from "./symptoms/MentalHealthSection";
import { NutritionSection } from "./symptoms/NutritionSection";
import { ExerciseSection } from "./symptoms/ExerciseSection";
import { PreventiveCareSection } from "./symptoms/PreventiveCareSection";
import { MedicalDisclaimer } from "./symptoms/MedicalDisclaimer";

export function SymptomsGuidanceSection() {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Activity className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Saúde e Bem-estar</h2>
      </div>

      <MedicalDisclaimer />

      <PhysicalSymptomsSection 
        isExpanded={expandedCategory === 'physical'}
        onToggle={() => toggleCategory('physical')}
      />

      <MentalHealthSection 
        isExpanded={expandedCategory === 'mental'}
        onToggle={() => toggleCategory('mental')}
      />

      <NutritionSection 
        isExpanded={expandedCategory === 'nutrition'}
        onToggle={() => toggleCategory('nutrition')}
      />

      <ExerciseSection 
        isExpanded={expandedCategory === 'exercise'}
        onToggle={() => toggleCategory('exercise')}
      />

      <PreventiveCareSection 
        isExpanded={expandedCategory === 'preventive'}
        onToggle={() => toggleCategory('preventive')}
      />
    </div>
  );
}
