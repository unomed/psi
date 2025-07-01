
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Filter, CheckCircle } from "lucide-react";

interface TemplatesFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  availableTypes: string[];
  hasActiveFilters: boolean;
  clearFilters: () => void;
  filteredTemplates: any[];
}

export function TemplatesFilters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  availableTypes,
  hasActiveFilters,
  clearFilters,
  filteredTemplates
}: TemplatesFiltersProps) {
  return (
    <>
      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              {availableTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "Todos os tipos" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {hasActiveFilters && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remover todos os filtros ativos</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Resultados da busca */}
      {searchTerm && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4" />
          {filteredTemplates.length} template(s) encontrado(s) para "{searchTerm}"
        </div>
      )}
    </>
  );
}
