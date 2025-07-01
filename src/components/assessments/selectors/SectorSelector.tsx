
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
    : [];

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
            validSectors.map((sector) => {
              const sectorIdStr = String(sector.id);
              if (sectorIdStr.trim() === "") {
                console.error("[Assessments/SectorSelector] Attempting to render SelectItem with empty value for sector:", sector);
                return null;
              }
              return (
                <SelectItem key={sectorIdStr} value={sectorIdStr}>
                  {sector.name}
                </SelectItem>
              );
            }).filter(Boolean)
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

