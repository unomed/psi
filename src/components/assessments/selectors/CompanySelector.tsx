
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
import { useCompanies } from "@/hooks/useCompanies";

interface CompanySelectorProps {
  selectedCompany: string | null;
  onCompanyChange: (value: string) => void;
}

export function CompanySelector({ selectedCompany, onCompanyChange }: CompanySelectorProps) {
  const [open, setOpen] = useState(false);
  const { companies = [], isLoading } = useCompanies();
  
  // Garantindo que companies seja sempre um array válido
  const companiesList = Array.isArray(companies) ? companies : [];
  
  const selectedCompanyName = companiesList.find(
    company => company.id === selectedCompany
  )?.name || "";

  return (
    <div className="space-y-2">
      <Label htmlFor="company">Empresa</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isLoading}
          >
            {selectedCompanyName || "Selecione uma empresa"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar empresa..." />
            <CommandEmpty>Nenhuma empresa encontrada.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {companiesList.length > 0 ? (
                companiesList.map((company) => (
                  <CommandItem
                    key={company.id}
                    value={company.name}
                    onSelect={() => {
                      onCompanyChange(company.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCompany === company.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {company.name}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled value="no-companies">
                  Nenhuma empresa disponível
                </CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
