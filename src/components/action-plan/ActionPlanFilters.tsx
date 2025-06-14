
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { ActionFilters } from "@/types/actionPlan";

interface ActionPlanFiltersProps {
  filters: ActionFilters;
  onFiltersChange: (filters: ActionFilters) => void;
}

export function ActionPlanFilters({ filters, onFiltersChange }: ActionPlanFiltersProps) {
  const handleFilterChange = (key: keyof ActionFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      department: "all",
      responsibles: "all",
      priority: "all"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Departamento</label>
            <select 
              className="border p-2 w-full rounded"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="atendimento">Atendimento</option>
              <option value="vendas">Vendas</option>
              <option value="producao">Produção</option>
              <option value="rh">Recursos Humanos</option>
              <option value="ti">TI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Responsável</label>
            <select 
              className="border p-2 w-full rounded"
              value={filters.responsibles}
              onChange={(e) => handleFilterChange('responsibles', e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="maria">Maria Silva (RH)</option>
              <option value="joao">João Pereira (SESMT)</option>
              <option value="carlos">Carlos Mendes (Supervisor)</option>
              <option value="joana">Joana Lima (TI)</option>
              <option value="ana">Ana Oliveira (Produção)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prioridade</label>
            <select 
              className="border p-2 w-full rounded"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2">
            <Filter className="mr-2 h-4 w-4" />
            Aplicar Filtros
          </Button>
          <Button variant="ghost" onClick={handleClearFilters}>
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
