
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
  
  // Filter sectors by company
  const filteredSectors = selectedCompany
    ? sectors.filter(sector => sector.companyId === selectedCompany)
    : [];

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
        value={selectedSector || undefined}
        onValueChange={onSectorChange}
        disabled={!selectedCompany}
      >
        <SelectTrigger id="sector">
          <SelectValue placeholder="Selecione um setor" />
        </SelectTrigger>
        <SelectContent>
          {filteredSectors.map((sector) => {
            const sectorId = sector.id || `sector-${sector.name?.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`;
            return (
              <SelectItem key={sectorId} value={sectorId}>
                {sector.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
