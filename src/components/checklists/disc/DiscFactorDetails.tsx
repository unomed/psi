
import { DiscFactor, DiscFactorType } from "@/types";
import { DiscFactorCard } from "@/components/checklists/DiscFactorCard";
import { discFactors } from "./DiscFactorsData";

interface DiscFactorDetailsProps {
  dominantFactor: string;
}

export function DiscFactorDetails({ dominantFactor }: DiscFactorDetailsProps) {
  // Convert dominantFactor string to DiscFactorType if valid, or handle non-DISC factors
  const isValidDiscFactor = (factor: string): factor is DiscFactorType => {
    return Object.values(DiscFactorType).includes(factor as DiscFactorType);
  };
  
  // Get the disc factor based on dominantFactor if it's a valid DISC factor
  const dominantDiscFactor = isValidDiscFactor(dominantFactor) ? 
    discFactors[dominantFactor as DiscFactorType] : undefined;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Entenda seu perfil dominante</h3>
      
      {dominantDiscFactor ? (
        <DiscFactorCard factor={dominantDiscFactor} />
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-lg font-medium">{dominantFactor}</p>
          <p className="text-sm text-gray-600 mt-2">
            Este é seu fator dominante na avaliação.
          </p>
        </div>
      )}
      
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
