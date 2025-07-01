
import type { SectorData } from "./SectorCard";
import { SectorCard } from "./SectorCard";

interface SectorGridProps {
  sectors: SectorData[];
  onSectorClick: (sector: SectorData) => void;
}

export function SectorGrid({ sectors, onSectorClick }: SectorGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sectors.map((sector) => (
        <SectorCard 
          key={sector.id} 
          sector={sector} 
          onClick={() => onSectorClick(sector)}
        />
      ))}
    </div>
  );
}
