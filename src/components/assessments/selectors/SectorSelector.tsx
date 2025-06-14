
import React from "react";
import { useSectors } from "@/hooks/useSectors";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeSelect } from "@/components/ui/SafeSelect";
import type { Sector } from "@/types/sector"; // Assuming Sector type exists

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

  const filteredSectors = selectedCompany
    ? (sectors || []).filter(sector => sector.companyId === selectedCompany)
    : []; // SafeSelect will show "Nenhuma opção" if filteredSectors is empty and selectedCompany is present

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
      <SafeSelect<Sector>
        data={filteredSectors}
        value={selectedSector}
        onChange={onSectorChange}
        placeholder={selectedCompany ? "Selecione um setor" : "Selecione uma empresa primeiro"}
        valueField="id"
        labelField="name"
        disabled={!selectedCompany}
        className="w-full"
      />
    </div>
  );
}
