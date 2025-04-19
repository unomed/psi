
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);
  const { sectors = [], isLoading } = useSectors();

  // Ensure we're always working with an array and properly filtering
  const filteredSectors = selectedCompany && Array.isArray(sectors)
    ? sectors.filter(sector => sector.companyId === selectedCompany)
    : [];

  const selectedSectorName = filteredSectors.find(
    sector => sector.id === selectedSector
  )?.name || "";

  return (
    <div className="space-y-2">
      <Label htmlFor="sector">Setor</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={!selectedCompany || isLoading}
          >
            {selectedSectorName || (selectedCompany ? "Selecione um setor" : "Primeiro selecione uma empresa")}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar setor..." />
            <CommandEmpty>Nenhum setor encontrado.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {filteredSectors.length > 0 ? (
                filteredSectors.map((sector) => (
                  <CommandItem
                    key={sector.id}
                    onSelect={() => {
                      onSectorChange(sector.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSector === sector.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {sector.name}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>Nenhum setor disponível</CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
