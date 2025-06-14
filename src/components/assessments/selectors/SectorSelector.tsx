
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
  
  // Filter sectors by company and ensure valid data
  const filteredSectors = selectedCompany
    ? sectors.filter(sector => 
        sector && 
        sector.companyId === selectedCompany &&
        sector.id && 
        sector.id.toString().trim() !== "" &&
        sector.name && 
        sector.name.trim() !== ""
      )
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
        value={selectedSector || "no-sector-selected"}
        onValueChange={onSectorChange}
        disabled={!selectedCompany}
      >
        <SelectTrigger id="sector">
          <SelectValue placeholder="Selecione um setor" />
        </SelectTrigger>
        <SelectContent>
          {filteredSectors.length > 0 ? (
            filteredSectors.map((sector) => (
              <SelectItem key={sector.id} value={String(sector.id)}>
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
