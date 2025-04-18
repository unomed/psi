
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useSectors } from "@/hooks/useSectors";

interface SectorSelectorProps {
  selectedCompany: string | null;
  selectedSector: string | null;
  onSectorChange: (value: string) => void;
}

export function SectorSelector({ 
  selectedCompany, 
  selectedSector, 
  onSectorChange 
}: SectorSelectorProps) {
  const { sectors, isLoading } = useSectors();

  const filteredSectors = selectedCompany 
    ? sectors.filter(sector => sector.companyId === selectedCompany)
    : [];

  return (
    <div className="space-y-2">
      <Label htmlFor="sector">Setor</Label>
      <Select 
        onValueChange={onSectorChange} 
        value={selectedSector || undefined}
        disabled={!selectedCompany || isLoading}
      >
        <SelectTrigger id="sector">
          <SelectValue placeholder={selectedCompany ? "Selecione um setor" : "Primeiro selecione uma empresa"} />
        </SelectTrigger>
        <SelectContent>
          {filteredSectors.map((sector) => (
            <SelectItem key={sector.id} value={sector.id}>
              {sector.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
