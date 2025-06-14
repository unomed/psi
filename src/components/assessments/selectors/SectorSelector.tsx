
import React from "react";
import { useSectors } from "@/hooks/useSectors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { sectors, isLoading } = useSectors();
  
  const baseFilteredSectors = selectedCompany
    ? (sectors || []).filter(sector => sector.companyId === selectedCompany)
    : []; // If no company, no sectors to show from this specific filter logic, or show all if desired.
           // For now, only company-specific.

  const validSectors = baseFilteredSectors.filter(sector => 
    sector && 
    sector.id !== null &&
    sector.id !== undefined &&
    String(sector.id).trim() !== "" &&
    sector.name && 
    String(sector.name).trim() !== ""
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Setor</Label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="sector">Setor</Label>
      <Select
        value={selectedSector || "no-sector-selected"}
        onValueChange={onSectorChange}
        disabled={!selectedCompany}
      >
        <SelectTrigger id="sector">
          <SelectValue placeholder="Selecione um setor" />
        </SelectTrigger>
        <SelectContent>
          {validSectors.length > 0 ? (
            validSectors.map((sector) => (
              <SelectItem key={String(sector.id)} value={String(sector.id)}>
                {sector.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-sectors-available" disabled>
              {selectedCompany ? "Nenhum setor encontrado" : "Selecione uma empresa primeiro"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
