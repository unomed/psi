
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Mock data - this will need to be replaced with real data
const SECTORS = [
  { id: "sector-1", companyId: "comp-1", name: "Administrativo" },
  { id: "sector-2", companyId: "comp-1", name: "Operacional" },
  { id: "sector-3", companyId: "comp-2", name: "Comercial" },
  { id: "sector-4", companyId: "comp-2", name: "Financeiro" },
];

interface SectorSelectorProps {
  selectedCompany: string | null;
  selectedSector: string | null;
  onSectorChange: (sectorId: string) => void;
}

export function SectorSelector({
  selectedCompany,
  selectedSector,
  onSectorChange,
}: SectorSelectorProps) {
  // Filter sectors by company
  const filteredSectors = selectedCompany
    ? SECTORS.filter(sector => sector.companyId === selectedCompany)
    : [];
    
  // Ensure we always have at least one item to select with a non-empty string value
  const sectors = filteredSectors.length > 0 
    ? filteredSectors 
    : [{ id: "no-sector", name: "Nenhum setor encontrado" }];

  return (
    <div className="space-y-2">
      <Label htmlFor="sector">Setor</Label>
      <Select
        value={selectedSector || ""}
        onValueChange={onSectorChange}
        disabled={!selectedCompany}
      >
        <SelectTrigger id="sector">
          <SelectValue placeholder="Selecione um setor" />
        </SelectTrigger>
        <SelectContent>
          {sectors.map((sector) => (
            <SelectItem key={sector.id} value={sector.id}>
              {sector.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
