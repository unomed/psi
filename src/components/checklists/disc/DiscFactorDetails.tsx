
import { DiscFactor } from "@/types/checklist";
import { DiscFactorCard } from "@/components/checklists/DiscFactorCard";
import { discFactors } from "./DiscFactorsData";

interface DiscFactorDetailsProps {
  dominantFactor: string;
}

export function DiscFactorDetails({ dominantFactor }: DiscFactorDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Entenda seu perfil dominante</h3>
      <DiscFactorCard factor={discFactors[dominantFactor as keyof typeof discFactors]} />
      
      <h3 className="text-lg font-medium mt-4">Todos os perfis DISC</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(discFactors).map((factor) => (
          <DiscFactorCard 
            key={factor.type} 
            factor={factor} 
            className={factor.type !== dominantFactor ? "opacity-70" : ""}
          />
        ))}
      </div>
    </div>
  );
}
